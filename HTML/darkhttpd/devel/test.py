#!/usr/bin/env python3
# This is run by the "run-tests" script.
import unittest
import socket
import signal
import re
import os
import random
import time

WWWROOT = "tmp.httpd.tests"

def random_bytes(n):
    return bytes([random.randint(0,255) for _ in range(n)])

def between(s, start, end):
    assert start in s, s
    p = s.index(start) + len(start)
    s = s[p:]
    assert end in s, s
    p = s.index(end)
    return s[:p]

assert between("hello world", "hell", "world") == "o "

class Conn:
    def __init__(self):
        self.port = 12346
        self.s = socket.socket()
        self.s.connect(("0.0.0.0", self.port))
        # connect throws socket.error on connection refused

    def close(self):
        self.s.close()

    def get(self, url, http_ver="1.0", endl="\n", req_hdrs={}, method="GET"):
        req = method+" "+url
        if http_ver is not None:
            req += " HTTP/"+http_ver
        req += endl
        if http_ver is not None:
            req_hdrs["User-Agent"] = "test.py"
            req_hdrs["Connection"] = "close"
            for k,v in req_hdrs.items():
                req += k+": "+v+endl
        req += endl # end of request
        self.s.send(req.encode('utf_8'))
        ret = b''
        while True:
            signal.alarm(1) # don't wait forever
            r = self.s.recv(65536)
            signal.alarm(0)
            if r == b'':
                break
            else:
                ret += r
        return ret

    def get_keepalive(self, url, endl="\n", req_hdrs={}, method="GET"):
        req = method+" "+url+" HTTP/1.1"+endl
        req_hdrs["User-Agent"] = "test.py"
        req_hdrs["Connection"] = "keep-alive"
        for k,v in req_hdrs.items():
            req += k+": "+v+endl
        req += endl # end of request
        self.s.send(req.encode('utf-8'))
        signal.alarm(1) # don't wait forever
        ret = b''
        while True:
            ret += self.s.recv(65536)
            if b'\r\n\r\n' not in ret:
                # Don't have headers yet.
                continue
            if method == "HEAD":
                # We're done.
                break
            if b'Content-Length: ' in ret:
                cl = between(ret, b'Content-Length: ', b'\r\n')
                cl = int(cl)
            else:
                cl = 0
            p = ret.index(b'\r\n\r\n') + 4
            assert len(ret) - p <= cl, [ret, p, cl]
            if len(ret) == p + cl:
                # Complete response.
                break
        signal.alarm(0)
        return ret

def parse(resp):
    """
    Parse response into status line, headers and body.
    """
    pos = resp.find(b'\r\n\r\n')
    assert pos != -1, 'response is %s' % repr(resp)
    head = resp[:pos]
    body = resp[pos+4:]
    status,head = head.split(b'\r\n', 1)
    hdrs = {}
    for line in head.split(b'\r\n'):
        k, v = line.split(b': ', 1)
        k = k.decode('utf-8')
        v = v.decode('utf-8')
        hdrs[k] = v
    return (status, hdrs, body)

class TestHelper(unittest.TestCase):
    def get(self, url, http_ver="1.0", endl="\n", req_hdrs={}, method="GET"):
        c = Conn()
        r = c.get(url, http_ver, endl, req_hdrs, method)
        c.close()
        return r

    def assertContains(self, body, *strings):
        if type(body) is not bytes:
            body = body.encode('utf-8')
        for s in strings:
            self.assertTrue(s.encode('utf-8') in body,
                    msg="\nExpected: %s\nIn response: %s" % (
                        repr(s), repr(body)))

    def assertIsIndex(self, body, path):
        self.assertContains(body,
            '<a href="../">..</a>/',
            'Generated by darkhttpd')

    def assertIsInvalid(self, body, path):
        self.assertContains(body,
            "<title>400 Bad Request</title>",
            "<h1>Bad Request</h1>\n",
            "You requested an invalid URL.\n",
            'Generated by darkhttpd')

    def assertNotFound(self, body, path):
        self.assertContains(body,
            "<title>404 Not Found</title>",
            "<h1>Not Found</h1>\n",
            "The URL you requested was not found.\n",
            'Generated by darkhttpd')

    def assertForbidden(self, body, path):
        self.assertContains(body,
            "<title>403 Forbidden</title>",
            "<h1>Forbidden</h1>\n",
            "You don't have permission to access this URL.\n",
            'Generated by darkhttpd')

    def assertUnreadable(self, body, path):
        self.assertContains(body,
            "Couldn't list directory: Permission denied\n",
            'Generated by darkhttpd')

    def drive_range(self, range_in, range_out, len_out, data_out,
            status_out = "206 Partial Content"):
        resp = self.get(self.url, req_hdrs = {"Range": "bytes="+range_in})
        status, hdrs, body = parse(resp)
        self.assertContains(status, status_out)
        self.assertEqual(hdrs["Accept-Ranges"], "bytes")
        self.assertEqual(hdrs["Content-Range"], "bytes "+range_out)
        self.assertEqual(hdrs["Content-Length"], str(len_out))
        self.assertEqual(body, data_out)

class TestDirList(TestHelper):
    def setUp(self):
        self.fn = WWWROOT+"/escape(this)name"
        with open(self.fn, "w") as f:
            f.write("x"*12345)

    def tearDown(self):
        os.unlink(self.fn)

    def test_dirlist_escape(self):
        resp = self.get("/")
        status, hdrs, body = parse(resp)
        self.assertEqual(ord("#"), 0x23)
        self.assertContains(body, "escape%28this%29name", "12345")

    def test_dotdot_first(self):
        resp = self.get("/")
        status, hdrs, body = parse(resp)
        self.assertLess(b'(', b'..')  # ( sorts before ..
        paren_pos = body.index(b'<a href="%28/">(</a>/')
        dotdot_pos = body.index(b'<a href="../">..</a>/')
        # But we special-case .. to come first
        self.assertLess(dotdot_pos, paren_pos)

class TestCases(TestHelper):
    pass # these get autogenerated in setUpModule()

def nerf(s):
    return re.sub("[^a-zA-Z0-9]", "_", s)

def makeCase(name, url, hdr_checker=None, body_checker=None,
             req_hdrs={"User-Agent": "test.py"},
             http_ver=None, endl="\n"):
    def do_test(self):
        resp = self.get(url, http_ver, endl, req_hdrs)
        if http_ver is None:
            status = ""
            hdrs = {}
            body = resp
        else:
            status, hdrs, body = parse(resp)

        if hdr_checker is not None and http_ver is not None:
            hdr_checker(self, hdrs)

        if body_checker is not None:
            body_checker(self, body)

        # FIXME: check status
        if http_ver is not None:
            prefix = b'HTTP/1.1 ' # should 1.0 stay 1.0?
            self.assertTrue(status.startswith(prefix),
                msg="%s at start of %s"%(repr(prefix), repr(status)))

    v = http_ver
    if v is None:
        v = "0.9"
    test_name = "_".join([
        "test",
        nerf(name),
        nerf("HTTP"+v),
        {"\n":"LF", "\r\n":"CRLF"}[endl],
    ])
    do_test.__name__ = test_name # hax
    setattr(TestCases, test_name, do_test)

def makeCases(name, url, hdr_checker=None, body_checker=None,
              req_hdrs={"User-Agent": "test.py"}):
    for http_ver in [None, "1.0", "1.1"]:
        for endl in ["\n", "\r\n"]:
            makeCase(name, url, hdr_checker, body_checker,
                     req_hdrs, http_ver, endl)

def makeSimpleCases(name, url, assert_name):
    makeCases(name, url, None,
        lambda self,body: getattr(self, assert_name)(body, url))

def setUpModule():
    for args in [
        ["index",                "/",               "assertIsIndex"],
        ["up dir",               "/dir/../",        "assertIsIndex"],
        ["extra slashes",        "//dir///..////",  "assertIsIndex"],
        ["no trailing slash",    "/dir/..",         "assertIsIndex"],
        ["no leading slash",     "dir/../",         "assertIsInvalid"],
        ["invalid up dir",       "/../",            "assertIsInvalid"],
        ["fancy invalid up dir", "/./dir/./../../", "assertIsInvalid"],
        ["extra slashes 2",      "//.d",            "assertNotFound"],
        ["not found",            "/not_found.txt",  "assertNotFound"],
        ["forbidden",            "/forbidden/x",    "assertForbidden"],
        ["unreadable",           "/unreadable/",    "assertUnreadable"],
        ]:
        makeSimpleCases(*args)

class TestDirRedirect(TestHelper):
    def setUp(self):
        self.url = "/mydir"
        self.fn = WWWROOT + self.url
        os.mkdir(self.fn)

    def tearDown(self):
        os.rmdir(self.fn)

    def test_dir_redirect(self):
        resp = self.get(self.url)
        status, hdrs, body = parse(resp)
        self.assertContains(status, "301 Moved Permanently")
        self.assertEqual(hdrs["Location"], self.url+"/") # trailing slash

class TestFileGet(TestHelper):
    def setUp(self):
        self.datalen = 2345
        self.data = random_bytes(self.datalen)
        self.url = '/data.jpeg'
        self.fn = WWWROOT + self.url
        with open(self.fn, 'wb') as f:
            f.write(self.data)
        self.qurl = '/what%3f.jpg'
        self.qfn = WWWROOT + '/what?.jpg'
        if os.path.exists(self.qfn):
            os.unlink(self.qfn)
        os.link(self.fn, self.qfn)

    def tearDown(self):
        os.unlink(self.fn)
        os.unlink(self.qfn)

    def get_helper(self, url):
        resp = self.get(url)
        status, hdrs, body = parse(resp)
        self.assertContains(status, "200 OK")
        self.assertEqual(hdrs["Accept-Ranges"], "bytes")
        self.assertEqual(hdrs["Content-Length"], str(self.datalen))
        self.assertEqual(hdrs["Content-Type"], "image/jpeg")
        self.assertContains(hdrs["Server"], "darkhttpd/")
        assert body == self.data, [url, resp, status, hdrs, body]
        self.assertEqual(body, self.data)

    def test_file_get(self):
        self.get_helper(self.url)

    def test_file_get_urldecode(self):
        self.get_helper(''.join(['%%%02x' % ord(x) for x in self.url]))

    def test_file_get_redundant_dots(self):
        self.get_helper("/././." + self.url)

    def test_file_get_with_empty_query(self):
        self.get_helper(self.url + "?")

    def test_file_get_with_query(self):
        self.get_helper(self.url + "?action=Submit")

    def test_file_get_esc_question(self):
        self.get_helper(self.qurl)

    def test_file_get_esc_question_with_query(self):
        self.get_helper(self.qurl + '?hello=world')

    def test_file_head(self):
        resp = self.get(self.url, method="HEAD")
        status, hdrs, body = parse(resp)
        self.assertContains(status, "200 OK")
        self.assertEqual(hdrs["Accept-Ranges"], "bytes")
        self.assertEqual(hdrs["Content-Length"], str(self.datalen))
        self.assertEqual(hdrs["Content-Type"], "image/jpeg")

    def test_if_modified_since(self):
        resp1 = self.get(self.url, method="HEAD")
        status, hdrs, body = parse(resp1)
        lastmod = hdrs["Last-Modified"]

        resp2 = self.get(self.url, method="GET", req_hdrs =
            {"If-Modified-Since": lastmod })
        status, hdrs, body = parse(resp2)
        self.assertContains(status, "304 Not Modified")
        self.assertEqual(hdrs["Accept-Ranges"], "bytes")
        self.assertFalse("Last-Modified" in hdrs)
        self.assertFalse("Content-Length" in hdrs)
        self.assertFalse("Content-Type" in hdrs)

    def test_range_single(self):
        self.drive_range("5-5", "5-5/%d" % self.datalen,
                1, self.data[5:6])

    def test_range_single_first(self):
        self.drive_range("0-0", "0-0/%d" % self.datalen,
                1, self.data[0:1])

    def test_range_single_last(self):
        self.drive_range("%d-%d"%(self.datalen-1, self.datalen-1),
        "%d-%d/%d"%(self.datalen-1, self.datalen-1, self.datalen),
        1, self.data[-1:])

    def test_range_single_bad(self):
        resp = self.get(self.url, req_hdrs = {"Range":
            "bytes=%d-%d"%(self.datalen, self.datalen)})
        status, hdrs, body = parse(resp)
        self.assertContains(status, "416 Requested Range Not Satisfiable")

    def test_range_reasonable(self):
        self.drive_range("10-20", "10-20/%d" % self.datalen,
            20-10+1, self.data[10:20+1])

    def test_range_start_given(self):
        self.drive_range("10-", "10-%d/%d" % (self.datalen-1, self.datalen),
            self.datalen-10, self.data[10:])

    def test_range_end_given(self):
        self.drive_range("-25",
            "%d-%d/%d"%(self.datalen-25, self.datalen-1, self.datalen),
            25, self.data[-25:])

    def test_range_beyond_end(self):
        # expecting same result as test_range_end_given
        self.drive_range("%d-%d"%(self.datalen-25, self.datalen*2),
            "%d-%d/%d"%(self.datalen-25, self.datalen-1, self.datalen),
            25, self.data[-25:])

    def test_range_end_given_oversize(self):
        # expecting full file
        self.drive_range("-%d"%(self.datalen*3),
            "0-%d/%d"%(self.datalen-1, self.datalen),
            self.datalen, self.data)

    def test_range_bad_start(self):
        resp = self.get(self.url, req_hdrs = {"Range": "bytes=%d-"%(
            self.datalen*2)})
        status, hdrs, body = parse(resp)
        self.assertContains(status, "416 Requested Range Not Satisfiable")

    def test_range_backwards(self):
        resp = self.get(self.url, req_hdrs = {"Range": "bytes=20-10"})
        status, hdrs, body = parse(resp)
        self.assertContains(status, "416 Requested Range Not Satisfiable")

    def test_lowercase_header(self):
        resp = self.get(self.url, req_hdrs = {"range": "bytes=20-10"})
        status, hdrs, body = parse(resp)
        self.assertContains(status, "416 Requested Range Not Satisfiable")

class TestKeepAlive(TestFileGet):
    """
    Run all of TestFileGet but with a single long-lived connection.
    """
    def setUp(self):
        TestFileGet.setUp(self)
        self.conn = Conn()

    def tearDown(self):
        self.conn.close()

    def get(self, url, endl="\n", req_hdrs={}, method="GET"):
        return self.conn.get_keepalive(url, endl, req_hdrs, method)

def make_large_file(fn, boundary, data):
    with open(fn, 'wb') as f:
        pos = boundary - (len(data) // 2)
        f.seek(pos)
        assert f.tell() == pos
        assert f.tell() < boundary
        f.write(data)
        filesize = f.tell()
        assert filesize == pos + len(data), (filesize, pos, len(data))
        assert filesize > boundary
    return (pos, filesize)

class TestLargeFile2G(TestHelper):
    BOUNDARY = 1<<31

    def setUp(self):
        self.datalen = 4096
        self.data = random_bytes(self.datalen)
        self.url = "/big.jpeg"
        self.fn = WWWROOT + self.url
        self.filepos, self.filesize = make_large_file(
            self.fn, self.BOUNDARY, self.data)

    def tearDown(self):
        os.unlink(self.fn)

    def drive_start(self, ofs):
        req_start = self.BOUNDARY + ofs
        req_end = req_start + self.datalen//4 - 1
        range_in = "%d-%d"%(req_start, req_end)
        range_out = "%s/%d"%(range_in, self.filesize)

        data_start = req_start - self.filepos
        data_end = data_start + self.datalen//4

        self.drive_range(range_in, range_out, self.datalen//4,
            self.data[data_start:data_end])

    def test_largefile_head(self):
        resp = self.get(self.url, method="HEAD")
        status, hdrs, body = parse(resp)
        self.assertContains(status, "200 OK")
        self.assertEqual(hdrs["Accept-Ranges"], "bytes")
        self.assertEqual(hdrs["Content-Length"], str(self.filesize))
        self.assertEqual(hdrs["Content-Type"], "image/jpeg")

    def test_largefile__3(self): self.drive_start(-3)
    def test_largefile__2(self): self.drive_start(-2)
    def test_largefile__1(self): self.drive_start(-1)
    def test_largefile_0(self): self.drive_start(0)
    def test_largefile_1(self): self.drive_start(1)
    def test_largefile_2(self): self.drive_start(2)
    def test_largefile_3(self): self.drive_start(3)

class TestLargeFile4G(TestLargeFile2G):
    BOUNDARY = 1<<32

class TestLargeMtime(TestHelper):
    def setUp(self):
        self.url = '/large_mtime'
        self.fn = WWWROOT + self.url
        with open(self.fn, 'wb') as f:
            f.write(b'x')
        # A timestamp in the year 10,000
        t = int(time.mktime((10000,3,14,1,2,3,0,0,-1)))
        os.utime(self.fn, (t, t))

    def tearDown(self):
        os.unlink(self.fn)

    def test_file_get(self):
        resp = self.get(self.url)
        status, hdrs, body = parse(resp)
        self.assertContains(status, "200 OK")

if __name__ == '__main__':
    setUpModule()
    unittest.main()

# vim:set ts=4 sw=4 et:
