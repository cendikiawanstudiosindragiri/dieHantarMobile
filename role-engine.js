/**
 * role-engine.js - DEVELOPMENT PREVIEW MODE
 * 
 * NOTE: Semua logika Firebase dinonaktifkan untuk keperluan pratinjau desain.
 * Halaman ini diisi dengan data simulasi untuk review layout.
 * Otentikasi dan sinkronisasi data real-time akan berfungsi saat diintegrasikan
 * dengan konfigurasi Firebase yang valid.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("ROLE-ENGINE: Development Preview Mode Activated.");

    // --- ELEMEN UI ---
    const diepayBalanceEl = document.getElementById('diepay-balance');
    const diepayAccountEl = document.getElementById('diepay-account');
    const liveTrackingCardEl = document.getElementById('live-tracking-card');
    const waterQualityEl = document.getElementById('water-quality');
    const solarProductionEl = document.getElementById('solar-production');
    const systemStatusEl = document.getElementById('system-status');

    // 1. Memuat data dummy untuk diePAY
    if (diepayBalanceEl && diepayAccountEl) {
        diepayBalanceEl.textContent = "Rp 7.777.777";
        diepayAccountEl.textContent = "CS-SULTAN-DEV";
        console.log("Dummy diePAY data loaded.");
    }

    // 2. Memuat data dummy untuk Eco-Sultan Monitoring
    if (waterQualityEl && solarProductionEl && systemStatusEl) {
        waterQualityEl.textContent = `7.2 pH`;
        solarProductionEl.textContent = `15.7 kWh`;
        systemStatusEl.textContent = `● SIMULATED`;
        systemStatusEl.className = 'font-bold text-yellow-500';
        console.log("Dummy Eco-Sultan Monitoring data loaded.");
    }

    // 3. Menampilkan kartu Live Tracking untuk review layout
    if (liveTrackingCardEl) {
        liveTrackingCardEl.style.display = 'flex';
        console.log("Live Tracking card is shown for layout preview.");
    }

    console.log("Halaman Sultan Premium siap untuk ditinjau.");
});
