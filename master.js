/**
 * master.js - JANTUNG EKOSISTEM dieHantar v7.2 (Unified Stable)
 * Versi Sultan Tahan Banting - Anti Error JSON
 * Developer: Studio Indragiri
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "data.json");

// 1. MIDDLEWARE WAJIB (Harus Paling Atas)
app.use(express.json());

// ==========================================
// SECTION 1: DATABASE ENGINE (Gudang Data)
// ==========================================

const getData = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const initial = {
                users: [
                    {
                        username: "Rosda",
                        password: "123",
                        name: "Sultan Rosdalianti",
                        role: "user",
                        balance: 100000,
                        points: 50,
                    },
                ],
                drivers: [
                    {
                        username: "driver01",
                        password: "123",
                        name: "Bang Jago",
                        role: "driver",
                        balance: 500000,
                        status: "ONLINE",
                        income: 0,
                        coords: { x: 50, y: 50 },
                        rating: 5.0,
                    },
                ],
                admins: [
                    {
                        username: "dev",
                        password: "123",
                        name: "Master Dev",
                        role: "developer",
                    },
                ],
                orders: [],
                chats: [],
                vouchers: [
                    { code: "SULTAN313", discount: 10000, minOrder: 20000 },
                    { code: "MAKANGRATIS", discount: 5000, minOrder: 15000 },
                ],
                reports: [],
                system: { downloads: 1540, total_revenue: 0 },
            };
            fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
            return initial;
        }
        return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch (e) {
        console.error("Gagal baca database:", e);
        return { users: [], drivers: [], admins: [], orders: [], chats: [], system: { downloads: 0, total_revenue: 0 } };
    }
};

const saveData = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ==========================================
// SECTION 2: API ROUTES (Sebelum Static Files)
// ==========================================

// 1. Login System (Unified Logic)
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const db = getData();
    
    // Gabungkan semua tabel akun untuk pencarian universal
    const allAccounts = [...db.users, ...db.drivers, ...db.admins];
    const account = allAccounts.find(u => u.username === username && u.password === password);

    if (account) {
        console.log(`✅ Login Berhasil: ${username} (${account.role})`);
        return res.json({ success: true, role: account.role, data: account });
    } else {
        console.log(`❌ Login Gagal: ${username}`);
        return res.status(401).json({ success: false, msg: "Username atau Password salah!" });
    }
});

// 2. Financial Hub (dieHantar Pay)
app.post("/api/wallet/transaction", (req, res) => {
    let db = getData();
    const { type, amount, method, target } = req.body;
    
    if (type === "TOPUP") {
        db.users[0].balance += parseInt(amount);
    } else if (type === "TRANSFER") {
        if (db.users[0].balance < amount) return res.status(400).json({ success: false, msg: "Saldo Sultan Tidak Cukup!" });
        db.users[0].balance -= parseInt(amount);
    }
    
    const finRecord = {
        id: Date.now(),
        item: `${type}: ${method}`,
        price: amount,
        paymentMethod: method,
        destination: target || "Sultan Hub",
        status: "COMPLETED",
        time: new Date().toLocaleTimeString("id-ID"),
        date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
    };
    db.orders.push(finRecord);
    saveData(db);
    res.json({ success: true });
});

// 3. Core Business (Order, Chat, Location)
app.post("/api/order", (req, res) => {
    let db = getData();
    const { price } = req.body;
    const earnedPoints = Math.floor(price / 10000) || 0;
    db.users[0].points += earnedPoints;
    
    const newOrder = {
        id: Date.now(),
        ...req.body,
        status: "PENDING",
        pointsEarned: earnedPoints,
        time: new Date().toLocaleTimeString("id-ID"),
        date: new Date().toLocaleDateString("id-ID"),
    };
    db.orders.push(newOrder);
    saveData(db);
    res.json({ success: true, order: newOrder, totalPoints: db.users[0].points });
});

app.get("/api/driver/simulation-order", (req, res) => {
    let db = getData();
    const sultanNames = ["Rosda", "Rama", "Kirana", "Sultan Riau", "Beb Sultan"];
    const items = ["dieMOTOR [Standard]", "dieMOBIL [Sultan Class]", "dieMAKAN: Nasi Goreng", "dieKIRIM: Paket Dokumen"];
    
    const newSimOrder = {
        id: Date.now(),
        item: items[Math.floor(Math.random() * items.length)],
        price: Math.floor(Math.random() * 20000) + 15000,
        customer: sultanNames[Math.floor(Math.random() * sultanNames.length)],
        status: "PENDING",
        time: new Date().toLocaleTimeString("id-ID")
    };
    db.orders.push(newSimOrder);
    saveData(db);
    res.json({ success: true, order: newSimOrder });
});

app.get("/api/driver/location", (req, res) => {
    let db = getData();
    if (db.drivers.length > 0) {
        db.drivers[0].coords.x += (Math.random() * 2 - 1);
        db.drivers[0].coords.y -= (Math.random() * 2);
        saveData(db);
        res.json(db.drivers[0].coords);
    } else {
        res.status(404).send("No driver found");
    }
});

app.get("/api/data", (req, res) => res.json(getData()));

// ==========================================
// SECTION 3: STATIC FILES (Taruh Paling Bawah)
// ==========================================

app.use(express.static(__dirname));

// Menangani Route Utama (Landing ke Login)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// ==========================================
// SECTION 4: RUN ENGINE
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SULTAN ENGINE V7.2 ONLINE`);
    console.log(`👉 Buka http://localhost:${PORT}`);
});