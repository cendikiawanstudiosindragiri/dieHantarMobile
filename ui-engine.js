/**
 * ui-engine.js - Komponen UI dieHantar
 * Developer: Studio Indragiri
 */

const dieHantarUI = {
    // 1. Render Tombol Layanan di Beranda
    renderServiceButton(s) {
        return `<button onclick="startBooking('${s.id}', '${s.icon}')" class="flex flex-col items-center gap-2 active:scale-90 transition-all">
                    <div class="w-14 h-14 bg-white ${s.color} rounded-[1.8rem] flex items-center justify-center text-xl shadow-sm border border-gray-50"><i class="fas ${s.icon}"></i></div>
                    <p class="text-[7px] font-black uppercase text-gray-500 mt-1 text-center leading-tight px-1">${s.label}</p>
                </button>`;
    },

    // 2. Render Statistik User di Profile
    renderUserStats(id, stats) {
        const c = document.getElementById(id);
        if (!c) return;
        c.innerHTML = `
            <div class="grid grid-cols-3 gap-3 mb-6 fade-in">
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p class="text-orange-600 font-black text-sm">${stats.trips || 0}</p>
                    <p class="text-[6px] text-gray-400 font-black uppercase">Trips</p>
                </div>
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p class="text-zinc-900 font-black text-sm">${stats.points || 0}</p>
                    <p class="text-[6px] text-gray-400 font-black uppercase">Points</p>
                </div>
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <p class="text-zinc-900 font-black text-sm">1Th</p>
                    <p class="text-[6px] text-gray-400 font-black uppercase">Member</p>
                </div>
            </div>`;
    },

    // 3. Render Riwayat Pesanan
    renderHistory(id, orders) {
        const c = document.getElementById(id);
        if (!c) return;
        if (typeof globalOrders !== 'undefined' && globalOrders.length === orders.length && c.innerHTML !== "") return;
        
        globalOrders = orders;
        c.innerHTML = orders.slice().reverse().map((o, index) => `
            <div onclick="openReceiptFromHistory(${orders.length - 1 - index})" class="bg-white p-5 rounded-[2.5rem] border border-gray-100 flex justify-between items-center mb-3 shadow-sm active:scale-95 transition-all cursor-pointer group">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 ${o.status === "COMPLETED" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"} rounded-2xl flex items-center justify-center text-xs shadow-inner"><i class="fas ${o.status === "COMPLETED" ? "fa-check-double" : "fa-clock"}"></i></div>
                    <div>
                        <p class="text-[7px] font-black uppercase ${o.status === "COMPLETED" ? "text-green-500" : "text-orange-500"} mb-1">${o.status}</p>
                        <h4 class="font-black text-xs text-zinc-800 leading-tight">${o.item}</h4>
                        <p class="text-[6px] text-gray-400 font-black uppercase mt-1">${o.date || "Tgl N/A"}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-black text-xs italic text-zinc-900">Rp ${parseInt(o.price).toLocaleString("id-ID")}</p>
                    <i class="fas fa-chevron-right text-[8px] text-gray-200 group-hover:text-orange-500 mt-1"></i>
                </div>
            </div>`).join("") || `<div class="text-center py-20 text-gray-300 font-black text-[10px] uppercase italic">Belum Ada Perjalanan Beb</div>`;
    },

    // 4. Render Tracking Card (Floating Status)
    renderTrackingCard(order) {
        const container = document.getElementById("status-area");
        if (!container) return;
        container.innerHTML = `
            <div class="bg-zinc-900 p-5 rounded-[2.5rem] border border-orange-500/30 shadow-2xl animate-bounce-slow relative overflow-hidden">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center animate-pulse">
                            <i class="fas fa-truck-fast text-white text-[10px]"></i>
                        </div>
                        <div>
                            <p class="text-[7px] font-black text-orange-500 uppercase">Perjalanan Aktif</p>
                            <h4 class="text-[10px] font-bold text-white uppercase">${order.item}</h4>
                        </div>
                    </div>
                    <p class="text-[9px] font-black text-white italic">85%</p>
                </div>
                <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-orange-500 h-full w-[85%] transition-all duration-1000"></div>
                </div>
            </div>`;
    },

    // 5. Render Struk Digital (Modal)
    renderReceiptModal(order) {
        const fullDate = order.date || new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
        const fullTime = order.time || new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        let extraInfo = order.employeeInfo ? `<div class="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"><p class="text-[7px] font-black text-gray-400 uppercase mb-2">Data Potong Gajian</p><p class="text-[9px] font-bold text-zinc-700 leading-tight">👤 ${order.employeeInfo.name} <br> 🆔 ${order.employeeInfo.nik} <br> 🏢 ${order.employeeInfo.pt}</p></div>` : "";
        
        const receiptHtml = `
            <div id="modal-receipt" class="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6 backdrop-blur-md fade-in">
                <div class="bg-white w-full max-w-sm rounded-[3.5rem] overflow-hidden shadow-2xl animate-slide-up">
                    <div class="bg-zinc-900 p-10 text-center text-white">
                        <div class="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><i class="fas fa-receipt text-2xl text-white"></i></div>
                        <h3 class="text-xl font-black italic uppercase tracking-tighter">Struk dieHantar</h3>
                        <p class="text-[8px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-2">Digital Receipt Sultan</p>
                    </div>
                    <div class="p-10 pt-8 space-y-4">
                        <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-[9px] font-black text-gray-400 uppercase">Waktu</span><span class="text-[9px] font-black text-zinc-800">${fullDate} | ${fullTime}</span></div>
                        <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-[9px] font-black text-gray-400 uppercase">Layanan</span><span class="text-[9px] font-black text-zinc-800 uppercase">${order.item}</span></div>
                        <div class="flex justify-between border-b border-gray-100 pb-2"><span class="text-[9px] font-black text-gray-400 uppercase">Bayar</span><span class="text-[9px] font-black text-orange-600 uppercase">${order.paymentMethod}</span></div>
                        <div class="space-y-1"><p class="text-[7px] font-black text-gray-300 uppercase">Rute</p><p class="text-[9px] font-bold text-zinc-700 leading-tight">📍 ${order.origin} 🏁 ${order.destination}</p></div>
                        ${extraInfo}
                        <div class="pt-6 mt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-center"><span class="text-xs font-black uppercase italic">Total</span><span class="text-2xl font-black italic text-zinc-900">Rp ${parseInt(order.price).toLocaleString("id-ID")}</span></div>
                    </div>
                    <div class="p-10 pt-0 flex gap-3"><button onclick="closeReceipt()" class="flex-1 py-5 bg-gray-100 text-zinc-400 rounded-3xl font-black uppercase text-[10px]">Tutup</button><button onclick="shareSultanReceipt('${encodeURIComponent(JSON.stringify(order))}')" class="flex-1 py-5 bg-zinc-900 text-white rounded-3xl font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-xl"><i class="fas fa-share-nodes text-xs text-orange-500"></i> Bagikan</button></div>
                </div>
            </div>`;
        
        let root = document.getElementById("receipt-root");
        if (!root) {
            root = document.createElement("div");
            root.id = "receipt-root";
            document.body.appendChild(root);
        }
        root.innerHTML = receiptHtml;
    },
};

// --- RENDERER SISTEM ---
const AppRenderer = {
    init(isDriver = false) {
        this.isDriver = isDriver;
        this.renderHome();
        this.renderNav();
        this.renderBookingOptions();
        this.renderAllServices();
        this.injectDevFeatures();
    },

    renderHome() {
        const container = document.getElementById("page-home");
        if (!container) return;
        if (this.isDriver) {
            container.innerHTML = `<h2 class="text-xl font-black italic text-zinc-900 uppercase mb-4 text-center">Portal Mitra</h2><div id="driver-wallet-container"></div>`;
        } else {
            let gridHtml = SULTAN_SERVICES.top.map((s) => dieHantarUI.renderServiceButton(s)).join("");
            gridHtml += `<button onclick="switchPage('all-services')" class="flex flex-col items-center gap-2 active:scale-90 transition-all"><div class="w-14 h-14 bg-zinc-800 text-orange-400 rounded-[1.8rem] flex items-center justify-center text-xl shadow-lg border border-zinc-700"><i class="fas fa-ellipsis"></i></div><p class="text-[7px] font-black uppercase text-zinc-600 mt-1">Lainnya</p></button>`;
            container.innerHTML = `<section class="space-y-6 fade-in"><h3 class="text-[9px] font-black text-zinc-400 uppercase px-2 leading-none tracking-widest italic">Layanan Super Sultan</h3><div class="grid grid-cols-4 gap-y-8">${gridHtml}</div></section>`;
        }
    },

    renderAllServices() {
        const container = document.getElementById("page-all-services");
        if (!container) return;
        const cats = [
            { title: "1. MAKAN & BELANJA", data: SULTAN_SERVICES.food },
            { title: "2. TRANSPORTASI", data: SULTAN_SERVICES.transport },
            { title: "3. PEMBAYARAN", data: SULTAN_SERVICES.payment },
            { title: "4. SOSIAL", data: SULTAN_SERVICES.social },
        ];
        let html = `<div id="live-tracking-slot" class="mb-8"></div><div class="flex items-center gap-4 mb-10"><button onclick="switchPage('home')" class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-zinc-400 active:scale-90"><i class="fas fa-arrow-left text-xs"></i></button><h2 class="text-xl font-black italic text-zinc-900 uppercase">Eksplorasi Sultan</h2></div>`;
        cats.forEach((c) => {
            const grid = c.data.map((s) => dieHantarUI.renderServiceButton(s)).join("");
            html += `<div class="mb-14"><h3 class="text-[9px] font-black text-zinc-400 uppercase px-2 mb-8 tracking-[0.2em] border-l-4 border-orange-500 ml-2 leading-tight">${c.title}</h3><div class="grid grid-cols-4 gap-y-12">${grid}</div></div>`;
        });
        container.innerHTML = html;
    },

    renderNav() {
        const nav = document.getElementById("main-nav");
        if (!nav) return;
        const items = this.isDriver ? 
            [{ id: "home", icon: "fa-radar", label: "Order" }, { id: "profile", icon: "fa-user-circle", label: "Profil" }] : 
            [{ id: "home", icon: "fa-home", label: "Beranda" }, { id: "promo", icon: "fa-percentage", label: "Promo" }, { id: "history", icon: "fa-receipt", label: "Riwayat" }, { id: "chat", icon: "fa-comment-dots", label: "Pesan" }, { id: "profile", icon: "fa-crown", label: "Sultan" }];
        
        nav.innerHTML = items.map((i) => `
            <button id="nav-${i.id}" onclick="switchPage('${i.id}')" class="flex flex-col items-center gap-1 text-gray-300 relative active:scale-95 transition-all">
                <i class="fas ${i.icon} text-lg"></i>
                <span class="text-[7px] font-black uppercase tracking-tighter">${i.label}</span>
                ${i.id === "home" ? '<div id="active-order-badge" class="hidden absolute top-0 right-1 w-2 h-2 bg-orange-600 rounded-full border-2 border-white animate-pulse"></div>' : ""}
            </button>`).join("");
    },

    renderBookingOptions() {
        const container = document.getElementById("booking-options");
        if (!container) return;
        
        const quickAddressHtml = `
            <div class="flex gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
                <button onclick="setQuickAddress('RUMAH')" class="flex-none px-4 py-2 bg-white border border-gray-100 rounded-2xl text-[8px] font-black text-zinc-600 shadow-sm active:scale-95">🏠 RUMAH</button>
                <button onclick="setQuickAddress('KANTOR')" class="flex-none px-4 py-2 bg-white border border-gray-100 rounded-2xl text-[8px] font-black text-zinc-600 shadow-sm active:scale-95">🏢 KANTOR</button>
            </div>`;

        container.innerHTML = `
            ${quickAddressHtml}
            <p class="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-4">Pilih Kelas Sultan</p>
            <button onclick="setSultanClass('Standard', 15000)" id="class-standard" class="class-btn w-full p-6 bg-orange-50 rounded-[2rem] border-2 border-orange-500 flex justify-between items-center transition-all active:scale-95 mb-3">
                <div class="flex items-center gap-4"><div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm"><i class="fas fa-motorcycle text-lg"></i></div><div class="text-left font-black"><h4 class="text-xs text-zinc-800 uppercase leading-none">Standard</h4><p class="text-[8px] text-gray-400 font-bold uppercase mt-1">Cepat & Irit</p></div></div><p class="text-sm font-black text-zinc-900 italic">Rp 15k</p>
            </button>
            <button onclick="setSultanClass('Sultan Class', 25000)" id="class-sultan" class="class-btn w-full p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent flex justify-between items-center transition-all active:scale-95">
                <div class="flex items-center gap-4"><div class="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-yellow-500 shadow-sm"><i class="fas fa-crown text-lg"></i></div><div class="text-left font-black"><h4 class="text-xs text-zinc-800 uppercase leading-none">Sultan Class</h4><p class="text-[8px] text-gray-400 font-bold uppercase mt-1">VIP Luxury</p></div></div><p class="text-sm font-black text-zinc-900 italic">Rp 25k</p>
            </button>`;
        
        const btn = document.getElementById("btn-submit-order");
        if (btn) {
            btn.innerText = "Lanjut Ke Pembayaran";
            btn.onclick = () => showPaymentStep();
        }
    },

    injectDevFeatures() {
        // Logika Role Switcher khusus untuk Master Dev
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        if (userData.username === 'dev') {
            const roleSwitcherHtml = `
                <div id="quantum-switcher" class="mt-8 space-y-4 px-2 fade-in">
                    <h3 class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 pl-1">Quantum Role Switcher</h3>
                    <div class="grid grid-cols-3 gap-3">
                        <button onclick="RoleEngine.fastSwitch('user')" class="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-3xl border border-orange-100 active:scale-90 transition-all"><i class="fas fa-user text-orange-600"></i><span class="text-[7px] font-black uppercase text-orange-900">User</span></button>
                        <button onclick="RoleEngine.fastSwitch('driver')" class="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-3xl border border-blue-100 active:scale-90 transition-all"><i class="fas fa-motorcycle text-blue-600"></i><span class="text-[7px] font-black uppercase text-blue-900">Driver</span></button>
                        <button onclick="RoleEngine.fastSwitch('developer')" class="flex flex-col items-center gap-2 p-4 bg-zinc-100 rounded-3xl border border-zinc-200 active:scale-90 transition-all"><i class="fas fa-code text-zinc-600"></i><span class="text-[7px] font-black uppercase text-zinc-900">Dev</span></button>
                    </div>
                </div>`;
            const container = document.getElementById("profile-menu-container");
            if (container && !document.getElementById("quantum-switcher")) {
                container.insertAdjacentHTML('beforebegin', roleSwitcherHtml);
            }
        }
    }
};

// --- REFRESH ENGINE ---
const dieHantarRefresh = {
    init(id, cb, color = "#ea580c") {
        const c = document.getElementById(id);
        if (!c) return;
        const ind = document.createElement("div");
        ind.id = "ptr-ind";
        ind.className = "flex justify-center items-center overflow-hidden transition-all duration-300 w-full";
        ind.style.height = "0px";
        ind.innerHTML = `<div class="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg" style="color: ${color}"><i class="fas fa-rocket text-sm" id="ptr-icon"></i></div>`;
        c.prepend(ind);
        let sY = 0, pull = false;
        c.addEventListener("touchstart", (e) => { if (c.scrollTop === 0) { sY = e.touches[0].pageY; pull = true; } }, { passive: true });
        c.addEventListener("touchmove", (e) => {
            if (!pull) return;
            const d = e.touches[0].pageY - sY;
            if (d > 0 && d < 100) {
                ind.style.height = d + "px";
                document.getElementById("ptr-icon").style.transform = `rotate(${d * 4}deg)`;
            }
        }, { passive: true });
        c.addEventListener("touchend", async () => {
            if (!pull) return;
            pull = false;
            if (parseInt(ind.style.height) > 60) {
                ind.style.height = "60px";
                document.getElementById("ptr-icon").classList.add("fa-spin");
                if (cb) await cb();
                setTimeout(() => {
                    ind.style.height = "0px";
                    document.getElementById("ptr-icon").classList.remove("fa-spin");
                }, 1000);
            } else ind.style.height = "0px";
        });
    },
};

// --- HELPER GLOBAL ---
function openReceiptFromHistory(orderIndex) {
    if (typeof globalOrders !== 'undefined' && globalOrders[orderIndex]) {
        dieHantarUI.renderReceiptModal(globalOrders[orderIndex]);
    }
}
function closeReceipt() {
    const root = document.getElementById("receipt-root");
    if (root) root.innerHTML = "";
}
function closeBooking() {
    const modal = document.getElementById("modal-booking");
    if (modal) modal.classList.add("hidden");
}