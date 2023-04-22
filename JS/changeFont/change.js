const elements = document.querySelector("body");
const button = document.getElementById("change");

document.getElementById("test").addEventListener("click", () => {
    console.log("test")
})

button.addEventListener("click", () => {
    console.log("click")
    elements.body.style.fontFamily = "system-ui" 
});


