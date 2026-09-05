let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
var windowHight = window.innerHeight;
var windowWidth = window.innerWidth;
canvas.width = windowWidth;
canvas.height = windowHight;


let speedx = 3;
let speedy = 3;
let x = 99;
let y = 99;

class Star {
    constructor(height, width){
        this.radius = Math.random();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
    }


    makeStar(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = "white";
        context.fill();
        context.closePath();
    }
}



const stars = [];
for (let i = 0; i < 500; i++){
    stars.push(new Star(canvas.height, canvas.width));
}


function animate(){
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star =>{
        star.makeStar();
    });

    context.beginPath();
    context.arc(x, y, 80, 0, Math.PI * 2, false);
    context.lineWidth = 10;
    context.strokeStyle = "white";
    context.stroke();
    context.closePath();

    x += speedx;
    y += speedy;

    requestAnimationFrame(animate);
}
animate();












