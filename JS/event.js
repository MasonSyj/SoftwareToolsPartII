turnred = () => {
    if (document.getElementById("hhh").style.color === "red"){
        document.getElementById("hhh").style.color = "black";
    } else{
        document.getElementById("hhh").style.color = "red";
    }
}

turnblue = (element) => {
    if (element.style.color === "blue"){
        element.style.color = "black";
    } else{
        element.style.color = "blue";
    }
}

add = (element) => {
    element.innerText = element.innerText + "!";
}