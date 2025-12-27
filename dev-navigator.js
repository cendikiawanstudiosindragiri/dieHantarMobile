
// dev-navigator.js

// Daftar semua halaman yang dapat dinavigasi dalam urutan yang diinginkan
const pages = [
    'onboarding.html',
    'login.html',
    'role-selection.html',
    'index.html',
    'driver.html',
    'admin-dashboard.html'
];

// Fungsi untuk membuat dan menyuntikkan tombol navigasi
function createDevNavigator() {
    // Dapatkan path halaman saat ini
    const currentPage = window.location.pathname.split('/').pop();

    // Temukan indeks halaman saat ini dalam daftar kita
    const currentIndex = pages.indexOf(currentPage);

    // Jika halaman saat ini tidak ada dalam daftar, jangan lakukan apa-apa
    if (currentIndex === -1) {
        console.warn('DevNavigator: Halaman saat ini tidak ada dalam daftar navigasi.');
        return;
    }

    // Buat wadah navigator
    const navigatorContainer = document.createElement('div');
    navigatorContainer.style.position = 'fixed';
    navigatorContainer.style.bottom = '20px';
    navigatorContainer.style.right = '20px';
    navigatorContainer.style.zIndex = '9999';
    navigatorContainer.style.display = 'flex';
    navigatorContainer.style.gap = '10px';

    // Buat tombol 'Prev'
    const prevButton = document.createElement('button');
    prevButton.textContent = '<< Prev';
    prevButton.style.backgroundColor = '#ff9800';
    prevButton.style.color = 'white';
    prevButton.style.border = 'none';
    prevButton.style.padding = '10px 15px';
    prevButton.style.borderRadius = '8px';
    prevButton.style.cursor = 'pointer';
    prevButton.style.fontFamily = 'sans-serif';
    prevButton.style.fontWeight = 'bold';
    prevButton.disabled = currentIndex === 0; // Nonaktifkan jika ini halaman pertama

    // Buat tombol 'Next'
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next >>';
    nextButton.style.backgroundColor = '#ff9800';
    nextButton.style.color = 'white';
    nextButton.style.border = 'none';
    nextButton.style.padding = '10px 15px';
    nextButton.style.borderRadius = '8px';
    nextButton.style.cursor = 'pointer';
    nextButton.style.fontFamily = 'sans-serif';
    nextButton.style.fontWeight = 'bold';
    nextButton.disabled = currentIndex === pages.length - 1; // Nonaktifkan jika ini halaman terakhir

    // Tambahkan event listener klik
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            window.location.href = pages[currentIndex - 1];
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < pages.length - 1) {
            window.location.href = pages[currentIndex + 1];
        }
    });

    // Masukkan tombol ke dalam wadah
    navigatorContainer.appendChild(prevButton);
    navigatorContainer.appendChild(nextButton);

    // Masukkan wadah ke dalam body
    document.body.appendChild(navigatorContainer);
}

// Tunggu hingga DOM dimuat sepenuhnya sebelum membuat navigator
document.addEventListener('DOMContentLoaded', createDevNavigator);

