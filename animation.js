let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = canvas.width / 2;
let y = canvas.height / 2;
let speed = 0.01;
let angle = 0;
let bhScale = Math.min(canvas.width, canvas.height) / 1080;

const mouse = { x: undefined, y: undefined };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bhScale = Math.min(canvas.width, canvas.height) / 1080;
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

        if (distance < 200 * bhScale){
            this.x += dx * 0.005;
            this.y += dy * 0.005;
            this.x += (dy / distance) * 4;
            this.y -= (dx / distance) * 4;
        }

        if (distance < 65 * bhScale){
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            return;
        }

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        context.fill();
        context.closePath();
    }
}

const stars = [];
for (let i = 0; i < 1000; i++){
    stars.push(new Star(canvas.height, canvas.width));
}

function drawGrid(){
    const gridSize = 80;
    context.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    context.lineWidth = 1;

    for (let i = -800; i <= canvas.width + 800; i += gridSize){
        context.beginPath();
        let isDrawing = false;
        for (let j = -800; j <= canvas.height + 800; j += 10){
            let dx = x - i;
            let dy = y - j;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50 * bhScale){
                isDrawing = false;
                continue;
            }

            let force = 12000 / distance;
            if (force > distance - 50 * bhScale) force = distance - 50 * bhScale;

            let warpedX = i + (dx / distance) * force;
            let warpedY = j + (dy / distance) * force;

            if (!isDrawing){
                context.moveTo(warpedX, warpedY);
                isDrawing = true;
            } else {
                context.lineTo(warpedX, warpedY);
            }
        }
        context.stroke();
    }

    for (let j = -800; j <= canvas.height + 800; j += gridSize){
        context.beginPath();
        let isDrawing = false;
        for (let i = -800; i <= canvas.width + 800; i += 10){
            let dx = x - i;
            let dy = y - j;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50){
                isDrawing = false;
                continue;
            }

            let force = 12000 / distance;
            if (force > distance - 50) force = distance - 50;

            let warpedX = i + (dx / distance) * force;
            let warpedY = j + (dy / distance) * force;

            if (!isDrawing){
                context.moveTo(warpedX, warpedY);
                isDrawing = true;
            } else {
                context.lineTo(warpedX, warpedY);
            }
        }
        context.stroke();
    }
}

function animate(){   
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    stars.forEach(star=>{
        star.makeStar();
    });

    if (mouse.x !== undefined){
        x += (mouse.x - x) * speed;
        y += (mouse.y - y) * speed;
    }

    const gradient = context.createRadialGradient(x, y, 50 * bhScale, x, y, 100 * bhScale);
    gradient.addColorStop(0, 'black');
    gradient.addColorStop(0.1, 'hsla(49, 96%, 76%, 1.00)');
    gradient.addColorStop(0.4, 'rgba(184, 194, 38, 0.65)');
    gradient.addColorStop(1, 'rgba(255, 150, 0, 0)');

    context.save();
    context.shadowBlur = 40;
    context.shadowColor = 'rgba(184, 194, 38, 1)';
    context.beginPath();
    context.arc(x, y, 90 * bhScale, 0, Math.PI * 2, false);
    context.fillStyle = gradient;
    context.fill();
    context.closePath();
    context.restore();

    context.save();
    context.translate(x, y);
    context.rotate(angle);

    context.globalCompositeOperation = "lighter";

    context.beginPath();
    context.arc(0, 0, 70 * bhScale, 0, Math.PI * 1.2, false);
    context.lineWidth = 5;
    context.lineCap = "round";
    context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    context.shadowBlur = 15;
    context.shadowColor = 'white';
    context.stroke();
    context.closePath();

    context.beginPath();
    context.arc(0, 0, 85 * bhScale, Math.PI, Math.PI * 2.5, false);
    context.lineWidth = 8;
    context.lineCap = "round";
    context.strokeStyle = 'rgba(184, 194, 38, 0.15)';
    context.shadowBlur = 30;
    context.shadowColor = 'rgba(184, 194, 38, 1)';
    context.stroke();
    context.closePath();

    context.restore();

    angle += 0.05;

    requestAnimationFrame(animate);
}
animate();