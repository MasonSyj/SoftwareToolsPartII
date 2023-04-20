const obj = {
    "name": "harry",
    "age": 23,
    "id": "djaaio"
}

const jsonF = JSON.stringify(obj);
console.log("jsonFormat:" + jsonF);

const jsonG = '{"name":"sam","age":34}';
const objectised = JSON.parse(jsonG);
console.log(objectised);
console.log(objectised.toString());
console.log("object:" + objectised);
console.log("object: " + "" + objectised.age);
console.log("object: " + objectised.age);
