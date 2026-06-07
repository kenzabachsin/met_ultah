const music = document.getElementById('bgMusic');

// --- LOGIKA HITUNG MUNDUR KE 27 JUNI ---
const targetDate = new Date(new Date().getFullYear(), 5, 27); 

function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
        document.getElementById('lockScreen').innerHTML = `
            <div class="warning-box" style="border-color: #b2ff59; background: rgba(178,255,89,0.1);">
                <div style="color:#b2ff59; font-size:1.6rem; margin-bottom:15px; font-weight:bold;">AKSES TERBUKA! ✅</div>
                <button style="background:#b2ff59; color:#000; border:3px solid #111; padding:12px 25px; font-weight:bold; cursor:pointer;" onclick="unlockSurprise()">BUKA SEKARANG</button>
            </div>
        `;
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('countdownTimer').innerText = 
        `${days}H : ${hours}J : ${minutes}M : ${seconds}D`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- ENGINE ANIMASI PARTIKEL MEMBENTUK LOVE ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationActive = false;
let heartPoints = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateHeartShape();
}
window.addEventListener('resize', resizeCanvas);

function generateHeartShape() {
    heartPoints = [];
    const numPoints = 180; 
    const scale = Math.min(canvas.width, canvas.height) / 32; 
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 40; 

    for (let i = 0; i < numPoints; i++) {
        let t = (i / numPoints) * Math.PI * 2;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        heartPoints.push({
            x: centerX + x * scale,
            y: centerY + y * scale
        });
    }
}

class Particle {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.radius = Math.random() * 2.5 + 1;
        this.color = Math.random() > 0.4 ? `hsl(${Math.random() * 20 + 330}, 100%, 65%)` : '#b2ff59'; 
        this.alpha = 1;
        this.target = null;
        this.isAssembling = false;
        this.friction = 0.96;
    }

    update() {
        if (!this.isAssembling) {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= this.friction;
            this.vy *= this.friction;
        } else if (this.target) {
            let dx = this.target.x - this.x;
            let dy = this.target.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 1) {
                this.x += (dx / dist) * (dist * 0.08);
                this.y += (dy / dist) * (dist * 0.08);
            } else {
                this.x = this.target.x + (Math.random() - 0.5) * 1.5;
                this.y = this.target.y + (Math.random() - 0.5) * 1.5;
            }
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    resizeCanvas();
    particles = [];
    const startX = canvas.width / 2;
    const startY = canvas.height / 2 - 100;

    for (let i = 0; i < 350; i++) {
        particles.push(new Particle(startX, startY));
    }

    animationActive = true;
    animate();

    setTimeout(() => {
        particles.forEach((p, index) => {
            p.isAssembling = true;
            p.target = heartPoints[index % heartPoints.length];
        });
    }, 1200);
}

function animate() {
    if (!animationActive) return;
    ctx.fillStyle = 'rgba(18, 7, 32, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// --- AKSI UNLOCK / BUKA KEJUTAN ---
function unlockSurprise() {
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('mainSurprise').style.display = 'block';

    music.play().then(() => {
        music.pause();
        music.currentTime = 0;
        
        setTimeout(() => { 
            music.play(); 
            initParticles();
        }, 1800);
    }).catch(e => console.log(e));

    document.getElementById('dialogBox').classList.add('show-dialog');
}