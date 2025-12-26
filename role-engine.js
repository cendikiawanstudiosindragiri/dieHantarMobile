/**
 * role-engine.js - THE SULTAN HYBRID CONTROLLER (v9.0 Operational Driver)
 * Implementasi Dashboard Driver bergaya Gojek/Grab untuk dieHantar Mobile.
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

            // Routing Dashboard
            if (role === "driver") {
                this.renderDriverDashboard(data);
            } else if (role === "developer") {
                this.renderDevDashboard(data);
            } else {
                this.renderUserDashboard(data);
            }

            const label = document.getElementById("role-label");
            if (label) label.innerText = role.toUpperCase();
            this.injectDevSwitcher();

        } catch (e) { console.error("Update UI Error:", e); }
    },

    // --- 2. OPERATIONAL DRIVER DASHBOARD (Elite Style) ---
    renderDriverDashboard(data) {
        const container = document.getElementById("page-home");
        if (!container) return;

        const balance = data.driver ? data.driver.balance : 0;
        const isOnline = localStorage.getItem("driver_status") === "online";
        
        // Filter Orderan yang statusnya PENDING untuk ditampilkan di bursa order
        const pendingOrders = data.orders ? data.orders.filter(o => o.status === "PENDING") : [];

        container.innerHTML = `
            <div class="p-4 space-y-5 fade-in text-left pb-32">
                
                <div class="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <p class="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1">Pendapatan Hari Ini</p>
                            <h2 class="text-2xl font-black italic text-zinc-900">Rp ${balance.toLocaleString("id-ID")}</h2>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-[7px] font-black ${isOnline ? 'text-green-500' : 'text-zinc-400'} uppercase mb-2 tracking-tighter">
                                ${isOnline ? '● Sultan Online' : '○ Sultan Offline'}
                            </span>
                            <div onclick="RoleEngine.toggleDriverStatus()" class="w-12 h-7 ${isOnline ? 'bg-green-500' : 'bg-zinc-200'} rounded-full relative p-1 transition-all duration-300 cursor-pointer">
                                <div class="w-5 h-5 bg-white rounded-full shadow transform transition-all ${isOnline ? 'translate-x-5' : 'translate-x-0'}"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex gap-2">
                        <div class="flex-1 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
                            <p class="text-[6px] font-black text-blue-400 uppercase">Rating</p>
                            <p class="text-[10px] font-black text-blue-700">5.0 ★</p>
                        </div>
                        <div class="flex-1 bg-orange-50/50 p-3 rounded-2xl border border-orange-100/50">
                            <p class="text-[6px] font-black text-orange-400 uppercase">Penyelesaian</p>
                            <p class="text-[10px] font-black text-orange-700">100%</p>
                        </div>
                        <div class="flex-1 bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                            <p class="text-[6px] font-black text-zinc-400 uppercase">Insentif</p>
                            <p class="text-[10px] font-black text-zinc-700">Rp 0</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex justify-between items-center px-1">
                        <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Bursa Pesanan (${pendingOrders.length})</h3>
                        <div class="flex gap-2">
                            <button onclick="RoleEngine.updateUI()" class="w-6 h-6 bg-white rounded-lg flex items-center justify-center border border-zinc-100 active:scale-90 shadow-sm"><i class="fas fa-redo-alt text-[8px] text-zinc-400"></i></button>
                        </div>
                    </div>

                    ${isOnline ? this.renderOrderList(pendingOrders) : `
                        <div class="py-16 text-center">
                            <div class="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                                <i class="fas fa-moon text-zinc-300 text-3xl"></i>
                            </div>
                            <h4 class="text-[10px] font-black text-zinc-400 uppercase">Sultan Sedang Istirahat</h4>
                            <p class="text-[8px] text-zinc-300 mt-1 uppercase font-bold tracking-widest">Aktifkan status untuk mencari cuan</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    // --- 3. HELPER: RENDER LIST ORDERAN ---
    renderOrderList(orders) {
        if (orders.length === 0) {
            return `
                <div class="bg-white p-10 rounded-[2.5rem] border border-dashed border-zinc-200 text-center">
                    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <i class="fas fa-satellite-dish"></i>
                    </div>
                    <p class="text-[9px] text-zinc-400 font-black uppercase italic">Mencari Orderan Nyangkut...</p>
                </div>`;
        }

        return orders.map(o => `
            <div class="bg-zinc-900 p-6 rounded-[2.5rem] shadow-2xl border border-blue-500/20 relative overflow-hidden group">
                <div class="flex justify-between items-start mb-5 relative z-10">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <i class="fas ${o.item.includes('MOTOR') ? 'fa-motorcycle' : 'fa-box'} text-white"></i>
                        </div>
                        <div>
                            <h4 class="text-white font-black text-xs uppercase italic">${o.item}</h4>
                            <p class="text-[7px] text-blue-400 font-black uppercase tracking-widest">Tunai • Sultan Priority</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <h3 class="text-xl font-black italic text-white tracking-tighter">Rp ${parseInt(o.price).toLocaleString("id-ID")}</h3>
                    </div>
                </div>

                <div class="space-y-4 mb-6 relative z-10">
                    <div class="flex gap-3">
                        <div class="flex flex-col items-center">
                            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div class="w-0.5 h-6 bg-zinc-700 my-1"></div>
                            <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                        </div>
                        <div class="flex-1 space-y-4">
                            <div class="text-[9px] text-zinc-400 leading-tight">
                                <span class="block text-[6px] font-black uppercase mb-1 text-zinc-600">Titik Jemput:</span>
                                ${o.origin}
                            </div>
                            <div class="text-[9px] text-zinc-100 leading-tight">
                                <span class="block text-[6px] font-black uppercase mb-1 text-zinc-600">Titik Antar:</span>
                                ${o.destination}
                            </div>
                        </div>
                    </div>
                </div>

                <button onclick="RoleEngine.processOrder('${o.id}')" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[9px] shadow-lg shadow-blue-600/30 active:scale-95 transition-all relative z-10">
                    Terima & Arahkan Peta
                </button>
                
                <i class="fas fa-map-location-dot absolute -right-6 -bottom-6 text-8xl text-blue-500/5 rotate-12"></i>
            </div>
        `).join("");
    },

    // --- 4. LOGIKA OPERASIONAL (Accept, Map, Chat) ---
    async processOrder(orderId) {
        // Tampilkan Simulasi Navigasi
        SultanNotify("Orderan Diambil! Menghubungkan Peta...");
        new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3").play().catch(()=>{});
        
        // Render Halaman Navigasi Driver
        this.renderInAppNavigation(orderId);
    },

    renderInAppNavigation(orderId) {
        const container = document.getElementById("page-home");
        container.innerHTML = `
            <div class="flex flex-col h-full bg-zinc-950 fade-in">
                <div class="relative flex-1 bg-zinc-100 m-4 rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
                    <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#000 2px, transparent 2px); background-size: 30px 30px;"></div>
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center animate-bounce shadow-xl border-4 border-white">
                            <i class="fas fa-motorcycle text-white text-xs"></i>
                        </div>
                    </div>
                    <div class="absolute bottom-10 left-10 p-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-zinc-100">
                        <p class="text-[7px] font-black text-zinc-400 uppercase">Sisa Jarak</p>
                        <p class="text-xs font-black text-zinc-900 italic">1.2 KM (4 Menit)</p>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] space-y-6">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                <i class="fas fa-user-tie text-orange-600"></i>
                            </div>
                            <div>
                                <h4 class="text-xs font-black uppercase text-zinc-800">Sultan Rosda</h4>
                                <p class="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Pelanggan Prioritas</p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button class="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 active:scale-90"><i class="fas fa-phone"></i></button>
                            <button onclick="switchPage('chat')" class="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90"><i class="fas fa-comment-dots"></i></button>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button onclick="RoleEngine.updateUI()" class="flex-1 py-5 bg-zinc-100 text-zinc-400 rounded-3xl font-black uppercase text-[10px] active:scale-95">Batalkan</button>
                        <button onclick="alert('Sultan Sampai! Mengirim Notifikasi ke Pelanggan.')" class="flex-[2] py-5 bg-orange-600 text-white rounded-3xl font-black uppercase italic shadow-lg shadow-orange-600/20 text-[10px] active:scale-95">Saya Sudah Sampai</button>
                    </div>
                </div>
            </div>
        `;
    },

    toggleDriverStatus() {
        const currentStatus = localStorage.getItem("driver_status");
        const newStatus = currentStatus === "online" ? "offline" : "online";
        localStorage.setItem("driver_status", newStatus);
        
        if (typeof SultanNotify === "function") {
            SultanNotify(newStatus === "online" ? "Sultan Siap Bertugas!" : "Sultan Sedang Istirahat", newStatus === "online" ? "success" : "info");
        }
        this.updateUI();
    },

    // --- 5. LOGIKA BRANDING & SWITCHER (Penyempurnaan) ---
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
        } else {
            header.classList.add("bg-gradient-to-br", "from-orange-500", "to-orange-700");
            body.className = "bg-zinc-950 flex justify-center items-center";
        }
    },

    injectDevSwitcher() {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        const container = document.getElementById("profile-menu-container");
        if (userData.username === 'dev' && !document.getElementById("quantum-switcher") && container) {
            const switcherHtml = `
                <div id="quantum-switcher" class="mt-8 space-y-4 px-2 fade-in">
                    <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-1">Quantum Role Switcher</h3>
                    <div class="grid grid-cols-3 gap-3">
                        <button onclick="RoleEngine.fastSwitch('user')" class="p-4 bg-orange-50 rounded-3xl border border-orange-100 active:scale-90"><i class="fas fa-user text-orange-600"></i></button>
                        <button onclick="RoleEngine.fastSwitch('driver')" class="p-4 bg-blue-50 rounded-3xl border border-blue-100 active:scale-90"><i class="fas fa-motorcycle text-blue-600"></i></button>
                        <button onclick="RoleEngine.fastSwitch('developer')" class="p-4 bg-zinc-100 rounded-3xl border border-zinc-200 active:scale-90"><i class="fas fa-code text-zinc-600"></i></button>
                    </div>
                </div>`;
            container.insertAdjacentHTML('beforebegin', switcherHtml);
        }
    },

    async fastSwitch(targetRole) {
        localStorage.setItem("active_role", targetRole);
        SultanNotify(`Mode: ${targetRole.toUpperCase()}`);
        await this.updateUI();
        switchPage('home');
    }
};