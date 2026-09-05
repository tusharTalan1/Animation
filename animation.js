let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
var windowHight = window.innerHeight;
var windowWidth = window.innerWidth;
canvas.width = windowWidth;
canvas.height = windowHight;




context.beginPath();
context.arc(780, 350, 100, 0, Math.PI * 2, false);
context.lineWidth = 10;
context.strokeStyle = "white";
context.stroke();
context.closePath();

