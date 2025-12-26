/**
 * app.js - Controller Utama dieHantar
 */

// Global State
let activeLayanan = "",
  progressValue = 0,
  currentRating = 0,
  isDriverRole = false,
  lastStatus = "IDLE";
let tempOrderData = {
  type: "Standard",
  price: 0,
  payment: null,
  gajianData: null,
};
let selectedPTValue = "";
let globalOrders = [];

async function syncAll() {
  try {
    const res = await fetch("/api/data");
    const d = await res.json();
    const user = d.user;
    const activeOrder = d.orders.find((o) => o.status === "PENDING");

    if (lastStatus === "PENDING" && !activeOrder) {
      const sound = document.getElementById("audio-ding");
      if (sound) sound.play().catch((e) => {});
      alert(
        `✨ PERJALANAN SELESAI!\nSultan ${user.name.split(" ")[0]} sampai tujuan.`,
      );
    }
    lastStatus = activeOrder ? "PENDING" : "IDLE";

    if (document.getElementById("welcome-name"))
      document.getElementById("welcome-name").innerText = user.name
        .split(" ")[0]
        .toUpperCase();
    ["user-display-name", "prof-name-display"].forEach((id) => {
      if (document.getElementById(id))
        document.getElementById(id).innerText = user.name.toUpperCase();
    });

    const formattedBalance = "Rp " + user.balance.toLocaleString("id-ID");
    if (document.getElementById("balance"))
      document.getElementById("balance").innerText = formattedBalance;
    if (document.getElementById("wallet-balance-big"))
      document.getElementById("wallet-balance-big").innerText =
        formattedBalance;

    const badge = document.getElementById("active-order-badge");
    if (activeOrder) {
      if (badge) badge.classList.remove("hidden");
    } else {
      if (badge) badge.classList.add("hidden");
      progressValue = 0;
    }

    dieHantarUI.renderHistory("history-list", d.orders);
    if (!document.getElementById("page-chat").classList.contains("hidden")) {
      dieHantarUI.renderChats("chat-box-user", d.chats);
    }
  } catch (e) {
    console.warn("Pulse Gagal...");
  }
}

function switchPage(pageId) {
  document
    .querySelectorAll(".page-content")
    .forEach((p) => p.classList.add("hidden"));
  const target = document.getElementById("page-" + pageId);
  if (target) target.classList.remove("hidden");

  if (pageId === "promo") AppRenderer.renderPromos();
  if (["history", "chat", "wallet-hub"].includes(pageId)) syncAll();

  document.querySelectorAll("nav button").forEach((b) => {
    b.classList.remove("active-tab", "text-orange-600");
    b.classList.add("text-gray-300");
  });
  const navBtn = document.getElementById(
    "nav-" +
      (pageId === "all-services" || pageId === "wallet-hub" ? "home" : pageId),
  );
  if (navBtn) {
    navBtn.classList.add("active-tab", "text-orange-600");
    navBtn.classList.remove("text-gray-300");
  }
}

// Di dalam app.js bagian logout, panggil saja auth.js
function logout() {
  SultanAuth.logout();
}

// Di dalam app.js bagian window.onload
window.onload = () => {
  // SultanAuth.checkAccess() sudah otomatis jalan di auth.js
  AppRenderer.init(window.location.port === "4000");
  syncAll();
  setInterval(syncAll, 2000);
  switchPage("home");
  console.log("🚀 THE SULTAN SYSTEM: SECURED & ONLINE");
};

window.onload = () => {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
    return;
  }
  AppRenderer.init(window.location.port === "4000");
  syncAll();
  setInterval(syncAll, 2000);
  switchPage("home");
  dieHantarRefresh.init(
    "main-scroll-container",
    async () => {
      await syncAll();
    },
    window.location.port === "4000" ? "#2563eb" : "#ea580c",
  );
};

function SultanNotify(message, type = "success") {
  const notifyDiv = document.createElement("div");
  notifyDiv.className = `fixed top-10 left-1/2 -translate-x-1/2 z-[999] px-6 py-4 rounded-[2rem] shadow-2xl backdrop-blur-md border ${type === "success" ? "bg-zinc-900/90 border-orange-500 text-white" : "bg-red-600 text-white"} fade-in`;
  notifyDiv.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas ${type === "success" ? "fa-check-circle text-orange-500" : "fa-exclamation-triangle"}"></i>
            <span class="text-[9px] font-black uppercase tracking-widest">${message}</span>
        </div>
    `;
  document.body.appendChild(notifyDiv);
  setTimeout(() => notifyDiv.remove(), 3000);
}
