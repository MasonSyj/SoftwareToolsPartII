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
    setTimeout(() => {
        students.push(student);
    }, 1000);
}
getStudents();
addStudent({"name":"andy", "major":"cs", "mark":80});
console.log("hello world");

