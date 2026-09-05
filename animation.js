let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
var windowHight = window.innerHeight;
var windowWidth = window.innerWidth;
canvas.width = windowWidth;
canvas.height = windowHight;


let speedx = 3;
let speedy=3;
let x = 99;
let y = 99;



function animate() {
    
   
    context.beginPath();
    context.arc(x, y, 80, 0, Math.PI * 2, false);
    context.lineWidth = 10;
    context.strokeStyle = "white";
    context.stroke();
    context.closePath();
    x += speedx;  
    y += speedy;
    
    if (x + 80 > canvas.width || x - 80 < 0) {
        speedx = -speedx;
    }
    if (y + 80 > canvas.height || y - 80 < 0) {
        speedy = -speedy;
    }

    context.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
    context.fillRect(0, 0, canvas.width, canvas.height);
    

    requestAnimationFrame(animate);
}

animate();

