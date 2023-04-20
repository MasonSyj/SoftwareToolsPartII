const obj = {
    "name": "harry",
    "age": 23,
    "id": "djaaio"
}
console.log(obj);
console.log("--------separate line-------");
const jsonF = JSON.stringify(obj);
console.log("jsonFormat:" + jsonF);

const jsonG = '{"name":"sam","age":34}';
const objectised = JSON.parse(jsonG);
console.log(objectised);
console.log(objectised.toString());
console.log("object:" + objectised);
console.log("object: " + objectised.age);

const obj2 = {
    name: "tina",
    age: 24,
    id: "jfskdla"
}

console.log(obj2);
>>>>>>> 9f6f25d20adffd5bfff9733a99d0b9546aba2395
