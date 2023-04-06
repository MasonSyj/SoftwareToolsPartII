function student(name){
    this.name = name;
}

student.prototype.city = "bristol";
const sam = new student("sam");
const bob = new student("bob");
console.log(sam);
console.log(bob);
console.log(sam.city); //another problem, why no city in the above two