var name = "johndoe";

console.log(name);

console.log(name[0]);
console.log(name[name.length]);
console.log(name[name.length - 1]);

console.log("--------------------");

var example = [1, "joe", 5.55];
for (element in example){
    console.log(element);
}
console.log("--------------------");

for (element of example){
    console.log(element);
}