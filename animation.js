let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = canvas.width / 2;
let y = canvas.height / 2;
let speed = 0.01;
let angle = 0;
let bhScale = Math.min(canvas.width, canvas.height) / 1080;
let isStatic = true;

const mouse = { x: undefined, y: undefined };
const planets = [];
const debrisArray = [];
const stars = [];

function handleStaticMode(e) {
    e.stopPropagation();
    isStatic = true;
    document.getElementById('staticBtn').classList.add('active');
    document.getElementById('dynamicBtn').classList.remove('active');
}

function handleDynamicMode(e) {
    e.stopPropagation();
    isStatic = false;
    document.getElementById('dynamicBtn').classList.add('active');
    document.getElementById('staticBtn').classList.remove('active');
}

function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function handleMouseClick(e) {
    const colors = [
        '#8B5A2B', '#A0522D', '#CD853F', '#DEB887', 
        '#5F9EA0', '#4682B4', '#708090', '#BDB76B', '#E9967A'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const radius = Math.random() * 8 + 8;
    planets.push(new Planet(e.clientX, e.clientY, radius, color));
}

function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bhScale = Math.min(canvas.width, canvas.height) / 1080;
}

document.getElementById('staticBtn').addEventListener('click', handleStaticMode);
document.getElementById('dynamicBtn').addEventListener('click', handleDynamicMode);
window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('click', handleMouseClick);
window.addEventListener('resize', handleResize);

class Star {
    constructor(height, width) {
        this.radius = Math.random() * 1.5;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.alpha = Math.random();
        this.alphaChange = (Math.random() * 0.02) + 0.005;
    }

    updateAndDraw() {
        this.alpha += this.alphaChange;
        if (this.alpha <= 0 || this.alpha >= 1) {
            this.alphaChange = -this.alphaChange;
        }

        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200 * bhScale) {
            this.x += dx * 0.005;
            this.y += dy * 0.005;
            this.x += (dy / distance) * 4;
            this.y -= (dx / distance) * 4;
        }

        if (distance < 65 * bhScale) {
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

class Planet {
    constructor(px, py, radius, color) {
        this.x = px;
        this.y = py;
        this.radius = radius;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
    }

    update() {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let force = 80 / distance;
        if (force > 2.5) force = 2.5;

        this.vx += (dx / distance) * force;
        this.vy += (dy / distance) * force;

        this.vx += (dy / distance) * 0.4;
        this.vy -= (dx / distance) * 0.4;

        this.vx *= 0.95;
        this.vy *= 0.95;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        context.save();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        
        const grad = context.createRadialGradient(
            this.x - this.radius * 0.3, 
            this.y - this.radius * 0.3, 
            this.radius * 0.1, 
            this.x, 
            this.y, 
            this.radius
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.2, this.color);
        grad.addColorStop(1, '#000000');

        context.fillStyle = grad;
        context.fill();
        context.closePath();
        context.restore();
    }
}

class Debris {
    constructor(px, py, color) {
        this.x = px;
        this.y = py;
        this.radius = Math.random() * 3 + 1;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15;
        this.life = 150 + Math.random() * 100;
    }

    update() {
        const dx = x - this.x;
        const dy = y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let force = 800 / distance;
        if (force > 15) force = 15;

        this.vx += (dx / distance) * force;
        this.vy += (dy / distance) * force;

        if (distance < 400 * bhScale) {
            this.vx += (dy / distance) * 3;
            this.vy -= (dx / distance) * 3;
        }

        this.vx *= 0.90;
        this.vy *= 0.90;

        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw() {
        context.save();
        context.globalAlpha = Math.max(0, this.life / 250);
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.shadowBlur = 5;
        context.shadowColor = this.color;
        context.fill();
        context.closePath();
        context.restore();
    }
}

for (let i = 0; i < 1000; i++) {
    stars.push(new Star(canvas.height, canvas.width));
}

function calculateWarp(gridX, gridY) {
    let dx = x - gridX;
    let dy = y - gridY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 50 * bhScale) {
        return null;
    }

    let force = 25000 / distance;
    if (force > distance - 50 * bhScale) force = distance - 50 * bhScale;

    let warpedX = gridX + (dx / distance) * force;
    let warpedY = gridY + (dy / distance) * force;

    for (let p = 0; p < planets.length; p++) {
        let pdx = planets[p].x - gridX;
        let pdy = planets[p].y - gridY;
        let pdistance = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdistance < 5) continue;
        
        let pForce = 800 / pdistance;
        if (pForce > pdistance) pForce = pdistance;
        
        warpedX += (pdx / pdistance) * pForce;
        warpedY += (pdy / pdistance) * pForce;
    }

    return { warpedX, warpedY };
}

function drawGrid() {
    const gridSize = 80;
    context.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    context.lineWidth = 1;

    for (let i = -800; i <= canvas.width + 800; i += gridSize) {
        context.beginPath();
        let isDrawing = false;
        for (let j = -800; j <= canvas.height + 800; j += 10) {
            let warp = calculateWarp(i, j);
            if (!warp) {
                isDrawing = false;
                continue;
            }
            if (!isDrawing) {
                context.moveTo(warp.warpedX, warp.warpedY);
                isDrawing = true;
            } else {
                context.lineTo(warp.warpedX, warp.warpedY);
            }
        }
        context.stroke();
    }

    for (let j = -800; j <= canvas.height + 800; j += gridSize) {
        context.beginPath();
        let isDrawing = false;
        for (let i = -800; i <= canvas.width + 800; i += 10) {
            let warp = calculateWarp(i, j);
            if (!warp) {
                isDrawing = false;
                continue;
            }
            if (!isDrawing) {
                context.moveTo(warp.warpedX, warp.warpedY);
                isDrawing = true;
            } else {
                context.lineTo(warp.warpedX, warp.warpedY);
            }
        }
        context.stroke();
    }
}

function updateEntities() {
    stars.forEach(star => {
        star.updateAndDraw();
    });

    for (let i = planets.length - 1; i >= 0; i--) {
        const p = planets[i];
        p.update();
        p.draw();
        
        const dx = x - p.x;
        const dy = y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200 * bhScale) {
            for (let j = 0; j < 15; j++) {
                debrisArray.push(new Debris(p.x, p.y, p.color));
            }
            planets.splice(i, 1);
        }
    }

    for (let i = debrisArray.length - 1; i >= 0; i--){
        const d = debrisArray[i];
        d.update();
        d.draw();
        
        const dx = x - d.x;
        const dy = y - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 80 * bhScale || d.life <= 0){
            debrisArray.splice(i, 1);
        }
    }
}

function updateBlackHolePosition() {
    let targetX = isStatic ? canvas.width / 2 : (mouse.x !== undefined ? mouse.x : x);
    let targetY = isStatic ? canvas.height / 2 : (mouse.y !== undefined ? mouse.y : y);
    x += (targetX - x) * speed;
    y += (targetY - y) * speed;
}

function drawBlackHoleCore() {
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
}

function drawAccretionDisk() {
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
}

function animate() {
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    updateEntities();
    updateBlackHolePosition();
    drawBlackHoleCore();
    drawAccretionDisk();

    angle += 0.05;
    requestAnimationFrame(animate);
}

animate();