function first(){
    console.log(a);
    function second(){

    }
}

var a = 10;
first();

function f(){
    console.log(b);
    function s() {
        var b = 10;
    }
}
f();