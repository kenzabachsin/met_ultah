const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let heartPoints = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateHeartShape();
}

function generateHeartShape() {
    heartPoints = [];
    const scale = Math.min(canvas.width, canvas.height) / 35;
    for (let i = 0; i < 200; i++) {
        let t = (i / 200) * Math.PI * 2;
        heartPoints.push({
            x: canvas.width/2 + 16*Math.pow(Math.sin(t), 3) * scale,
            y: (canvas.height/2 - 50) - (13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)) * scale
        });
    }
}

class Particle {
    constructor() {
        this.x = canvas.width/2; this.y = canvas.height/2;
        this.vx = (Math.random()-0.5)*15; this.vy = (Math.random()-0.5)*15;
        this.target = null;
    }
    update() {
        if(this.target) {
            this.x += (this.target.x - this.x) * 0.05;
            this.y += (this.target.y - this.y) * 0.05;
        } else {
            this.x += this.vx; this.y += this.vy;
            this.vx *= 0.95; this.vy *= 0.95;
        }
    }
    draw() {
        ctx.fillStyle = '#ff4081';
        ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI*2); ctx.fill();
    }
}

function startLoveParticles() {
    for(let i=0; i<200; i++) particles.push(new Particle());
    setTimeout(() => {
        particles.forEach((p, i) => p.target = heartPoints[i]);
    }, 1000);
    function animate() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

function unlockSurprise() {
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('mainSurprise').style.display = 'block';
    startLoveParticles();
    document.getElementById('bgMusic').play().catch(()=>{});
}