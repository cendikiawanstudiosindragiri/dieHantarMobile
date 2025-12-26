/**
 * role-engine.js - THE SULTAN HYBRID CONTROLLER (v8.7 Stable)
 * Menangani transisi tema, Dashboard Driver (Grab Style), dan Fast Switching.
 * Developer: Studio Indragiri
 */

const RoleEngine = {
    selectedStars: 0,

    // --- 1. ENTRY POINT: SINKRONISASI UI ---
    async updateUI(data) {
        try {
            if (!data) {
                const res = await fetch("/api/data");
                data = await res.json();
            }

            const role = localStorage.getItem("active_role") || "user";
            this.applyBranding(role);

            // Routing Dashboard berdasarkan Role Aktif
            if (role === "driver") {
                this.renderDriverDashboard(data);
            } else if (role === "developer") {
                this.renderDevDashboard(data);
            } else if (role === "merchant") {
                this.renderMerchantDashboard(data);
            } else {
                this.renderUserDashboard(data);
            }

            const label = document.getElementById("role-label");
            if (label) label.innerText = role.toUpperCase();

            this.injectDevSwitcher();

        } catch (e) {
            console.error("Gagal update UI Sultan:", e);
        }
    },

    // --- 2. FAST ROLE SWITCHER (Master Dev Only) ---
    async fastSwitch(targetRole) {
        localStorage.setItem("active_role", targetRole);
        if (typeof SultanNotify === "function") {
            SultanNotify(`Portal Berpindah ke Mode: ${targetRole.toUpperCase()}`);
        }
        new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3").play().catch(()=>{});
        await this.updateUI();
        if (typeof switchPage === "function") switchPage('home');
    },

    injectDevSwitcher() {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        const container = document.getElementById("profile-menu-container");
        if (userData.username === 'dev' && !document.getElementById("quantum-switcher") && container) {
            const switcherHtml = `
                <div id="quantum-switcher" class="mt-8 space-y-4 px-2 fade-in">
                    <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-1">Quantum Role Switcher</h3>
                    <div class="grid grid-cols-3 gap-3">
                        <button onclick="RoleEngine.fastSwitch('user')" class="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-3xl border border-orange-100 active:scale-90 transition-all">
                            <i class="fas fa-user text-orange-600"></i>
                            <span class="text-[7px] font-black uppercase text-orange-900">User</span>
                        </button>
                        <button onclick="RoleEngine.fastSwitch('driver')" class="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-3xl border border-blue-100 active:scale-90 transition-all">
                            <i class="fas fa-motorcycle text-blue-600"></i>
                            <span class="text-[7px] font-black uppercase text-blue-900">Driver</span>
                        </button>
                        <button onclick="RoleEngine.fastSwitch('developer')" class="flex flex-col items-center gap-2 p-4 bg-zinc-100 rounded-3xl border border-zinc-200 active:scale-90 transition-all">
                            <i class="fas fa-code text-zinc-600"></i>
                            <span class="text-[7px] font-black uppercase text-zinc-900">Dev</span>
                        </button>
                    </div>
                </div>`;
            container.insertAdjacentHTML('beforebegin', switcherHtml);
        }
    },

    // --- 3. BRANDING ENGINE ---
    applyBranding(role) {
        const header = document.getElementById("app-header");
        const body = document.body;
        if (!header) return;

        header.className = "p-6 rounded-b-[3.5rem] shadow-lg flex-shrink-0 z-50 transition-all duration-500 ";
        
        if (role === "driver") {
            header.classList.add("bg-gradient-to-br", "from-blue-600", "to-indigo-900");
            body.className = "bg-slate-900 flex justify-center items-center";
            document.documentElement.style.setProperty("--active-color", "#2563eb");
        } else if (role === "developer") {
            header.classList.add("bg-gradient-to-br", "from-zinc-800", "to-black");
            body.className = "bg-black flex justify-center items-center";
            document.documentElement.style.setProperty("--active-color", "#71717a");
        } else if (role === "merchant") {
            header.classList.add("bg-gradient-to-br", "from-emerald-600", "to-teal-800");
            body.className = "bg-zinc-950 flex justify-center items-center";
            document.documentElement.style.setProperty("--active-color", "#059669");
        } else {
            header.classList.add("bg-gradient-to-br", "from-orange-500", "to-orange-700");
            body.className = "bg-zinc-950 flex justify-center items-center";
            document.documentElement.style.setProperty("--active-color", "#ea580c");
        }
    },

    // --- 4. DASHBOARD RENDERERS ---
    renderUserDashboard(data) {
        const container = document.getElementById("page-home");
        if (!container) return;

        const favoritePlaces = `
            <div class="space-y-3 px-1">
                <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest pl-1">Alamat Favorit</h3>
                <div class="flex gap-3">
                    <button onclick="setQuickAddress('Rumah Sultan')" class="flex-1 bg-white p-4 rounded-2xl border border-zinc-100 flex items-center gap-3 active:scale-95 transition-all">
                        <i class="fas fa-home text-orange-500"></i>
                        <span class="text-[8px] font-black text-zinc-600 uppercase">Rumah</span>
                    </button>
                    <button onclick="setQuickAddress('Kantor Sultan')" class="flex-1 bg-white p-4 rounded-2xl border border-zinc-100 flex items-center gap-3 active:scale-95 transition-all">
                        <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-[10px]"><i class="fas fa-briefcase"></i></div>
                        <span class="text-[8px] font-black text-zinc-600 uppercase">Kantor</span>
                    </button>
                </div>
            </div>`;

        container.innerHTML = `
            <div class="p-6 space-y-8 fade-in text-left pb-24">
                <section class="space-y-4">
                    <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest pl-1 border-l-4 border-orange-500 ml-1">Layanan Utama</h3>
                    <div class="grid grid-cols-4 gap-y-8">
                        ${SULTAN_SERVICES.top.map(s => dieHantarUI.renderServiceButton(s)).join("")}
                        <button onclick="switchPage('all-services')" class="flex flex-col items-center gap-2 active:scale-90">
                            <div class="w-14 h-14 bg-zinc-800 text-orange-400 rounded-[1.8rem] flex items-center justify-center text-xl shadow-lg border border-zinc-700"><i class="fas fa-ellipsis"></i></div>
                            <p class="text-[7px] font-black uppercase text-zinc-600 mt-1">Lainnya</p>
                        </button>
                    </div>
                </section>
                ${favoritePlaces}
                <div class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <p class="text-orange-500 text-[8px] font-black uppercase mb-1 tracking-widest text-center">Promo Sultan Hari Ini</p>
                    <h2 class="text-sm font-black italic text-zinc-900 text-center uppercase">Diskon 50% Semua Layanan!</h2>
                </div>
            </div>`;
    },

    // --- RENDER DRIVER (GRAB/GOJEK STYLE) ---
    renderDriverDashboard(data) {
        const container = document.getElementById("page-home");
        if (!container) return;

        const balance = data.driver ? data.driver.balance.toLocaleString("id-ID") : "0";
        const orders = data.orders ? data.orders.filter(o => o.status === "PENDING") : [];
        const isOnline = localStorage.getItem("driver_status") === "online";

        container.innerHTML = `
            <div class="p-6 space-y-6 fade-in text-left pb-32">
                <div class="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <p class="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1">Dompet Sultan</p>
                            <h2 class="text-2xl font-black italic text-zinc-900">Rp ${balance}</h2>
                        </div>
                        <div class="flex flex-col items-end">
                            <p class="text-[7px] font-black ${isOnline ? 'text-green-500' : 'text-gray-400'} uppercase mb-2">${isOnline ? 'Sultan Online' : 'Sultan Offline'}</p>
                            <div onclick="RoleEngine.toggleDriverStatus()" class="w-14 h-8 ${isOnline ? 'bg-green-500' : 'bg-gray-200'} rounded-full relative p-1 transition-all cursor-pointer">
                                <div class="w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${isOnline ? 'translate-x-6' : 'translate-x-0'}"></div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-blue-50 p-3 rounded-2xl text-center">
                            <p class="text-[6px] font-black text-blue-400 uppercase">Performa</p>
                            <p class="text-xs font-black text-blue-700">100%</p>
                        </div>
                        <div class="bg-orange-50 p-3 rounded-2xl text-center">
                            <p class="text-[6px] font-black text-orange-400 uppercase">Rating</p>
                            <p class="text-xs font-black text-orange-700">5.0 ★</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex justify-between items-center px-1">
                        <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Orderan Tersedia (${orders.length})</h3>
                        <button onclick="syncAll()" class="text-[8px] font-black text-blue-600 uppercase">Refresh</button>
                    </div>
                    <div id="driver-order-container" class="space-y-4">
                        ${orders.length > 0 ? orders.map(o => `
                            <div class="bg-zinc-900 p-6 rounded-[2.5rem] border border-blue-500/20 shadow-2xl relative overflow-hidden group">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="w-10 h-10 bg-blue-600/20 text-blue-500 rounded-xl flex items-center justify-center">
                                        <i class="fas ${o.item.includes('MOTOR') ? 'fa-motorcycle' : 'fa-box'}"></i>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-[10px] font-black text-white italic">Rp ${parseInt(o.price).toLocaleString("id-ID")}</p>
                                        <p class="text-[6px] text-zinc-500 uppercase font-bold">Tunai</p>
                                    </div>
                                </div>
                                <div class="space-y-3 mb-6">
                                    <div class="flex items-start gap-3">
                                        <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></div>
                                        <p class="text-[9px] text-zinc-300 leading-tight"><span class="text-zinc-500 block text-[6px] uppercase font-black">Jemput:</span>${o.origin}</p>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <div class="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1"></div>
                                        <p class="text-[9px] text-zinc-300 leading-tight"><span class="text-zinc-500 block text-[6px] uppercase font-black">Antar:</span>${o.destination}</p>
                                    </div>
                                </div>
                                <button onclick="acceptOrder('${o.id}')" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[9px] active:scale-95 shadow-lg shadow-blue-600/20">Sikat Orderan</button>
                            </div>
                        `).join("") : `
                            <div class="py-20 text-center space-y-4">
                                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i class="fas fa-mug-hot text-gray-300 text-2xl"></i>
                                </div>
                                <p class="text-[10px] text-gray-400 font-black uppercase italic italic">Belum ada orderan nyangkut, Beb...</p>
                            </div>`}
                    </div>
                </div>
            </div>`;
    },

    renderDevDashboard(data) {
        const container = document.getElementById("page-home");
        if (!container) return;
        container.innerHTML = `
            <div class="p-6 space-y-6 fade-in text-left pb-24">
                <div class="bg-zinc-900 p-6 rounded-[2.5rem] border border-green-500/30 shadow-2xl relative overflow-hidden">
                    <p class="text-green-500 font-mono text-[8px] mb-2">> system_status: STABLE</p>
                    <h3 class="text-white font-black uppercase italic text-sm">Dev Console Access</h3>
                </div>
                <div class="space-y-3">
                    <button class="w-full py-4 bg-zinc-800 text-zinc-300 rounded-2xl text-[9px] font-black uppercase border border-white/5 flex items-center justify-between px-6">
                        <span>Database Maintenance</span>
                        <i class="fas fa-database"></i>
                    </button>
                    <button onclick="SultanAuth.logout()" class="w-full py-4 bg-red-900/20 text-red-500 rounded-2xl text-[9px] font-black uppercase border border-red-500/20">Terminasi Sesi</button>
                </div>
            </div>`;
    },

    renderMerchantDashboard(data) {
        const container = document.getElementById("page-home");
        if (!container) return;
        const foodOrders = data.orders ? data.orders.filter(o => o.item.includes("MAKAN") && o.status === "PENDING") : [];

        container.innerHTML = `
            <div class="p-6 space-y-6 fade-in text-left pb-24">
                <div class="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-8 rounded-[3rem] shadow-xl">
                    <h2 class="text-xl font-black italic uppercase">Sultan Resto</h2>
                </div>
                <div class="space-y-4">
                    ${foodOrders.length > 0 ? foodOrders.map(o => `
                        <div class="bg-white p-6 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                            <h4 class="font-black text-xs uppercase text-zinc-800">${o.item}</h4>
                            <button onclick="processMerchantOrder(${o.id}, 'COOKING')" class="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-[9px] active:scale-95">Terima & Masak</button>
                        </div>`).join("") : '<p class="text-center py-10 text-zinc-300 font-black uppercase italic text-[10px]">Dapur sedang santai, Beb...</p>'}
                </div>
            </div>`;
    },

    // --- 5. UTILITIES (Toggle, Tracking, Rating) ---
    toggleDriverStatus() {
        const currentStatus = localStorage.getItem("driver_status");
        const newStatus = currentStatus === "online" ? "offline" : "online";
        localStorage.setItem("driver_status", newStatus);
        if (typeof SultanNotify === "function") {
            SultanNotify(newStatus === "online" ? "Sultan Siap Bertugas!" : "Sultan Sedang Istirahat", newStatus === "online" ? "success" : "info");
        }
        this.updateUI(); // Refresh UI
    },

    renderTrackingMap() {
        const container = document.getElementById("page-home");
        if (!container) return;
        container.innerHTML = `
            <div class="p-6 space-y-6 fade-in text-left pb-24">
                <button onclick="RoleEngine.updateUI()" class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm"><i class="fas fa-arrow-left"></i></button>
                <div class="relative w-full h-80 bg-zinc-100 rounded-[3rem] border-4 border-white shadow-inner overflow-hidden">
                    <div id="driver-marker" class="absolute transition-all duration-1000 ease-linear" style="left:50%; top:50%;">
                        <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce"><i class="fas fa-motorcycle text-xs"></i></div>
                    </div>
                </div>
            </div>`;
        this.startTrackingLoop();
    },

    async startTrackingLoop() {
        const marker = document.getElementById("driver-marker");
        if (!marker) return;
        try {
            const res = await fetch("/api/driver/location");
            const coords = await res.json();
            marker.style.left = coords.x + "%";
            marker.style.top = coords.y + "%";
            if (localStorage.getItem("active_role") === "user") setTimeout(() => this.startTrackingLoop(), 3000);
        } catch (e) {}
    },

    setStar(n) {
        this.selectedStars = n;
        for (let i = 1; i <= 5; i++) {
            const star = document.getElementById(`star-${i}`);
            if (star) {
                star.classList.toggle("text-yellow-400", i <= n);
                star.classList.toggle("text-zinc-100", i > n);
            }
        }
    }
};

// --- 6. SERVICE ROUTER ---
const ServiceRouter = {
    render(id) {
        const container = document.getElementById("page-home");
        if (!container) return;
        const backBtn = `<button onclick="RoleEngine.updateUI()" class="mb-6 flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 transition-all active:scale-95"><i class="fas fa-arrow-left"></i> Kembali</button>`;
        container.innerHTML = `<div class="p-6 fade-in text-left pb-24">${backBtn}<div class="p-10 bg-white rounded-[3rem] border border-zinc-100 shadow-sm text-center"><i class="fas fa-clock text-4xl text-orange-200 mb-4"></i><h2 class="text-sm font-black uppercase italic text-zinc-800">Layanan ${id.toUpperCase()} Segera Hadir</h2></div></div>`;
    }
};