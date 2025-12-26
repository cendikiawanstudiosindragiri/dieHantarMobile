
import { db, auth, analytics } from './firebase.js'; // Impor analytics
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { logEvent } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js"; // Impor logEvent
import { checkAuthState } from './auth.js';

// Selalu periksa status otentikasi saat modul dimuat
checkAuthState();

/**
 * Menampilkan menu layanan utama di halaman pengguna.
 * @param {HTMLElement} container - Elemen DOM untuk menampung menu.
 */
export function renderServiceMenu(container) {
    const services = [
        { id: 'hantar-barang', name: 'Hantar Barang', icon: 'fa-box' },
        { id: 'hantar-makanan', name: 'Hantar Makanan', icon: 'fa-utensils' },
        { id: 'jasa-titip', name: 'Jasa Titip', icon: 'fa-shopping-bag' },
        { id: 'sultan-service', name: 'Sultan Service', icon: 'fa-gem' }
    ];

    container.innerHTML = `
        <div class="grid grid-cols-4 gap-4 text-center">
            ${services.map(service => `
                <div class="bg-zinc-800 p-4 rounded-2xl shadow-md hover:bg-zinc-700 transition-colors cursor-pointer" onclick="handleServiceClick('${service.id}', '${service.name}')">
                    <i class="fas ${service.icon} text-indigo-400 text-2xl"></i>
                    <p class="text-white text-xs mt-2 font-bold">${service.name}</p>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Menangani event klik pada ikon layanan dan mencatatnya ke Analytics.
 * @param {string} serviceId - ID dari layanan yang diklik.
 * @param {string} serviceName - Nama dari layanan yang diklik.
 */
window.handleServiceClick = (serviceId, serviceName) => {
    // === ANALYTICS: Catat layanan mana yang diklik ===
    logEvent(analytics, 'select_content', {
        content_type: 'service',
        item_id: serviceId
    });
    console.log(`Analytics: Pengguna memilih layanan '${serviceName}'.`);

    // Lanjutkan alur aplikasi seperti biasa
    const itemName = prompt("Barang apa yang ingin Anda kirim?");
    if (itemName) {
        submitNewOrder({
            item: itemName,
            service: serviceId,
            serviceName: serviceName
        });
    }
}

/**
 * Mengirim data pesanan baru dan mencatatnya sebagai transaksi di Analytics.
 * @param {object} orderDetails - Detail pesanan dari input pengguna.
 */
async function submitNewOrder(orderDetails) {
    if (!auth.currentUser) {
        alert("Anda harus login untuk membuat pesanan.");
        return;
    }

    const orderPrice = Math.floor(Math.random() * 50000) + 10000; // Harga acak untuk demo

    try {
        const docRef = await addDoc(collection(db, "orders"), {
            item: orderDetails.item,
            service: orderDetails.service,
            origin: "Lokasi Pengguna (Placeholder)",
            destination: "Lokasi Tujuan (Placeholder)",
            price: orderPrice,
            status: "PENDING",
            customerName: auth.currentUser.displayName || "Pelanggan dieHantar",
            customerId: auth.currentUser.uid,
            createdAt: serverTimestamp()
        });

        // === ANALYTICS: Catat transaksi yang berhasil dibuat ===
        logEvent(analytics, 'purchase', {
            transaction_id: docRef.id, // Gunakan ID pesanan sebagai ID transaksi
            value: orderPrice,
            currency: 'IDR',
            items: [{
                item_id: orderDetails.service,
                item_name: orderDetails.serviceName,
                price: orderPrice
            }]
        });
        console.log(`Analytics: Transaksi '${docRef.id}' senilai ${orderPrice} IDR tercatat.`);

        console.log("Pesanan berhasil dibuat dengan ID: ", docRef.id);
        alert("Pesanan Anda telah dibuat dan sedang mencari driver!");

    } catch (e) {
        console.error("Gagal menambahkan dokumen: ", e);
        alert("Terjadi kesalahan saat membuat pesanan.");
    }
}
