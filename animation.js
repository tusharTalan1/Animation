let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = canvas.width / 2;
let y = canvas.height / 2;
let speed = 0.05;

const mouse = { x: undefined, y: undefined };

window.addEventListener('mousemove', (e) =>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Star{
    constructor(height, width){
        this.radius = Math.random() * 1.5;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.alpha = Math.random();
        this.alphaChange = (Math.random() * 0.02) + 0.005;
    }

    makeStar(){
        this.alpha += this.alphaChange;
        if (this.alpha <= 0 || this.alpha >= 1){
            this.alphaChange = -this.alphaChange;
        }

        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200){
            this.x += dx * 0.0075;
            this.y += dy * 0.0075;
        }

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
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

    if (mouse.x !== undefined){
        x += (mouse.x - x)* speed;
        y += (mouse.y - y)* speed;
    }

    context.beginPath();
    context.arc(x, y, 80, 0, Math.PI * 2, false);
    context.lineWidth = 10;
    context.strokeStyle = "white";
    context.stroke();
    context.closePath();

    requestAnimationFrame(animate);
}
animate();