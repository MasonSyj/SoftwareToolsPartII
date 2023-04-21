password = () => {
    var cnt = 0;
    var password = prompt("Please enter the password:", '');
    while (true){
        if (!password){
            history.go(-1);
        }
        if (password === 'MasonSyj'){
            alert("password correct!");
            break;
        } else {
            password = prompt("Wrong. Please enter again!");
        }
        

    }
}

document.write(password());
