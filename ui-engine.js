
/**
 * ui-engine.js - Mengelola semua interaksi dan transisi Antarmuka Pengguna (UI).
 * Termasuk navigasi halaman, manajemen modal, dan pembaruan visual.
 */

const allPages = document.querySelectorAll('.page-content');
const allNavButtons = document.querySelectorAll('#main-nav button');
const bookingModal = document.getElementById('modal-booking');
const mainScrollContainer = document.getElementById('main-scroll-container');

/**
 * Beralih antar halaman utama aplikasi.
 * @param {string} pageId - ID halaman tujuan (misal: 'home', 'promo', 'history').
 */
function switchPage(pageId) {
    // Sembunyikan semua halaman
    allPages.forEach(page => page.classList.add('hidden'));

    // Tampilkan halaman yang dipilih
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    } else {
        console.warn(`Halaman dengan ID 'page-${pageId}' tidak ditemukan.`);
        document.getElementById('page-home').classList.remove('hidden'); // Default ke home
    }

    // Update status aktif pada tombol navigasi
    allNavButtons.forEach(button => {
        button.classList.remove('active-tab', 'text-orange-600');
        button.classList.add('text-gray-300');

        if (button.id === `nav-${pageId}`) {
            button.classList.add('active-tab', 'text-orange-600');
            button.classList.remove('text-gray-300');
        }
    });
    
    // Selalu scroll ke atas saat berganti halaman
    if(mainScrollContainer) mainScrollContainer.scrollTo(0, 0);
}

/**
 * Membuka modal (popup) formulir pemesanan.
 * @param {object} service - Objek service yang berisi detail untuk ditampilkan di modal.
 */
function openBooking(service) {
    if (!bookingModal) return;

    const titleEl = bookingModal.querySelector('#booking-title');
    
    if (titleEl && service) {
        titleEl.textContent = service.name || 'Formulir Pemesanan';
    }
    
    bookingModal.classList.remove('hidden');
}

/**
 * Menutup modal (popup) formulir pemesanan.
 */
function closeBooking() {
    if (!bookingModal) return;
    bookingModal.classList.add('hidden');
}

// Menjadikan fungsi tersedia secara global agar bisa dipanggil dari atribut onclick di HTML
window.switchPage = switchPage;
window.openBooking = openBooking;
window.closeBooking = closeBooking;

console.log('UI Engine (v1.0) berhasil dimuat.');
