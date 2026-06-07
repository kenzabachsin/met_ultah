const music = document.getElementById('bgMusic');

// --- LOGIKA HITUNG MUNDUR (27 JUNI) ---
const targetDate = new Date(new Date().getFullYear(), 5, 27); 

function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
        document.getElementById('lockScreen').innerHTML = `
            <div class="lock-box" style="background:#b2ff59;">
                <h2>WAKTUNYA TIBA! 🎉</h2>
                <p>Klik tombol di bawah buat buka kadonya.</p>
                <button style="margin-top:20px; background:#111; color:#fff; padding:10px 20px; border:none; border-radius:8px; font-weight:bold; font-size:1.1rem; cursor:pointer;" onclick="unlockSurprise()">BUKA KADO</button>
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
        `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
setInterval(updateCountdown, 1000);
updateCountdown();


// --- SISTEM PARTIKEL BENTUK LOVE (CLEAN & FLAT) ---
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

// Bikin Cetakan Hati
function generateHeartShape() {
    heartPoints = [];
    const numPoints = 150; 
    const scale = Math.min(canvas.width, canvas.height) / 35; 
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 50; 

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

class FlatParticle {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        
        // Daya sebar kembang api
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.radius = Math.random() * 3 + 2; // Partikel lebih besar dan jelas
        
        // Warna cerah ala anime: Pink, Putih, Kuning
        const colors = ['#ff4081', '#ffb7d2', '#ffffff', '#fff9c4'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.target = null;
        this.isFormingHeart = false;
    }

    update() {
        if (!this.isFormingHeart) {
            // Bergerak menyebar lalu melambat
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.92;
            this.vy *= 0.92;
        } else if (this.target) {
            // Bergerak halus menuju posisi bentuk love
            let dx = this.target.x - this.x;
            let dy = this.target.y - this.y;
            this.x += dx * 0.05;
            this.y += dy * 0.05;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function startLoveParticles() {
    resizeCanvas();
    particles = [];
    const startX = canvas.width / 2;
    const startY = canvas.height / 2 - 100; // Mulai dari area lilin

    for (let i = 0; i < 300; i++) {
        particles.push(new FlatParticle(startX, startY));
    }

    animationActive = true;
    animate();

    // Setelah meledak 1 detik, mulai kumpul jadi Love
    setTimeout(() => {
        particles.forEach((p, index) => {
            p.isFormingHeart = true;
            p.target = heartPoints[index % heartPoints.length];
        });
    }, 1000);
}

function animate() {
    if (!animationActive) return;
    
    // Hapus frame sebelumnya dengan bersih (tanpa motion blur yang bikin jelek)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// --- FUNGSI BUKA KEJUTAN ---
function unlockSurprise() {
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('mainSurprise').style.display = 'block';
    document.getElementById('dialogBox').classList.add('show-dialog');

    // Memicu partikel kembang api membentuk love saat lilin menyala
    setTimeout(() => { 
        startLoveParticles();
    }, 1200);

    // Audio jalan
    music.play().catch(e => console.log("Audio diblokir browser, gapapa animasi tetep jalan."));
}