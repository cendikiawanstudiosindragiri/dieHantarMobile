/**
 * services.js - Katalog Lengkap Layanan dieHantar Super App
 * Versi 3.0 - The Everything App
 */

// Definisikan semua layanan yang tersedia di aplikasi
const ALL_SERVICES = {
    // Kategori: Transportasi & Pengiriman
    transport: [
        { id: 'die-motor', name: 'dieMOTOR', description: 'Ojek online cepat & terjangkau', icon: 'fa-motorcycle', color: 'text-orange-500', bgColor: 'bg-orange-50' },
        { id: 'die-mobil', name: 'dieMOBIL', description: 'Perjalanan nyaman dengan mobil', icon: 'fa-car', color: 'text-blue-500', bgColor: 'bg-blue-50' },
        { id: 'die-roda-tiga', name: 'dieRODA-TIGA', description: 'Angkutan barang & penumpang fleksibel', icon: 'fa-truck-pickup', color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
        { id: 'die-kirim', name: 'dieKIRIM', description: 'Pengiriman paket instan & aman', icon: 'fa-box', color: 'text-green-500', bgColor: 'bg-green-50' },
        { id: 'die-taxi', name: 'dieTA-XI', description: 'Layanan taksi konvensional terpercaya', icon: 'fa-taxi', color: 'text-teal-500', bgColor: 'bg-teal-50' },
        { id: 'die-kereta', name: 'dieKERETA', description: 'Pesan tiket kereta antar kota', icon: 'fa-train-subway', color: 'text-purple-500', bgColor: 'bg-purple-50' },
        { id: 'die-dump-truck', name: 'dieDUMP-TRUCK', description: 'Sewa dump truck untuk proyek besar', icon: 'fa-truck-moving', color: 'text-gray-700', bgColor: 'bg-gray-100' },
    ],
    // Kategori: Makanan & Belanja
    foodAndShop: [
        { id: 'die-makan', name: 'dieMAKAN', description: 'Pesan makanan dari resto favorit', icon: 'fa-utensils', color: 'text-red-500', bgColor: 'bg-red-50' },
        { id: 'die-belanja', name: 'dieBELANJA', description: 'Belanja kebutuhan harian dari toko', icon: 'fa-store', color: 'text-sky-500', bgColor: 'bg-sky-50' },
        { id: 'die-makan-hemat', name: 'dieMAKAN HEMAT', description: 'Paket makanan murah setiap hari', icon: 'fa-hand-holding-dollar', color: 'text-rose-500', bgColor: 'bg-rose-50' },
        { id: 'die-pasar', name: 'diePASAR', description: 'Belanja bahan segar dari pasar lokal', icon: 'fa-basket-shopping', color: 'text-lime-500', bgColor: 'bg-lime-50' },
        { id: 'die-nge-date', name: 'dieNGE DATE', description: 'Rekomendasi & booking tempat kencan', icon: 'fa-heart', color: 'text-pink-500', bgColor: 'bg-pink-50' },
    ],
    // Kategori: Keuangan & Pembayaran
    fintech: [
        { id: 'die-minjam', name: 'dieMINJAM', description: 'Pinjaman dana tunai cepat cair', icon: 'fa-money-bill-wave', color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
        { id: 'die-tagihan', name: 'dieTAGIHAN', description: 'Bayar semua tagihan dalam satu aplikasi', icon: 'fa-file-invoice-dollar', color: 'text-cyan-500', bgColor: 'bg-cyan-50' },
        { id: 'die-pay-later', name: 'diePAY-LATER', description: 'Beli sekarang, bayar nanti', icon: 'fa-clock-rotate-left', color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
        { id: 'die-investasi', name: 'dieINVESTASI-DONATUR', description: 'Mulai investasi & jadi donatur', icon: 'fa-seedling', color: 'text-green-600', bgColor: 'bg-green-100' },
        { id: 'die-bpkb', name: 'dieBPKB-KENDARAAN', description: 'Jasa pengurusan & gadai BPKB', icon: 'fa-file-contract', color: 'text-slate-500', bgColor: 'bg-slate-100' },
        { id: 'die-konter', name: 'dieKONTER-DIRUMAH', description: 'Isi pulsa & paket data dari rumah', icon: 'fa-mobile-screen-button', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    ],
    // Kategori: Sosial & Komunitas
    social: [
        { id: 'die-sumbangan', name: 'dieSUMBANGAN', description: 'Donasi untuk program kemanusiaan', icon: 'fa-hand-holding-heart', color: 'text-red-600', bgColor: 'bg-red-100' },
        { id: 'die-ibadah', name: 'dieTEMPAT-IBADAH', description: 'Informasi & donasi rumah ibadah', icon: 'fa-mosque', color: 'text-teal-600', bgColor: 'bg-teal-100' },
        { id: 'die-berbagi-makanan', name: 'dieBERBAGI-MAKANAN', description: 'Berbagi makanan untuk yang membutuhkan', icon: 'fa-bowl-food', color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { id: 'die-gotong-royong', name: 'dieGOTONG-ROYONG', description: 'Ikut serta dalam kegiatan warga', icon: 'fa-people-group', color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { id: 'die-sumbang-tenaga', name: 'dieSUMBANG-TENAGA', description: 'Jadi relawan untuk acara sosial', icon: 'fa-hands-helping', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    ]
};

/**
 * Merender menu layanan utama di halaman beranda.
 * Menggabungkan beberapa layanan unggulan dari setiap kategori.
 */
function renderHomePageServices(container) {
    if (!container) return;

    const featuredServices = [
        ...ALL_SERVICES.transport.slice(0, 4), // Ambil 4 layanan transportasi teratas
        ...ALL_SERVICES.foodAndShop.slice(0, 3), // Ambil 3 layanan makanan/belanja
    ];

    container.innerHTML = `
        <div class="grid grid-cols-4 gap-4 text-center">
            ${featuredServices.map(service => `
                <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-all" onclick="handleServiceClick('${service.id}')">
                    <div class="w-12 h-12 ${service.bgColor} ${service.color} rounded-xl flex items-center justify-center mx-auto">
                        <i class="fas ${service.icon} text-lg"></i>
                    </div>
                    <p class="text-zinc-800 text-[9px] mt-2 font-black uppercase tracking-tighter">${service.name}</p>
                </div>
            `).join('')}
             <div class="bg-gray-50 p-3 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-all" onclick="switchPage('all-services')">
                <div class="w-12 h-12 bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center mx-auto">
                    <i class="fas fa-th-large text-lg"></i>
                </div>
                <p class="text-zinc-800 text-[9px] mt-2 font-black uppercase tracking-tighter">Lainnya</p>
            </div>
        </div>
    `;
}

/**
 * Merender semua kategori layanan di halaman "Semua Layanan".
 */
function renderAllServicesPage() {
    const container = document.getElementById('services-grid-transport');
    if (!container) return;

    const allCategoriesHTML = Object.keys(ALL_SERVICES).map(categoryKey => {
        const category = ALL_SERVICES[categoryKey];
        const categoryName = categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

        return `
            <div class="mb-8">
                <h3 class="text-lg font-black italic text-zinc-900 uppercase mb-4">${categoryName}</h3>
                <div class="grid grid-cols-1 gap-3">
                    ${category.map(service => `
                        <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer active:bg-gray-100 transition-colors" onclick="handleServiceClick('${service.id}')">
                            <div class="w-12 h-12 ${service.bgColor} ${service.color} rounded-xl flex items-center justify-center flex-shrink-0">
                                <i class="fas ${service.icon} text-lg"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm text-zinc-800">${service.name}</h4>
                                <p class="text-xs text-zinc-500">${service.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = allCategoriesHTML;
}

// Pastikan fungsi handleServiceClick tersedia secara global dari logic.js atau file lain

// Jadikan fungsi render tersedia secara global
window.renderHomePageServices = renderHomePageServices;
window.renderAllServicesPage = renderAllServicesPage;
// Export konstanta ALL_SERVICES agar bisa diakses dari file lain jika perlu (misal: logic.js)
window.ALL_SERVICES = ALL_SERVICES;

console.log("Service Engine (v3.0) - The Everything App - berhasil dimuat.");
