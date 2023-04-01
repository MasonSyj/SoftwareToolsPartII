from bs4 import BeautifulSoup
import os

with open('index.html', 'r') as html_file:
    content = html_file.read()
    soup = BeautifulSoup(content, 'lxml')

    tags = soup.find('h5')
    print(tags)

    tags = soup.find('label')
    print(tags)

    print("---------------------------------------")

    tags = soup.find_all('label')
    print(tags)

    print("---------------------------------------")

    for tag in tags:
        print(tag)
