/**
 * shared-components.js
 * PUSAT KENDALI DESAIN & INTERAKSI dieHantar (Super App Edition)
 * Versi 5.5 - Full Ecosystem, Adaptive Tracking, & Sultan Infinite Wealth
 */

const dieHantarUI = {
  // 1. COMPONENT: ELITE MITRA CARD (Bio Mitra untuk User)
  renderDriverCard(containerId, driverData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
            <div class="driver-profile-card bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden relative fade-in">
                <div class="absolute top-4 right-6 bg-blue-600/20 text-blue-400 text-[7px] font-black px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-tighter">Elite Mitra</div>
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-16 h-16 bg-blue-600/20 rounded-[1.5rem] border border-blue-500/30 p-1">
                        <img src="https://ui-avatars.com/api/?name=${driverData.name}&background=3b82f6&color=fff" class="w-full h-full rounded-[1.2rem] object-cover">
                    </div>
                    <div>
                        <h4 class="text-white font-black italic text-sm uppercase leading-tight">${driverData.name}</h4>
                        <p class="text-zinc-500 text-[8px] font-bold uppercase tracking-widest mt-1">ID: MITRA-TMB-${driverData.id || "772"}</p>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-2 mb-6">
                    <div class="bg-black/40 p-3 rounded-2xl border border-zinc-800 text-center"><p class="text-blue-500 font-black text-[10px]">4.9</p><p class="text-[5px] text-zinc-500 uppercase font-black">Rating</p></div>
                    <div class="bg-black/40 p-3 rounded-2xl border border-zinc-800 text-center"><p class="text-white font-black text-[10px]">842</p><p class="text-[5px] text-zinc-500 uppercase font-black">Trips</p></div>
                    <div class="bg-black/40 p-3 rounded-2xl border border-zinc-800 text-center"><p class="text-white font-black text-[10px]">2Th</p><p class="text-[5px] text-zinc-500 uppercase font-black">Join</p></div>
                </div>
                <div class="bg-black/60 p-4 rounded-3xl border border-zinc-800 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center text-blue-500 text-xs shadow-inner"><i class="fas fa-motorcycle"></i></div>
                        <div><p class="text-[9px] font-black text-white italic">Infinix ZX-10</p><p class="text-[7px] text-zinc-500 font-bold uppercase">Hitam Metalik</p></div>
                    </div>
                    <div class="bg-zinc-100 px-3 py-1 rounded-md border-2 border-zinc-400 shadow-sm"><p class="text-[10px] font-black text-zinc-900 tracking-tighter uppercase">BM 1234 ABC</p></div>
                </div>
            </div>`;
  },

  // 2. COMPONENT: SULTAN USER STATS (Badge Profile)
  renderUserStats(containerId, stats) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
            <div class="grid grid-cols-3 gap-3 mb-6 fade-in">
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center active:scale-95 transition-all"><p class="text-orange-600 font-black text-sm leading-none">${stats.trips || 0}</p><p class="text-[6px] text-gray-400 font-black uppercase mt-1 tracking-widest">Total Trip</p></div>
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center active:scale-95 transition-all"><p class="text-zinc-900 font-black text-sm leading-none">${stats.points || 0}</p><p class="text-[6px] text-gray-400 font-black uppercase mt-1 tracking-widest">Poin Sultan</p></div>
                <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center active:scale-95 transition-all"><p class="text-zinc-900 font-black text-sm leading-none">${stats.years || 1}Th</p><p class="text-[6px] text-gray-400 font-black uppercase mt-1 tracking-widest">Member</p></div>
            </div>`;
  },

  // 3. COMPONENT: SULTAN HISTORY LOG
  renderHistory(containerId, orders) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML =
      orders
        .slice()
        .reverse()
        .map((o) => {
          const isDone = o.status === "COMPLETED";
          return `
                <div class="bg-white p-5 rounded-[2.5rem] border border-gray-100 flex justify-between items-center active:scale-95 transition-all shadow-sm mb-3 fade-in">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 ${isDone ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"} rounded-2xl flex items-center justify-center text-xs shadow-inner"><i class="fas ${isDone ? "fa-check-double" : "fa-clock"}"></i></div>
                        <div>
                            <p class="text-[7px] font-black uppercase ${isDone ? "text-green-500" : "text-orange-500"} tracking-[0.1em] mb-1 leading-none">${o.status}</p>
                            <h4 class="font-black text-xs text-zinc-800 leading-tight">${o.item}</h4>
                            <p class="text-[7px] text-gray-400 font-bold mt-0.5">${o.time}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-black text-xs text-zinc-900 italic leading-none">Rp ${parseInt(o.price || 15000).toLocaleString("id-ID")}</p>
                        <p class="text-[6px] text-zinc-400 font-black mt-1 uppercase italic leading-none tracking-tighter">Sultan_Transaction</p>
                    </div>
                </div>`;
        })
        .join("") ||
      `<div class="text-center py-20 text-[10px] font-black text-gray-300 uppercase italic">Belum Ada Aktivitas</div>`;
  },

  // 4. COMPONENT: SULTAN FINTECH CARD
  renderFinCard(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
            <div class="bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 rounded-[2.5rem] shadow-2xl border border-white/10 text-white relative overflow-hidden fade-in">
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-orange-600/10 rounded-full"></div>
                <div class="flex justify-between items-start mb-8">
                    <div><p class="text-[7px] font-black text-zinc-500 uppercase tracking-[0.2em]">Sultan_Credit_Limit</p><h2 class="text-2xl font-black italic tracking-tighter text-orange-500 mt-1 leading-none">Rp ${data.limit.toLocaleString("id-ID")}</h2></div>
                    <i class="fas fa-bolt text-orange-500 text-xs animate-pulse"></i>
                </div>
                <div class="flex justify-between items-end">
                    <div><p class="text-zinc-500 font-bold text-[6px] uppercase tracking-widest mb-1">Nomor Kontrak</p><p class="text-[9px] font-mono tracking-widest uppercase">SULT-****-****-${data.id}</p></div>
                    <div class="bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-[7px] font-black text-orange-400 uppercase italic">Platinum_Access</div>
                </div>
            </div>`;
  },

  // 5. COMPONENT: SULTAN CHARITY CARD (Amal)
  renderCharityCard(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
            <div class="bg-white rounded-[2.5rem] border border-emerald-100 shadow-xl overflow-hidden mb-6 active:scale-[0.98] transition-all fade-in">
                <div class="h-32 bg-emerald-600 relative overflow-hidden">
                    <img src="${data.img}" class="w-full h-full object-cover opacity-60">
                    <div class="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent"></div>
                    <div class="absolute bottom-4 left-6 text-white"><p class="text-[6px] font-black uppercase tracking-widest opacity-80 leading-none">Campaign Aktif</p><h4 class="text-xs font-black italic uppercase leading-none mt-1">${data.title}</h4></div>
                </div>
                <div class="p-5 space-y-4">
                    <div class="flex justify-between items-end">
                        <div><p class="text-[7px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Terkumpul</p><h3 class="text-sm font-black text-emerald-600 italic leading-none">Rp ${data.collected.toLocaleString("id-ID")}</h3></div>
                        <p class="text-[7px] font-bold text-zinc-400 uppercase">Target: ${data.target}</p>
                    </div>
                    <div class="w-full h-1.5 bg-emerald-50 rounded-full overflow-hidden"><div class="h-full bg-emerald-500 transition-all duration-1000" style="width: ${data.progress}%"></div></div>
                    <button onclick="openDonateModal('${data.title}')" class="w-full py-3 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase italic shadow-lg active:scale-95 transition-all">Bantu Sekarang</button>
                </div>
            </div>`;
  },

  // 6. COMPONENT: UNIVERSAL LIVE MAP (Peta Sultan Adaptif)
  renderLiveMap(containerId, progress, serviceName) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let icon = "fa-motorcycle";
    if (serviceName.includes("MOBIL") || serviceName.includes("TAXI"))
      icon = "fa-car";
    if (serviceName.includes("MAKAN")) icon = "fa-utensils";
    if (serviceName.includes("KIRIM") || serviceName.includes("BOX"))
      icon = "fa-box";
    if (serviceName.includes("TRUCK")) icon = "fa-truck-moving";

    container.innerHTML = `
            <div class="bg-zinc-100 rounded-[2.5rem] h-52 w-full relative overflow-hidden shadow-inner border border-gray-200 fade-in">
                <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 30px 30px;"></div>
                <div class="absolute top-1/2 left-10 right-10 h-1.5 bg-gray-200 rounded-full -translate-y-1/2"></div>
                <div class="absolute top-1/2 left-10 h-1.5 bg-orange-500 rounded-full -translate-y-1/2 transition-all duration-1000 shadow-[0_0_10px_rgba(234,88,12,0.5)]" style="width: ${progress}%" ></div>
                <div class="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col items-center">
                    <div class="w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center text-zinc-900 border-4 border-orange-500 animate-bounce"><i class="fas fa-street-view"></i></div>
                    <p class="text-[6px] font-black uppercase mt-2 tracking-tighter">Lokasi Sultan</p>
                </div>
                <div class="absolute top-1/2 -translate-y-1/2 transition-all duration-1000" style="left: calc(${progress}% + 15px)">
                    <div class="w-12 h-12 bg-zinc-900 rounded-[1.2rem] shadow-2xl flex items-center justify-center text-orange-500 border-2 border-white rotate-[-5deg]"><i class="fas ${icon} text-lg"></i></div>
                    <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[5px] px-3 py-1 rounded-full font-black uppercase whitespace-nowrap shadow-lg">${serviceName.split(" ")[0]} OTW</div>
                </div>
            </div>`;
  },

  // 7. COMPONENT: SULTAN REVIEW MODAL
  renderReviewModal(containerId, driverName) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
            <div id="modal-review" class="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-8 backdrop-blur-sm fade-in">
                <div class="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl text-center animate-slide-up">
                    <div class="w-20 h-20 bg-orange-100 rounded-3xl mx-auto mb-6 flex items-center justify-center text-orange-600 shadow-inner"><i class="fas fa-medal text-3xl"></i></div>
                    <h3 class="text-xl font-black italic uppercase text-zinc-900 leading-tight mb-2">Trip Selesai!</h3>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-8">Beri bintang untuk ${driverName}</p>
                    <div class="flex justify-center gap-3 mb-8">
                        ${[1, 2, 3, 4, 5].map((i) => `<button onclick="setSultanRating(${i})" class="text-2xl transition-all duration-300" id="star-${i}"><i class="far fa-star text-gray-200"></i></button>`).join("")}
                    </div>
                    <textarea id="review-comment" placeholder="Tulis kesan Sultan..." class="w-full p-4 bg-gray-50 rounded-2xl text-[10px] font-medium border-none mb-8 focus:ring-2 focus:ring-orange-500 outline-none h-24 resize-none shadow-inner"></textarea>
                    <button onclick="submitSultanReview()" class="w-full py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase italic shadow-lg active:scale-95 transition-all">Kirim Feedback</button>
                </div>
            </div>`;
  },

  // 8. COMPONENT: CHAT BUBBLES
  renderChat(containerId, messages) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = messages
      .map(
        (m) => `
            <div class="flex ${m.sender === "User" ? "justify-end" : "justify-start"} mb-4 fade-in">
                <div class="max-w-[75%] p-4 rounded-[1.5rem] ${m.sender === "User" ? "bg-orange-600 text-white rounded-tr-none shadow-orange-200" : "bg-white text-zinc-800 rounded-tl-none border border-gray-100 shadow-sm"} shadow-lg">
                    <p class="text-[10px] leading-relaxed font-semibold">${m.text}</p>
                    <p class="text-[6px] mt-1 uppercase opacity-50 font-black text-right">${m.time}</p>
                </div>
            </div>`,
      )
      .join("");
    container.scrollTop = container.scrollHeight;
  },

  // 9. COMPONENT: DRIVER WALLET HUB (Portal Bang Jago)
  renderDriverWallet(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
            <div class="bg-zinc-950 p-7 rounded-[3rem] border border-white/5 shadow-2xl text-white relative overflow-hidden fade-in">
                <div class="absolute right-0 top-0 w-32 h-full bg-blue-600 opacity-5 -skew-x-12 translate-x-16"></div>
                <div class="flex justify-between items-start mb-10">
                    <div><p class="text-[7px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 leading-none">Mitra_Balance_Total</p><h2 class="text-3xl font-black italic tracking-tighter text-blue-500 leading-none">Rp ${data.balance.toLocaleString("id-ID")}</h2></div>
                    <div class="w-10 h-10 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/30 shadow-inner"><i class="fas fa-wallet text-sm"></i></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="openWithdrawModal()" class="py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase italic shadow-lg active:scale-95 transition-all">Withdraw</button>
                    <button onclick="switchPage('earnings-detail')" class="py-4 bg-white/5 text-zinc-400 border border-white/5 rounded-2xl text-[10px] font-black uppercase shadow-sm active:scale-95">Earnings</button>
                </div>
            </div>`;
  },

  // 10. COMPONENT: SULTAN AUTO-TOPUP CARD (Infinite Wealth Manager)
  renderAutoTopupCard(containerId, config) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
            <div class="bg-white p-6 rounded-[2.5rem] border border-orange-100 shadow-sm mb-6 fade-in">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><i class="fas fa-robot text-sm"></i></div>
                        <div><h4 class="text-xs font-black uppercase text-zinc-800">Smart Auto Top-Up</h4><p class="text-[7px] font-bold text-gray-400 uppercase">Status: ${config.active ? "Aktif" : "Non-Aktif"}</p></div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer" ${config.active ? "checked" : ""} onchange="toggleAutoTopup(this.checked)">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 p-3 rounded-2xl"><p class="text-[6px] font-black text-gray-400 uppercase mb-1">Batas Minimal</p><p class="text-[10px] font-black text-zinc-800">Rp ${config.threshold.toLocaleString()}</p></div>
                    <div class="bg-gray-50 p-3 rounded-2xl"><p class="text-[6px] font-black text-gray-400 uppercase mb-1">Jumlah Isi</p><p class="text-[10px] font-black text-orange-600">Rp ${config.amount.toLocaleString()}</p></div>
                </div>
            </div>`;
  },
};

// ==========================================
// 11. INTERACTION ENGINE: PULL TO REFRESH
// ==========================================
const dieHantarRefresh = {
  init(containerId, callback, themeColor = "#ea580c") {
    const container = document.getElementById(containerId);
    if (!container) return;
    const port = window.location.port;
    const refreshIcon = port === "4000" ? "fa-radar" : "fa-rocket";
    const indicator = document.createElement("div");
    indicator.id = "ptr-indicator";
    indicator.className =
      "flex justify-center items-center overflow-hidden transition-all duration-300 w-full bg-transparent";
    indicator.style.height = "0px";
    indicator.innerHTML = `<div class="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg border border-gray-100" style="color: ${themeColor}"><i class="fas ${refreshIcon} text-sm" id="ptr-icon"></i></div>`;
    container.prepend(indicator);
    let startY = 0;
    let pulling = false;
    container.addEventListener(
      "touchstart",
      (e) => {
        if (container.scrollTop === 0) {
          startY = e.touches[0].pageY;
          pulling = true;
        }
      },
      { passive: true },
    );
    container.addEventListener(
      "touchmove",
      (e) => {
        if (!pulling) return;
        const diff = e.touches[0].pageY - startY;
        if (diff > 0 && diff < 100) {
          indicator.style.height = diff + "px";
          const icon = document.getElementById("ptr-icon");
          if (icon) icon.style.transform = `rotate(${diff * 4}deg)`;
        }
      },
      { passive: true },
    );
    container.addEventListener("touchend", async () => {
      if (!pulling) return;
      pulling = false;
      const currentHeight = parseInt(indicator.style.height);
      if (currentHeight > 60) {
        indicator.style.height = "60px";
        const icon = document.getElementById("ptr-icon");
        if (icon) icon.classList.add("fa-spin");
        if (callback) await callback();
        setTimeout(() => {
          indicator.style.height = "0px";
          if (icon) icon.classList.remove("fa-spin");
        }, 1000);
      } else {
        indicator.style.height = "0px";
      }
    });
  },
};

/** BACKWARD COMPATIBILITY & EXPORT */
const DriverProfileComponent = {
  render: (containerId, data) =>
    dieHantarUI.renderDriverCard(containerId, data),
};