function unlockSurprise() {
    // 1. Hilangkan Lock Screen
    document.getElementById('lockScreen').style.display = 'none';
    
    // 2. Munculkan Container
    const main = document.getElementById('mainSurprise');
    main.style.display = 'block';

    // 3. Jalankan musik
    document.getElementById('bgMusic').play().catch(()=>{});

    // 4. Setelah sedikit jeda, jalankan animasi partikel
    setTimeout(() => {
        startLoveParticles();
    }, 500);
}

// Tambahkan fungsi startLoveParticles, generateHeartShape, dan class FlatParticle dari kode sebelumnya di sini.
// (Gunakan kode yang sudah saya berikan di pesan sebelumnya untuk bagian partikelnya)