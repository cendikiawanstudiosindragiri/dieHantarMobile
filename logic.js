/**
 * logic.js - Logika Bisnis dieHantar
 */
function startBooking(l, i) {
  activeLayanan = l;
  document.getElementById("input-origin").value = "";
  document.getElementById("input-destination").value = "";
  tempOrderData = { type: "Standard", price: 15000, payment: null };
  AppRenderer.renderBookingOptions();
  document.getElementById("modal-booking").classList.remove("hidden");
}

function setSultanClass(t, p) {
  tempOrderData.type = t;
  tempOrderData.price = p;
  document.querySelectorAll(".class-btn").forEach((b) => {
    b.classList.remove("border-orange-500", "bg-orange-50");
    b.classList.add("bg-gray-50", "border-transparent");
  });
  const tar = t === "Standard" ? "class-standard" : "class-sultan";
  document
    .getElementById(tar)
    .classList.add("border-orange-500", "bg-orange-50");
}

function showPaymentStep() {
  const origin = document.getElementById("input-origin").value;
  const dest = document.getElementById("input-destination").value;
  if (!origin || !dest)
    return alert("Alamat jemput & tujuan wajib Sultan isi Beb!");
  const container = document.getElementById("booking-options");
  const methods = [
    {
      id: "mbanking",
      label: "M-Banking Indonesia",
      icon: "fa-building-columns",
    },
    { id: "qris", label: "Scan QRIS Sultan", icon: "fa-qrcode" },
    { id: "diepay", label: "dieHantar Pay", icon: "fa-wallet" },
    { id: "ewallet", label: "E-Wallet Sultan", icon: "fa-mobile-screen" },
    { id: "potonggajian", label: "Bayar diePotongGajian", icon: "fa-receipt" },
  ];
  container.innerHTML = `<p class="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-4">Metode Pembayaran Sultan</p><div class="space-y-3">${methods.map((m) => `<button onclick="renderPaymentDetails('${m.id}', '${m.label}')" class="pay-option-btn w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent flex items-center justify-between transition-all active:scale-95"><div class="flex items-center gap-4"><div class="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-zinc-900 shadow-sm"><i class="fas ${m.icon} text-xs"></i></div><span class="text-[10px] font-bold text-zinc-700 uppercase">${m.label}</span></div><i class="fas fa-chevron-right text-zinc-300 text-[10px]"></i></button>`).join("")}</div>`;
}

function renderPaymentDetails(id, label) {
  tempOrderData.payment = label;
  const container = document.getElementById("booking-options");
  if (id === "potonggajian") {
    const ptList = [
      "PT. RIAU SAKTI UNITED PLANTATIONS",
      "PT. PUTRA RIAU ABADI",
      "PT. ELANG DAMAY PERKASA",
      "PT. MEDI JAYA ABADI",
      "PT. SRIKANDI MITRA USAHA",
      "PT. RIAU MANDALA PUTRA",
      "PT. ASKAR DAKSA MANDALA",
    ];
    container.innerHTML = `<div class="space-y-6 fade-in pb-4"><div class="p-4 bg-orange-50 rounded-2xl border border-orange-200 flex flex-col items-center text-center"><div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-orange-600 mb-2"><i class="fas fa-barcode text-xl"></i></div><p class="text-[8px] font-black text-orange-600 uppercase mb-1 italic">Scan Identitas Karyawan</p><button class="bg-orange-600 text-white px-3 py-1 rounded-lg text-[8px] font-black">SCAN KODE BATANG</button></div><div class="space-y-3"><input id="pg-name" type="text" placeholder="Nama Lengkap" class="w-full bg-gray-50 p-4 rounded-xl text-[10px] font-bold border border-gray-100"><div class="grid grid-cols-2 gap-3"><input id="pg-nik" type="text" placeholder="NIK Label" class="bg-gray-50 p-4 rounded-xl text-[10px] font-bold border border-gray-100"><input id="pg-fixno" type="number" placeholder="Fix No" class="bg-gray-50 p-4 rounded-xl text-[10px] font-bold border border-gray-100"></div></div><p class="text-[8px] font-black text-zinc-400 uppercase tracking-widest pl-1">Pilih Perusahaan Anda</p><div class="space-y-2 max-h-60 overflow-y-auto no-scrollbar">${ptList.map((pt, i) => `<button onclick="selectSultanPT('${pt}', ${i})" id="pt-card-${i}" class="pt-card w-full p-4 bg-white rounded-2xl border border-gray-100 flex justify-between items-center group text-left transition-all"><div class="flex items-center gap-3"><i class="fas fa-building text-zinc-400 text-[10px]"></i><span class="text-[9px] font-black text-zinc-700 uppercase leading-tight">${pt}</span></div><i class="fas fa-check-circle text-orange-600 opacity-0"></i></button>`).join("")}</div><input id="pg-pt-custom" oninput="clearPTSelection()" type="text" placeholder="Nama PT Belum Terdaftar? Ketik di sini..." class="w-full bg-gray-50 p-4 rounded-xl text-[10px] font-bold border border-gray-100 italic"></div>`;
  } else {
    container.innerHTML = `<div class="p-8 bg-orange-50 rounded-[2.5rem] text-center fade-in"><i class="fas fa-shield-halved text-4xl text-orange-600 mb-4"></i><h4 class="text-sm font-black uppercase text-zinc-800 tracking-tighter">Pembayaran Aman</h4><p class="text-[9px] text-gray-500 mt-2">Menunggu konfirmasi via ${label}</p></div>`;
  }
  document.getElementById("btn-submit-order").innerText = "Konfirmasi & Bayar";
  document.getElementById("btn-submit-order").onclick = () =>
    executeFinalOrder(id);
}

async function executeFinalOrder(payId) {
  let gajian = null;
  if (payId === "potonggajian") {
    const name = document.getElementById("pg-name").value,
      nik = document.getElementById("pg-nik").value,
      fix = document.getElementById("pg-fixno").value;
    if (
      !name ||
      !nik ||
      !fix ||
      (!selectedPTValue && !document.getElementById("pg-pt-custom").value)
    )
      return alert("Lengkapi data Sultan Beb!");
    gajian = {
      name,
      nik,
      fix,
      pt: selectedPTValue || document.getElementById("pg-pt-custom").value,
    };
  }
  const orderPayload = {
    item: `${activeLayanan} [${tempOrderData.type}]`,
    price: tempOrderData.price,
    origin: document.getElementById("input-origin").value,
    destination: document.getElementById("input-destination").value,
    paymentMethod: tempOrderData.payment,
    employeeInfo: gajian,
  };
  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    if (res.ok) {
      closeBooking();
      dieHantarUI.renderReceiptModal(orderPayload);
      syncAll();
    } else alert("Saldo Kurang!");
  } catch (e) {
    alert("Sistem Sibuk!");
  }
}

function shareSultanReceipt(orderEncoded) {
  const order = JSON.parse(decodeURIComponent(orderEncoded));
  const text = `👑 *STRUK DIGITAL dieHantar* 👑\n\n📅 Waktu: ${order.date || "Tgl N/A"} ${order.time || "Jam N/A"}\n🚀 Layanan: ${order.item}\n📍 Dari: ${order.origin}\n🏁 Ke: ${order.destination}\n💳 Bayar: ${order.paymentMethod}\n💰 *TOTAL: Rp ${parseInt(order.price).toLocaleString("id-ID")}*`;
  if (navigator.share)
    navigator.share({ title: "Struk dieHantar", text: text });
  else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

function selectSultanPT(name, index) {
  selectedPTValue = name;
  document.getElementById("pg-pt-custom").value = "";
  document.querySelectorAll(".pt-card").forEach((c) => {
    c.classList.remove("active");
    c.querySelector(".fa-check-circle").classList.add("opacity-0");
  });
  const target = document.getElementById(`pt-card-${index}`);
  target.classList.add("active");
  target.querySelector(".fa-check-circle").classList.remove("opacity-0");
}

function clearPTSelection() {
  selectedPTValue = "";
  document.querySelectorAll(".pt-card").forEach((c) => {
    c.classList.remove("active");
    c.querySelector(".fa-check-circle").classList.add("opacity-0");
  });
}

AppRenderer.renderPromos = function () {
  const container = document.getElementById("promo-list");
  if (!container) return;
  const promos = [
    {
      title: "DISKON GAJIAN",
      desc: "Potongan 50% via diePotongGajian",
      code: "GAJIAN50",
    },
    { title: "SULTAN BARU", desc: "Saldo Awal Rp 100.000", code: "HELLO313" },
  ];
  container.innerHTML = promos
    .map(
      (p) =>
        `<div class="bg-zinc-900 p-6 rounded-[2rem] border border-orange-500/30 relative overflow-hidden"><h4 class="text-orange-500 font-black italic text-sm mb-1">${p.title}</h4><p class="text-white text-[9px] font-bold uppercase opacity-70">${p.desc}</p><div class="mt-4 bg-white/10 px-3 py-1 rounded-lg text-white text-[8px] font-black">${p.code}</div></div>`,
    )
    .join("");
};

async function sendSultanChat() {
  const input = document.getElementById("chat-input-user");
  const text = input.value.trim();
  if (!text) return;
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: "Sultan", text: text }),
    });
    if (res.ok) {
      input.value = "";
      syncAll();
    }
  } catch (e) {}
}

function openWalletAction(action) {
  if (action === "topup")
    alert("Beb, silakan transfer ke Virtual Account Sultan: 8877085123456");
  else if (action === "transfer")
    alert(
      "Fitur Transfer ke Seluruh Bank Indonesia segera hadir di portal Sultan!",
    );
  else if (action === "qris")
    alert("Buka kamera untuk Scan QRIS... (Simulasi)");
}

// Fungsi untuk set alamat cepat
function setQuickAddress(type) {
  const inputDest = document.getElementById("input-destination");
  if (type === "RUMAH") {
    inputDest.value = "Jl. Sultan Syarif Kasim No. 123 (Rumah)";
  } else if (type === "KANTOR") {
    inputDest.value = "Sambu Group Indragiri (Kantor)";
  }
  // Beri efek feedback sedikit
  inputDest.classList.add("border-orange-500", "bg-orange-50");
  setTimeout(
    () => inputDest.classList.remove("border-orange-500", "bg-orange-50"),
    1000,
  );
}
