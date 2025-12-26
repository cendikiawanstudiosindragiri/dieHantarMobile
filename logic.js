
/**
 * logic.js - Otak dari semua operasi bisnis aplikasi.
 * Menangani pemesanan, pembayaran, riwayat, dan logika kompleks lainnya.
 */

import { auth, db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

let currentService = null; // Menyimpan info layanan yang sedang dipesan

/**
 * Menangani klik pada item layanan, sekarang juga menyimpan detail layanan.
 * @param {string} serviceId - ID dari layanan yang diklik.
 */
function handleServiceClick(serviceId) {
    // Cari objek service lengkap berdasarkan ID-nya
    currentService = findServiceById(serviceId);

    if (currentService) {
        console.log(`Layanan dipilih:`, currentService);
        // Panggil fungsi openBooking dari ui-engine.js
        window.openBooking(currentService);
    } else {
        console.error(`Service dengan ID '${serviceId}' tidak ditemukan.`);
    }
}

/**
 * Mencari objek service dari konstanta ALL_SERVICES.
 * @param {string} serviceId - ID layanan.
 */
function findServiceById(serviceId) {
    for (const category in window.ALL_SERVICES) {
        const found = window.ALL_SERVICES[category].find(s => s.id === serviceId);
        if (found) return found;
    }
    return null;
}

/**
 * Mengirimkan pesanan baru ke Firestore dengan detail yang lebih lengkap.
 */
async function submitOrder() {
    console.log("Memproses submitOrder...");

    const origin = document.getElementById('input-origin').value;
    const destination = document.getElementById('input-destination').value;
    const user = auth.currentUser;

    if (!origin || !destination) {
        alert("Harap isi titik jemput dan tujuan.");
        return;
    }

    if (!user) {
        alert("Anda harus login untuk membuat pesanan.");
        return;
    }
    
    if (!currentService) {
        alert("Silakan pilih jenis layanan terlebih dahulu.");
        return;
    }

    const orderButton = document.getElementById('btn-submit-order');
    orderButton.disabled = true;
    orderButton.textContent = 'Mencari Driver...';

    try {
        await addDoc(collection(db, "orders"), {
            userId: user.uid,
            userName: user.displayName,
            origin: origin,
            destination: destination,
            status: 'pending', // Status awal: mencari driver
            createdAt: serverTimestamp(),
            serviceId: currentService.id,    // <-- DETAIL BARU
            serviceName: currentService.name,  // <-- DETAIL BARU
            price: Math.floor(Math.random() * (50000 - 15000 + 1)) + 15000 // Harga acak untuk demo
        });

        document.getElementById('audio-ding').play();
        alert("Pesanan berhasil dibuat! Mencari mitra terdekat.");
        closeBooking();

    } catch (error) {
        console.error("Gagal membuat pesanan:", error);
        alert("Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.");
    } finally {
        orderButton.disabled = false;
        orderButton.textContent = 'Lanjut';
        currentService = null; // Reset setelah pesanan dibuat
    }
}

/**
 * Placeholder untuk mengirim pesan chat.
 */
function sendSultanChat() {
    const chatInput = document.getElementById('chat-input-user');
    const message = chatInput.value;
    if (message.trim() === '') return;

    console.log(`Pesan terkirim: "${message}"`);
    
    // Tampilkan di UI secara instan menggunakan komponen chat
    // (Ini hanya simulasi di sisi klien)
    if(window.dieHantarUI) {
        const chatBox = document.getElementById('chat-box-user');
        const existingMessages = Array.from(chatBox.children).map(child => {
            return { 
                text: child.querySelector('p').textContent,
                sender: child.classList.contains('justify-end') ? 'User' : 'Mitra',
                time: 'Baru saja'
            }
        });
        
        const newMessages = [...existingMessages, { text: message, sender: 'User', time: 'Baru saja' }];
        dieHantarUI.renderChat('chat-box-user', newMessages);
    }
    
    chatInput.value = '';
    alert("Fungsi chat belum terhubung ke database. Ini hanya demo UI.");
}


function openWalletAction(action) {
    console.log(`Membuka tindakan dompet: ${action}`);
    alert(`Fungsi "${action}" belum tersedia saat ini.`);
}

// MENGGANTI FUNGSI LAMA di services.js dengan yang baru di logic.js
window.handleServiceClick = handleServiceClick;

// Mengikat fungsi ke tombol yang relevan
document.addEventListener('DOMContentLoaded', () => {
    const submitOrderBtn = document.getElementById('btn-submit-order');
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', submitOrder);
    }
});

window.sendSultanChat = sendSultanChat;
window.openWalletAction = openWalletAction;

console.log("Business Logic (v2.0) - Integrated with Shared Components - berhasil dimuat.");
