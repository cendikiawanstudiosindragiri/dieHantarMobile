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

    // --- Wallet UI ---
    openWallet() {
        const container = document.getElementById('page-home');
        const user = JSON.parse(localStorage.getItem('user_data')||'{}');
        const username = user.username;
        container.innerHTML = `<div class="p-6 space-y-4">
            <h3 class="text-lg font-black">Dompet Driver</h3>
            <div id="wallet-content">Memuat...</div>
            <div class="mt-4"><button onclick="RoleEngine.updateUI()" class="px-3 py-2 bg-zinc-100 rounded">Kembali</button></div>
        </div>`;
        fetch(`/api/driver/wallet?username=${encodeURIComponent(username)}`).then(r=>r.json()).then(data=>{
            if (!data.success) return document.getElementById('wallet-content').innerText = 'Gagal ambil data dompet';
            const w = data.wallet;
            document.getElementById('wallet-content').innerHTML = `
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-white p-4 rounded">
                        <div class="text-[10px] text-zinc-400">Saldo Kredit</div>
                        <div class="text-xl font-black">Rp ${Number(w.walletCredit||0).toLocaleString('id-ID')}</div>
                    </div>
                    <div class="bg-white p-4 rounded">
                        <div class="text-[10px] text-zinc-400">Pendapatan Tunai</div>
                        <div class="text-xl font-black">Rp ${Number(w.cashBalance||0).toLocaleString('id-ID')}</div>
                    </div>
                </div>
                <div class="mt-4">
                    <input id="withdraw-amount" type="number" class="p-2 border rounded w-1/2" placeholder="Nominal tarik" />
                    <select id="withdraw-method" class="p-2 border rounded">
                        <option value="BANK">Bank</option>
                        <option value="E-WALLET">E-Wallet</option>
                    </select>
                    <button onclick="RoleEngine.requestWithdraw('${username}')" class="ml-2 px-3 py-2 bg-orange-600 text-white rounded">Tarik</button>
                </div>
            `;
        }).catch(e=> document.getElementById('wallet-content').innerText = 'Error');
    },

    requestWithdraw(username){
        const amount = Number(document.getElementById('withdraw-amount').value || 0);
        const method = document.getElementById('withdraw-method').value;
        if (!amount || amount <= 0) return alert('Masukkan nominal valid');
        fetch('/api/driver/withdraw',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ driverUsername: username, amount, method }) }).then(r=>r.json()).then(res=>{
            if (!res.success) return alert(res.msg||'Gagal');
            // prompt OTP for simplicity
            const otpId = res.otpId;
            const otp = prompt('Masukkan OTP (cek console server saat development)');
            fetch('/api/driver/withdraw/verify',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ driverUsername: username, otpId, otp }) }).then(r=>r.json()).then(rr=>{
                if (!rr.success) return alert(rr.msg||'Gagal verifikasi');
                alert('Withdraw berhasil');
                this.updateUI();
            });
        });
    },

    // --- Safety Hub ---
    openSafetyHub(){
        const container = document.getElementById('page-home');
        const user = JSON.parse(localStorage.getItem('user_data')||'{}');
        container.innerHTML = `<div class="p-6 space-y-4">
            <h3 class="text-lg font-black">Safety Hub</h3>
            <p class="text-sm text-zinc-500">Tombol SOS akan mengirim lokasi Anda ke tim darurat perusahaan.</p>
            <div class="mt-4">
                <button id="sos-btn" onclick="RoleEngine.triggerSOS()" class="px-6 py-4 bg-red-600 text-white rounded-xl font-black">SOS</button>
                <button onclick="RoleEngine.updateUI()" class="ml-4 px-3 py-2 bg-zinc-100 rounded">Batal</button>
            </div>
        </div>`;
    },

    triggerSOS(){
        const user = JSON.parse(localStorage.getItem('user_data')||'{}');
        const username = user.username;
        if (!navigator.geolocation) return alert('Geolocation tidak tersedia');
        navigator.geolocation.getCurrentPosition(pos => {
            const coords = { x: pos.coords.longitude, y: pos.coords.latitude };
            fetch('/api/driver/sos',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ driverUsername: username, coords, message: 'SOS from driver app' }) }).then(r=>r.json()).then(res=>{
                if (res.success) alert('Tim darurat telah diberitahu'); else alert('Gagal kirim SOS');
            });
        }, err => { alert('Gagal dapatkan lokasi'); }, { enableHighAccuracy:true, timeout:10000 });
    },

    // --- 2. OPERATIONAL DRIVER DASHBOARD (Compact & Efficient) ---
    renderDriverDashboard(data) {
        const container = document.getElementById("page-home");
        if (!container) return;

        const driver = (data && data.drivers && data.drivers.length) ? data.drivers.find(d => d.username === (localStorage.getItem('user_data') && JSON.parse(localStorage.getItem('user_data')).username)) : (data && data.driver) || (data && data.drivers && data.drivers[0]);
        const balance = driver ? (driver.balance || 0) : 0;
        const isOnline = localStorage.getItem("driver_status") === "online";
        const orders = (data && data.orders) ? data.orders : [];
        const nearby = orders.filter(o => o.status === "PENDING").slice(0, 6);
        const assigned = orders.find(o => o.assignedDriver && o.assignedDriver === (driver && driver.username));

        // compact, fast-render dashboard optimized for drivers on mobile
        container.innerHTML = `
            <div class="p-4 min-h-[80vh] fade-in">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <div class="text-[8px] text-zinc-400 uppercase font-black">Pendapatan</div>
                        <div class="text-2xl font-extrabold">Rp ${balance.toLocaleString('id-ID')}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-[9px] font-black ${isOnline ? 'text-green-500' : 'text-zinc-400'}">${isOnline ? 'Online' : 'Offline'}</div>
                        <button onclick="RoleEngine.toggleDriverStatus()" class="mt-2 px-3 py-1 rounded-xl ${isOnline ? 'bg-green-500 text-white' : 'bg-zinc-200'}">${isOnline ? 'MATIKAN' : 'HIDUPKAN'}</button>
                        <div class="mt-2 flex gap-2 justify-end">
                            <button onclick="RoleEngine.openWallet()" class="px-3 py-1 bg-white rounded border">Dompet</button>
                            <button onclick="RoleEngine.openSafetyHub()" class="px-3 py-1 bg-red-600 text-white rounded">Safety</button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-3 mb-4">
                    <div class="bg-white p-3 rounded-lg text-center">
                        <div class="text-[8px] text-zinc-400 uppercase font-black">Rating</div>
                        <div class="font-black">${driver && driver.rating ? driver.rating.toFixed(1) : '5.0'} ★</div>
                    </div>
                    <div class="bg-white p-3 rounded-lg text-center">
                        <div class="text-[8px] text-zinc-400 uppercase font-black">Bonus Target</div>
                        <div class="font-black" id="daily-bonus-status">-/10 trip</div>
                    </div>
                    <div class="bg-white p-3 rounded-lg text-center">
                        <div class="text-[8px] text-zinc-400 uppercase font-black">Surge</div>
                        <div class="font-black" id="surge-status">1.0x</div>
                    </div>
                </div>
                <div id="bonus-progress" class="mb-4">
                    <div class="text-[8px] text-zinc-500 uppercase font-black mb-1">Bonus Harian: Rp 50.000 untuk 10 trip</div>
                    <div class="w-full bg-zinc-200 rounded-full h-2"><div id="bonus-bar" class="bg-green-500 h-2 rounded-full" style="width:0%"></div></div>
                </div>

                <div class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="text-[9px] font-black text-zinc-500 uppercase">Order Tersedia (${nearby.length})</div>
                        <button onclick="RoleEngine.updateUI()" class="text-[10px] text-zinc-400">Segarkan</button>
                    </div>

                    ${isOnline ? (`<div id="driver-orders" class="space-y-3">${nearby.map(o=>`
                        <div class="flex items-center justify-between bg-white p-3 rounded-lg">
                            <div>
                                <div class="text-xs font-black uppercase">${o.item}</div>
                                <div class="text-[9px] text-zinc-400">${o.origin || 'Lokasi tidak tersedia'}</div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-extrabold">Rp ${parseInt(o.price||0).toLocaleString('id-ID')}</div>
                                <div class="mt-2 flex gap-2">
                                    <button onclick="RoleEngine.processOrder('${o.id}')" class="px-3 py-1 bg-blue-600 text-white rounded-md text-[11px]">Terima</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}</div>`) : (`
                        <div class="bg-white p-6 rounded-lg text-center text-zinc-400">Anda offline. Nyalakan status untuk melihat order.</div>
                    `)}
                </div>

                <div>
                    <div class="text-[9px] font-black text-zinc-500 uppercase mb-2">Order Saat Ini</div>
                    ${assigned ? (`
                        <div class="bg-white p-4 rounded-lg">
                            <div class="flex justify-between items-start">
                                <div>
                                    <div class="text-sm font-extrabold">${assigned.item}</div>
                                    <div class="text-[9px] text-zinc-400">${assigned.origin || ''} → ${assigned.destination || ''}</div>
                                </div>
                                <div class="text-right">
                                    <div class="font-black">Rp ${parseInt(assigned.price||0).toLocaleString('id-ID')}</div>
                                    <div class="mt-2">
                                        <button onclick="RoleEngine.updateUI()" class="px-3 py-1 rounded-md bg-zinc-100 text-zinc-700 mr-2">Batal</button>
                                        <button onclick="RoleEngine.finishAndCollect(${assigned.id}, ${parseInt(assigned.price||0)})" class="px-3 py-1 rounded-md bg-orange-600 text-white">Selesai</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `) : (`
                        <div class="bg-white p-4 rounded-lg text-zinc-400">Belum ada order yang ditugaskan.</div>
                    `)}
                </div>
            </div>
        `;
        // Update bonus and surge display
        const driverUsername = driver && driver.username;
        if (driverUsername) this.updateBonusAndSurge(driverUsername);
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
                    <div id="map" style="width:100%;height:100%;min-height:320px;border-radius:24px;overflow:hidden"></div>
                    <div id="mapPlaceholder" class="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-200 to-gray-100">
                        <div class="text-center">
                            <p class="text-gray-600 font-semibold mb-2">🗺️ Real-time Navigation Map</p>
                            <p class="text-sm text-gray-500">Mapbox GL requires MAPBOX_TOKEN</p>
                            <p class="text-xs text-gray-400 mt-4">📍 Driver coordinates updating in real-time...</p>
                        </div>
                    </div>
                    <script>
                        (function(){
                            // Mapbox GL Integration with Real-Time Driver Tracking
                            const token = window.MAPBOX_TOKEN || '';
                            if (token) {
                                const mapScript = document.createElement('script');
                                mapScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
                                mapScript.onload = () => {
                                    const link = document.createElement('link');
                                    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
                                    link.rel = 'stylesheet';
                                    document.head.appendChild(link);
                                    
                                    // Initialize Mapbox
                                    // eslint-disable-next-line no-undef
                                    mapboxgl.accessToken = token;
                                    // eslint-disable-next-line no-undef
                                    const map = new mapboxgl.Map({
                                        container: 'map',
                                        style: 'mapbox://styles/mapbox/streets-v12',
                                        center: [100.7, 1.3], // Default Riau coordinates
                                        zoom: 13,
                                        pitch: 45,
                                        bearing: -60
                                    });

                                    // Hide placeholder
                                    document.getElementById('mapPlaceholder').style.display = 'none';

                                    map.on('load', () => {
                                        // Add source for driver location
                                        map.addSource('driver-location', {
                                            type: 'geojson',
                                            data: { type: 'Feature', geometry: { type: 'Point', coordinates: [100.7, 1.3] } }
                                        });

                                        // Add driver marker
                                        map.addLayer({
                                            id: 'driver-marker',
                                            type: 'circle',
                                            source: 'driver-location',
                                            paint: { 'circle-radius': 8, 'circle-color': '#3b82f6', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' }
                                        });

                                        // Add destination marker (static for demo)
                                        map.addSource('destination', {
                                            type: 'geojson',
                                            data: { type: 'Feature', geometry: { type: 'Point', coordinates: [100.75, 1.35] } }
                                        });
                                        map.addLayer({
                                            id: 'destination-marker',
                                            type: 'circle',
                                            source: 'destination',
                                            paint: { 'circle-radius': 8, 'circle-color': '#ef4444', 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' }
                                        });

                                        // Add route line
                                        map.addSource('route', {
                                            type: 'geojson',
                                            data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [[100.7, 1.3], [100.75, 1.35]] } }
                                        });
                                        map.addLayer({
                                            id: 'route-line',
                                            type: 'line',
                                            source: 'route',
                                            paint: { 'line-color': '#3b82f6', 'line-width': 3, 'line-opacity': 0.7 }
                                        });

                                        // Fit bounds
                                        const bounds = new mapboxgl.LngLatBounds([100.7, 1.3], [100.75, 1.35]);
                                        map.fitBounds(bounds, { padding: 40 });
                                    });

                                    // Real-time driver location updates (polling)
                                    const orderId = window.currentOrderId || '' + Date.now();
                                    setInterval(() => {
                                        fetch('http://localhost:3000/api/order/' + orderId)
                                            .then(r => r.json())
                                            .then(d => {
                                                if (d.order && d.order.driverCoords) {
                                                    const coords = d.order.driverCoords;
                                                    map.getSource('driver-location').setData({
                                                        type: 'Feature',
                                                        geometry: { type: 'Point', coordinates: [coords.x, coords.y] }
                                                    });
                                                }
                                            }).catch(e => console.log('Tracking:', e));
                                    }, 3000); // Update every 3 seconds
                                };
                                document.head.appendChild(mapScript);
                            }
                        })();
                    </script>
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

    // --- Chat UI & Smart Replies ---
    openChat(orderId){
        const container = document.getElementById('page-home');
        const user = JSON.parse(localStorage.getItem('user_data')||'{}');
        container.innerHTML = `<div class="p-4 space-y-3">
            <div class="flex justify-between items-center"><h3 class="font-black">Chat Order ${orderId}</h3><button onclick="RoleEngine.updateUI()" class="px-2 py-1 bg-zinc-100 rounded">Kembali</button></div>
            <div id="chat-box" class="bg-white p-3 rounded h-64 overflow-y-auto"></div>
            <div id="chat-replies" class="flex gap-2"></div>
            <div class="flex gap-2"><input id="chat-input" class="flex-1 p-2 border rounded" placeholder="Tulis pesan..." /><button onclick="RoleEngine.sendChat('${orderId}')" class="px-3 py-2 bg-blue-600 text-white rounded">Kirim</button></div>
        </div>`;
        this.loadChat(orderId);
        // start SSE
        try{
            const es = new EventSource(`/api/chat/stream?orderId=${encodeURIComponent(orderId)}`);
            es.addEventListener('message', e=>{
                const msg = JSON.parse(e.data);
                RoleEngine.appendChat(msg);
            });
            // store ref so we can close later
            this._chatEventSource = es;
        }catch(e){ }
    },

    loadChat(orderId){
        fetch('/api/chat?orderId='+encodeURIComponent(orderId)).then(r=>r.json()).then(data=>{
            if (!data.success) return;
            const box = document.getElementById('chat-box');
            box.innerHTML = data.chats.map(c=>`<div class="mb-2"><b>${c.from}</b>: ${c.message} <div class="text-[10px] text-zinc-400">${c.time}</div></div>`).join('');
            // load smart replies
            fetch('/api/chat/smart-replies?role=driver').then(r=>r.json()).then(sr=>{
                if (sr.success){
                    const rep = document.getElementById('chat-replies');
                    rep.innerHTML = sr.replies.slice(0,5).map(t=>`<button class="px-2 py-1 bg-zinc-100 rounded" onclick="RoleEngine.sendChat('${orderId}', '${t.replace(/'/g,"\\'")}')">${t}</button>`).join('');
                }
            });
        });
    },

    appendChat(msg){
        const box = document.getElementById('chat-box');
        if (!box) return;
        box.insertAdjacentHTML('beforeend', `<div class="mb-2"><b>${msg.from}</b>: ${msg.message} <div class="text-[10px] text-zinc-400">${msg.time}</div></div>`);
        box.scrollTop = box.scrollHeight;
    },

    sendChat(orderId, text){
        const user = JSON.parse(localStorage.getItem('user_data')||'{}');
        const message = text || document.getElementById('chat-input').value;
        if (!message) return;
        fetch('/api/chat/send',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ orderId, from: user.username || 'driver', message }) }).then(r=>r.json()).then(res=>{
            if (res.success) { this.appendChat(res.msg); document.getElementById('chat-input').value=''; }
        });
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
    },

    updateBonusAndSurge(username){
        if (!username) return;
        fetch(`/api/driver/daily-stats?username=${encodeURIComponent(username)}`).then(r=>r.json()).then(res=>{
            if (res.success){
                const pct = Math.min(100, (res.trips/res.bonusTarget)*100);
                const bar = document.getElementById('bonus-bar');
                if (bar) bar.style.width = pct+'%';
                const status = document.getElementById('daily-bonus-status');
                if (status) status.innerText = res.trips+'/'+res.bonusTarget+' trip';
            }
        });
        fetch('/api/pricing/surge').then(r=>r.json()).then(res=>{
            if (res.success){
                const surge = res.multiplier.toFixed(2);
                const st = document.getElementById('surge-status');
                if (st) st.innerText = surge+'x';
            }
        });
    }
,

    // Selesai & Cuan Masuk — complete order and credit driver
    async finishAndCollect(orderId, earnings){
        const user = JSON.parse(localStorage.getItem('user_data')||'{}');
        const username = user.username;
        try {
            const res = await fetch('/api/driver/complete-order', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ driverUsername: username, orderId, earnings }) });
            const j = await res.json();
            if (!j.success) return alert('Gagal selesaikan order: ' + (j.msg||''));
            SultanNotify('Selesai! Uang masuk: Rp ' + (earnings||0).toLocaleString('id-ID'));
            // go back to dashboard
            await this.updateUI();
            switchPage('home');
        } catch (e) {
            console.error('finishAndCollect', e);
            alert('Gagal menyelesaikan order');
        }
    }
};        });
    }
};