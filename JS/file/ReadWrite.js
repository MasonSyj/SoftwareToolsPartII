fs = require("fs");

add = () => {
    const res = document.getElementById("res");
    res.innerText = res.innerText + document.getElementById("input").value;
    // fs.write('text', res.data, 'utf8', (err) => {
    //     if(err) throw err;
    // });
}


// Read file
// fs.readFile('text', 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });

// const data = "hello world from bristol";
// Write file
// fs.writeFile('text', data, 'utf8', (err) => {
//     if (err) throw err;
//     console.log('File has been saved!');
// });



