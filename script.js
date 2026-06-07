const music = document.getElementById('bgMusic');

// --- LOGIKA HITUNG MUNDUR KE 27 JUNI ---
const targetDate = new Date(new Date().getFullYear(), 5, 27); 

function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
        document.getElementById('lockScreen').innerHTML = `
            <div class="lock-card" style="border-color: #b2ff59; box-shadow: 0 0 30px rgba(178, 255, 89, 0.2);">
                <div class="status-badge" style="color: #b2ff59; text-shadow: 0 0 8px rgba(178, 255, 89, 0.6);">ACCESS GRANTED ✓</div>
                <p class="lock-sub">Siklus konvergensi waktu terpenuhi. Target aman untuk dibuka.</p>
                <button class="dev-bypass-btn" style="border-color:#b2ff59; color:#000; background:#b2ff59; font-weight:bold;" onclick="unlockSurprise()">INITIALIZE SYSTEM SURPRISE</button>
            </div>
        `;
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');
    document.getElementById('countdownTimer').innerText = 
        `${pad(days)}H : ${pad(hours)}J : ${pad(minutes)}M : ${pad(seconds)}D`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- ENGINE INTEGRASI PARTIKEL SINESTESIA ORBITAL LOVE ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationActive = false;
let heartPoints = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    calculateHeartShape();
}
window.addEventListener('resize', resizeCanvas);

function calculateHeartShape() {
    heartPoints = [];
    const pointsCount = 200; // Jumlah koordinat hati dibuat lebih padat
    const scale = Math.min(canvas.width, canvas.height) / 30; 
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 30; 

    for (let i = 0; i < pointsCount; i++) {
        let t = (i / pointsCount) * Math.PI * 2;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        heartPoints.push({
            x: centerX + x * scale,
            y: centerY + y * scale
        });
    }
}

class AdvancedParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Fase Orbit: rotasi orbital mengitari titik pusat spiral sebelum membentuk pola hati
        this.angle = Math.random() * Math.PI * 2;
        this.radiusFromCenter = Math.random() * 300 + 100;
        this.orbitSpeed = (Math.random() * 0.04 + 0.02) * (Math.random() > 0.5 ? 1 : -1);
        
        // Atribut Fisik Partikel Cahaya Mini
        this.size = Math.random() * 1.8 + 0.8;
        this.color = Math.random() > 0.35 ? `hsl(${Math.random() * 15 + 335}, 100%, 65%)` : '#b2ff59';
        this.target = null;
        this.mode = 'explode'; // Mode siklus pergerakan: 'explode' -> 'orbit' -> 'heart'
        this.speedFactor = Math.random() * 0.05 + 0.03;
    }

    update() {
        if (this.mode === 'explode') {
            // Fase Ledakan Keluar Awal Ringan
            this.radiusFromCenter += 4;
            this.angle += this.orbitSpeed * 0.5;
            this.x = canvas.width / 2 + Math.cos(this.angle) * this.radiusFromCenter;
            this.y = (canvas.height / 2 - 80) + Math.sin(this.angle) * this.radiusFromCenter;
        } 
        else if (this.mode === 'orbit') {
            // Fase Mengorbit Spiral Halus Terpusat
            this.angle += this.orbitSpeed;
            this.radiusFromCenter += (0 - this.radiusFromCenter) * 0.02; // Menciut perlahan ke arah dalam
            this.x = canvas.width / 2 + Math.cos(this.angle) * this.radiusFromCenter;
            this.y = (canvas.height / 2 - 80) + Math.sin(this.angle) * this.radiusFromCenter;
        } 
        else if (this.mode === 'heart' && this.target) {
            // Fase Tarikan Magnetik Akurat Membentuk Pola Cinta Termodifikasi
            let dx = this.target.x - this.x;
            let dy = this.target.y - this.y;
            this.x += dx * this.speedFactor;
            this.y += dy * this.speedFactor;

            // Efek Fluktuasi Mengambang saat Posisi Sudah Presisi di Kerangka Hati
            if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                this.x = this.target.x + Math.sin(Date.now() * 0.003 + this.angle) * 1.5;
                this.y = this.target.y + Math.cos(Date.now() * 0.003 + this.angle) * 1.5;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.fill();
    }
}

function startParticleSimulation() {
    resizeCanvas();
    particles = [];
    
    // Alokasi 400 partikel padat untuk hasil pola hati yang tajam dan padat
    for (let i = 0; i < 400; i++) {
        particles.push(new AdvancedParticle(canvas.width / 2, canvas.height / 2 - 80));
    }

    animationActive = true;
    renderLoop();

    // Jalur Transisi Linimasa Animasi (Timeline)
    setTimeout(() => {
        particles.forEach(p => p.mode = 'orbit');
    }, 600);

    setTimeout(() => {
        particles.forEach((p, index) => {
            p.mode = 'heart';
            p.target = heartPoints[index % heartPoints.length];
        });
    }, 1600);
}

function renderLoop() {
    if (!animationActive) return;
    // Trik pudar komposit transparan untuk menghasilkan efek ekor cahaya bercahaya (Glow Tails)
    ctx.fillStyle = 'rgba(6, 2, 11, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(renderLoop);
}

// --- PEMICU UTAMA SISTEM AKSES KEJUTAN ---
function unlockSurprise() {
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('mainSurprise').style.display = 'flex';
    document.getElementById('mainSurprise').style.flexDirection = 'column';
    document.getElementById('dialogBox').classList.add('show-dialog');

    // Trigger Animasi Partikel di Detik ke 1.5 (Tepat saat Lilin Menyala)
    setTimeout(() => { 
        startParticleSimulation();
    }, 1500);

    // Audio Autoplay Safe Handler
    music.play().catch(err => console.log("Sistem Audio Diblokir Browser. Animasi Tetap Aman Jalani Tugas.", err));
}