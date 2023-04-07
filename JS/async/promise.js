const students = [
    {"name":"sam", "major":"cs", "mark":58},
    {"name":"tom", "major":"ee", "mark":62},
    {"name":"bob", "major":"em", "mark":66}
]

getStudents = () => {
    setTimeout(() => {
       students.forEach((student) => {
            console.log(student);
       }) 
    }, 2000);
}

addStudent = (student) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            students.push(student);
            const error = false;

            if (!error){
                resolve();
            } else {
                reject("something went wrong");
            } 
        }, 1000);    
    });
    
}
addStudent({"name":"andy", "major":"cs", "mark":80})
    .then(getStudents)
    .catch(err => console.log(err));

console.log("hello world");

