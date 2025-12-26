/**
 * auth.js - SISTEM KEAMANAN SULTAN v7.2
 * Bridge antara Frontend dan Backend master.js
 * Developer: Studio Indragiri
 */

const SultanAuth = {
    // 1. CEK AKSES: Proteksi halaman agar tidak bisa masuk tanpa login
    checkAccess() {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const currentPage = window.location.pathname;

        // Jika belum login dan tidak di halaman login, tendang ke login.html
        if (isLoggedIn !== "true" && !currentPage.includes("login.html")) {
            window.location.href = "login.html";
        }
    },

    // 2. LOGOUT: Bersihkan memori dan kembali ke pintu gerbang
    logout() {
        localStorage.clear();
        window.location.href = "login.html";
    },

    // 3. GET USER DATA: Mengambil data lengkap Sultan dari master.js
    getUserData() {
        const rawData = localStorage.getItem("user_data");
        const role = localStorage.getItem("active_role") || "user";
        
        if (rawData) {
            const data = JSON.parse(rawData);
            return {
                ...data,
                role: role,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=ea580c&color=fff`
            };
        }

        // Fallback jika data kosong
        return {
            name: "Sultan Guest",
            role: "guest",
            avatar: "https://ui-avatars.com/api/?name=Guest&background=666&color=fff"
        };
    }
};

// ==========================================
// CORE FUNCTION: LOGIN (Menghubungi master.js)
// ==========================================

async function login(username, password) {
    try {
        // Tampilkan loading jika ada (opsional)
        console.log("Menghubungi server dieHantar...");

        // Pastikan tidak ada spasi atau titik di akhir /api/login
const response = await fetch("/api/login", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
});

        // Cek jika response error (misal 404 atau 500)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || "Akun tidak ditemukan!");
        }

        const result = await response.json();

        if (result.success) {
            // SIMPAN DATA KE LOCAL STORAGE
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("active_role", result.role);
            localStorage.setItem("user_data", JSON.stringify(result.data));

            // Jika ada fungsi SultanNotify (Notifikasi Toast)
            if (typeof SultanNotify === "function") {
                SultanNotify(`Selamat Datang, Sultan ${result.data.name}!`);
            } else {
                alert(`Selamat Datang, Sultan ${result.data.name}!`);
            }

            // Pindah ke dashboard setelah delay singkat agar lebih smooth
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        }
    } catch (error) {
        console.error("Login Failed:", error);
        
        // Pesan error spesifik jika server mati
        if (error.message.includes("Failed to fetch")) {
            alert("⚠️ Server sedang istirahat, Beb! \n\nPastikan terminal sudah diketik 'gaskeun-server'.");
        } else {
            alert("❌ Gagal Masuk: " + error.message);
        }
    }
}

// OTOMATIS JALANKAN PROTEKSI SAAT FILE DI-LOAD
// Tapi abaikan jika sedang di halaman login agar tidak terjadi infinite loop
if (!window.location.pathname.includes("login.html")) {
    SultanAuth.checkAccess();
}