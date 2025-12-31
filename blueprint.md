# Blueprint Aplikasi: dieHantar - Sultan Super App

## Ringkasan Proyek

Ini adalah proyek konversi dari aplikasi HTML/JS statis menjadi aplikasi Next.js 14 modern. Tujuannya adalah untuk menciptakan kembali fungsionalitas dan tampilan "dieHantar Super App" dengan arsitektur yang modular, dapat diskalakan, dan berperforma tinggi menggunakan App Router.

## Desain & Gaya

Aplikasi ini mengadopsi desain "mobile-first" yang mewah dan berani, terinspirasi oleh UI Super App modern.

*   **Palet Warna:** Latar belakang utama gelap (`zinc-950`) di luar aplikasi, dengan kontainer aplikasi berwarna terang (`#f9fafb`). Warna aksen utama adalah oranye (`orange-600`) yang digunakan untuk tombol aksi, sorotan, dan branding, menciptakan nuansa "Sultan" yang eksklusif.
*   **Tipografi:** Menggunakan font **Plus Jakarta Sans** (via `next/font`) untuk tampilan teks yang bersih, modern, dan mudah dibaca.
*   **Efek Visual:**
    *   **Glassmorphism:** Digunakan pada navigasi bawah (`.glass-nav`) untuk efek tembus pandang yang elegan.
    *   **Shimmer Effect:** Placeholder pemuatan konten yang memberikan kesan dinamis.
    *   **Animasi:** Transisi halaman yang halus (`slideUp`) dan animasi interaktif kecil pada tombol dan elemen lainnya.
*   **Layout:** Dibatasi pada lebar maksimum 450px dan dipusatkan di layar untuk mensimulasikan pengalaman aplikasi seluler asli, bahkan di desktop.

## Arsitektur & Rencana Implementasi Awal

*   **Framework:** Next.js 14 (App Router).
*   **Styling:** Tailwind CSS dengan CSS kustom di `globals.css`.
*   **State Management:** React Hooks (`useState`) untuk mengelola navigasi UI.
*   **Komponenisasi:** UI dipecah menjadi komponen-komponen React di `src/components`.

---

### **Sesi Pengembangan 1: Migrasi Awal (Selesai)**

### **Sesi Pengembangan 2: Konten Halaman (Selesai)**

### **Sesi Pengembangan 3: Interaktivitas & Animasi (Selesai)**

---

### **Sesi Pengembangan 4: Zona Autentikasi & Onboarding**

**Tujuan:** Membuat "gerbang" autentikasi yang harus dilewati pengguna sebelum dapat mengakses fitur utama aplikasi. Ini akan mencakup *splash screen*, halaman *login*, verifikasi OTP, dan *onboarding*.

**Langkah-langkah Rencana:**

1.  **Struktur Ulang *Routing*:**
    *   Pindahkan dasbor utama (`app/page.tsx` dan `app/layout.tsx`) ke direktori baru yang terlindungi: `app/dashboard/`.
    *   Buat `app/page.tsx` dan `app/layout.tsx` baru di root sebagai titik masuk untuk alur autentikasi.
2.  **Buat Halaman & Komponen Autentikasi:**
    *   `SplashScreen.tsx`: Halaman pemuatan awal dengan logo.
    *   `LoginPage.tsx`: Formulir input nomor telepon/email.
    *   `OtpPage.tsx`: Formulir input kode verifikasi OTP.
    *   `OnboardingPage.tsx`: *Carousel* untuk memperkenalkan fitur aplikasi.
3.  **Manajemen Status Autentikasi (Simulasi):**
    *   Gunakan *state* React di `app/page.tsx` baru untuk mengelola alur tampilan (Splash -> Login -> OTP -> Onboarding -> Dashboard).
    *   Implementasikan navigasi terprogram untuk mengarahkan pengguna ke `/dashboard` setelah autentikasi berhasil.
4.  **Aset Visual Baru:**
    *   Buat logo "dieHantar" berbasis teks atau SVG.
    *   Tambahkan gambar placeholder untuk *slide onboarding*.
