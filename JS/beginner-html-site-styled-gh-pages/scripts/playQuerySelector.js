const myHeading = document.querySelector("h1");
myHeading.textContent = "Hello World!";

document.querySelector("ul").addEventListener("click", alerth1);

function alerth1() {
    alert("alert, you shouldn't click h1");
}

document.addEventListener("DOMContentLoaded", function() {
			// Get the header element
			var header = document.querySelector("h1");

			// Attach an event listener to the header element
			header.addEventListener("click", function() {
				alert("Header clicked!");
			});
		});
