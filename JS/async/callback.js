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

addStudent = (student, callback) => {
    setTimeout(() => {
        students.push(student);
        callback();
    }, 1000);
}

addStudent({"name":"andy", "major":"cs", "mark":80}, getStudents);
console.log("hello world");

