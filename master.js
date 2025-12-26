/**
 * master.js - JANTUNG EKOSISTEM dieHantar v7.5 (Enterprise Edition)
 * Includes: Order Management, Driver Operations, Audit Logs, Admin Dashboard, Loyalty, OTP, Device Binding
 * Developer: Studio Indragiri
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "data.json");

// Middleware
app.use(express.json());

// CONFIG
const ASSIGN_RADIUS_KM = 5;
const ASSIGN_RESPONSE_TIMEOUT = 15000;
const GEOFENCE_METERS = 50;
const DAILY_BONUS_TRIPS = 10;
const DAILY_BONUS_AMOUNT = 50000;
const SURGE_MULTIPLIER_HIGH = 1.5;
const SURGE_MULTIPLIER_RAIN = 1.3;

// Runtime stores
const assignmentTimers = {};
const chatStreams = {};
const dailyTrips = {};
const otpStore = {};
const deviceStore = {};

// Database Engine
const getData = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            const initial = {
                users: [
                    { username: "Rosda", password: "123", name: "Sultan Rosdalianti", role: "user", balance: 160000, points: 146, phone: "+6282123456789" },
                    { username: "admin", password: "123", name: "Admin Panel", role: "admin", balance: 0, points: 0, phone: null }
                ],
                drivers: [
                    { username: "driver01", password: "123", name: "Bang Jago", role: "driver", balance: 500000, status: "ONLINE", income: 0, coords: { x: 50, y: 50 }, rating: 5.0, phone: "+6281234567890" },
                    { username: "testdriver", password: "123", name: "Test Driver", role: "driver", balance: 250000, status: "OFFLINE", income: 0, coords: { x: 50.1, y: 50.1 }, rating: 4.8, phone: "+6289876543210" }
                ],
                admins: [
                    { username: "dev", password: "123", name: "Master Dev", role: "dev", phone: null }
                ],
                orders: [],
                chats: [],
                vouchers: [
                    { code: "SULTAN313", discount: 10000, minOrder: 20000 },
                    { code: "MAKANGRATIS", discount: 5000, minOrder: 15000 }
                ],
                logs: [],
                system: { downloads: 1540, total_revenue: 0, weather: null }
            };
            fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
            return initial;
        }
        return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch (e) {
        console.error("❌ Database error:", e.message);
        return { users: [], drivers: [], admins: [], orders: [], chats: [], logs: [], system: {} };
    }
};

const saveData = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Helper: Calculate surge multiplier
function calculateSurgeMultiplier() {
    const db = getData();
    const pending = (db.orders || []).filter(o => o.status === 'PENDING').length;
    const online = (db.drivers || []).filter(d => d.status === 'ONLINE').length;
    const ratio = online > 0 ? pending / online : pending;
    let mult = 1.0;
    if (ratio > 3) mult = SURGE_MULTIPLIER_HIGH;
    else if (ratio > 1) mult = 1.2;
    const hr = new Date().getHours();
    if ((hr >= 7 && hr <= 9) || (hr >= 17 && hr <= 19)) mult = Math.max(mult, mult * 1.1);
    const weather = (db.system && db.system.weather) || null;
    if (weather === 'rain') mult = Math.max(mult, SURGE_MULTIPLIER_RAIN);
    return parseFloat(mult.toFixed(2));
}

// Helper: Log transactions to audit trail
function logTransaction(type, username, amount, description = '', balBefore = null, balAfter = null, db = null, isAudit = true) {
    const database = db || getData();
    const logEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type,
        username,
        amount,
        description,
        balanceChange: balAfter !== null && balBefore !== null ? balAfter - balBefore : 0
    };
    database.logs = database.logs || [];
    database.logs.push(logEntry);
    if (!db) saveData(database);
}

// Helper: Send WhatsApp OTP (Twilio/Vonage scaffold)
function sendWhatsAppOTP(phoneNumber, otp, username) {
    // PRODUCTION: Uncomment when Twilio credentials are configured
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) {
        console.log(`⚠️ Twilio not configured. Simulating OTP: ${otp}`);
        return true;
    }
    try {
        const twilio = require('twilio')(accountSid, authToken);
        twilio.messages.create({
            body: `🔐 dieHantar OTP: ${otp} (valid for 10 minutes)`,
            from: 'whatsapp:+1234567890',
            to: `whatsapp:${phoneNumber}`
        }).then(msg => {
            console.log(`✅ WhatsApp OTP sent: ${msg.sid}`);
        });
        return true;
    } catch (err) {
        console.error(`❌ Twilio error: ${err.message}`);
        return false;
    }
    */
    console.log(`📱 WhatsApp OTP for ${username} (+${phoneNumber}): ${otp}`);
    return true;
}

// ==============================================
// ROLE-BASED ACCESS CONTROL MIDDLEWARE
// ==============================================
function isAdminOrDev(req, res, next) {
    const { username } = req.body || req.query;
    if (!username) return res.status(401).json({ success: false, msg: 'Unauthorized: no username' });
    const db = getData();
    const user = db.users.find(u => u.username === username) || 
                 db.drivers.find(u => u.username === username) || 
                 db.admins.find(u => u.username === username);
    if (!user) return res.status(401).json({ success: false, msg: 'Unauthorized: user not found' });
    // Allow admin, dev, or developer roles
    if (!['admin', 'dev', 'developer'].includes(user.role)) {
        logTransaction('UNAUTHORIZED_ACCESS_ATTEMPT', username, 0, 'Attempted admin access without proper role');
        return res.status(403).json({ success: false, msg: 'Forbidden: admin access required' });
    }
    req.user = user;
    next();
}

// ==============================================
// AUTHENTICATION ENDPOINTS
// ==============================================

// 1. Login with Device Binding & OTP
app.post("/api/login", (req, res) => {
    const { username, password, deviceId } = req.body;
    const db = getData();
    
    const allAccounts = [...db.users, ...db.drivers, ...db.admins];
    const account = allAccounts.find(u => u.username === username && u.password === password);

    if (!account) {
        console.log(`❌ Login Failed: ${username}`);
        return res.status(401).json({ success: false, msg: "Username atau Password salah!" });
    }

    // Device binding
    const registered = deviceStore[username];
    if (registered && registered.deviceId !== deviceId) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[username] = { code: otp, expires: Date.now() + 600000, attempts: 0, deviceId };
        if (account.phone) {
            sendWhatsAppOTP(account.phone, otp, username);
        } else {
            console.log(`🔒 OTP for ${username}: ${otp}`);
        }
        return res.json({ success: true, msg: "New device detected. OTP sent via WhatsApp", requiresOTP: true, deviceId });
    }

    // Register device
    deviceStore[username] = { deviceId, registeredAt: new Date().toLocaleString('id-ID'), lastLogin: new Date().toLocaleString('id-ID') };
    console.log(`✅ Login Success: ${username} (${account.role})`);
    return res.json({ success: true, role: account.role, data: account, deviceId });
});

// 2. Verify OTP and finalize login
app.post('/api/login/verify-otp', (req, res) => {
    const { username, otp, deviceId } = req.body;
    const store = otpStore[username];
    if (!store) return res.status(400).json({ success: false, msg: 'No OTP requested' });
    if (store.expires < Date.now()) { delete otpStore[username]; return res.status(400).json({ success: false, msg: 'OTP expired' }); }
    if (store.code !== String(otp)) { store.attempts++; return res.status(400).json({ success: false, msg: 'Invalid OTP', attempts: store.attempts }); }
    
    const db = getData();
    const account = [...db.users, ...db.drivers, ...db.admins].find(u => u.username === username);
    deviceStore[username] = { deviceId, registeredAt: new Date().toLocaleString('id-ID'), lastLogin: new Date().toLocaleString('id-ID') };
    logTransaction('OTP_VERIFIED', username, 0, `Device ${deviceId} verified`, null, null, db, true);
    delete otpStore[username];
    saveData(db);
    return res.json({ success: true, role: account.role, data: account, msg: 'Device registered' });
});

// ==============================================
// ADMIN DASHBOARD & REPORTS
// ==============================================

app.get('/api/admin/dashboard', isAdminOrDev, (req,res)=>{
    const db = getData();
    const orders = db.orders || [];
    const drivers = db.drivers || [];
    const completed = orders.filter(o => o.status === 'COMPLETED').length;
    const revenue = orders.filter(o => o.status === 'COMPLETED').reduce((sum, o) => sum + (o.price || 0), 0);
    const avgRating = drivers.length > 0 ? (drivers.reduce((sum, d) => sum + (d.rating || 5), 0) / drivers.length).toFixed(2) : 5;
    const onlineDrivers = drivers.filter(d => d.status === 'ONLINE').length;
    logTransaction('ADMIN_ACCESS', req.user.username, 0, 'DASHBOARD', null, null, db, false);
    saveData(db);
    return res.json({
        success: true,
        dashboard: {
            totalOrders: orders.length,
            completedOrders: completed,
            totalRevenue: revenue,
            totalDrivers: drivers.length,
            onlineDrivers,
            avgDriverRating: parseFloat(avgRating),
            totalUsers: (db.users || []).length,
            timestamp: new Date().toLocaleString('id-ID')
        }
    });
});

app.get('/api/admin/reports/daily', isAdminOrDev, (req,res)=>{
    const db = getData();
    const orders = (db.orders || []).filter(o => o.status === 'COMPLETED');
    const today = new Date().toLocaleDateString('id-ID');
    const todayOrders = orders.filter(o => (o.date === today) || (o.completedAt && o.completedAt.includes(today)));
    logTransaction('ADMIN_ACCESS', req.user.username, 0, 'DAILY_REPORT', null, null, db, false);
    saveData(db);
    return res.json({
        success: true,
        report: {
            date: today,
            ordersCompleted: todayOrders.length,
            revenueToday: todayOrders.reduce((sum, o) => sum + (o.price || 0), 0),
            avgOrderValue: todayOrders.length > 0 ? (todayOrders.reduce((sum, o) => sum + (o.price || 0), 0) / todayOrders.length).toFixed(2) : 0
        }
    });
});

app.get('/api/admin/reports/drivers', isAdminOrDev, (req,res)=>{
    const db = getData();
    const driverStats = (db.drivers || []).map(d => ({
        username: d.username,
        name: d.name,
        status: d.status,
        balance: d.balance || 0,
        rating: d.rating || 5,
        totalIncome: d.income || 0,
        totalOrders: (db.orders || []).filter(o => o.assignedDriver === d.username && o.status === 'COMPLETED').length
    }));
    logTransaction('ADMIN_ACCESS', req.user.username, 0, 'DRIVER_REPORT', null, null, db, false);
    saveData(db);
    return res.json({ success: true, drivers: driverStats });
});

app.get('/api/admin/audit-logs', isAdminOrDev, (req,res)=>{
    const db = getData();
    const logs = (db.logs || []).slice(-100);
    return res.json({ success: true, count: logs.length, logs });
});

// ==============================================
// LOYALTY POINTS SYSTEM
// ==============================================

app.post('/api/points/award', isAdminOrDev, (req,res)=>{
    const { username, points, reason } = req.body;
    if (!username || !points) return res.status(400).json({ success: false, msg: 'Missing fields' });
    const db = getData();
    const user = db.users.find(u => u.username === username);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    user.points = (user.points || 0) + points;
    logTransaction('POINTS_AWARDED', username, points, reason || 'Points earned', user.points - points, user.points, db, false);
    saveData(db);
    return res.json({ success: true, points: user.points });
});

app.get('/api/points/balance/:username', (req,res)=>{
    const db = getData();
    const user = db.users.find(u => u.username === req.params.username);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    return res.json({ success: true, username: user.username, points: user.points || 0, balance: user.balance || 0 });
});

app.post('/api/points/redeem', (req,res)=>{
    const { username, points } = req.body;
    if (!username || !points) return res.status(400).json({ success: false, msg: 'Missing fields' });
    const db = getData();
    const user = db.users.find(u => u.username === username);
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    if ((user.points || 0) < points) return res.status(400).json({ success: false, msg: 'Insufficient points' });
    user.points -= points;
    const discountGiven = Math.floor(points / 100) * 1000;
    logTransaction('POINTS_REDEEMED', username, points, `Redeemed for Rp ${discountGiven} discount`, user.points + points, user.points, db, false);
    saveData(db);
    return res.json({ success: true, pointsRemaining: user.points, discountGiven });
});

// ==============================================
// SAMBU EMPLOYEE INTEGRATION
// ==============================================

const mockEmployees = [
    { nik: '1234567890', companyId: 'SAMBU001', name: 'Ahmad Rifki', company: 'PT Sambu Group' },
    { nik: '0987654321', companyId: 'SAMBU001', name: 'Siti Nurhaliza', company: 'PT Sambu Group' }
];

app.post('/api/payment/sambu-deduction', (req,res)=>{
    const { username, nik, companyId, amount } = req.body;
    if (!username || !nik || !companyId || !amount) return res.status(400).json({ success: false, msg: 'Missing fields' });
    
    const employee = mockEmployees.find(e => e.nik === nik && e.companyId === companyId);
    if (!employee) return res.status(404).json({ success: false, msg: 'Employee not verified' });
    
    const db = getData();
    logTransaction('PAYROLL_DEDUCTION', username, amount, `Deducted for ${employee.name}`, null, null, db, false);
    saveData(db);
    return res.json({ success: true, msg: `Rp ${amount.toLocaleString('id-ID')} deducted from next salary for ${employee.name}`, employeeName: employee.name });
});

// ==============================================
// ORDER MANAGEMENT
// ==============================================

app.post("/api/order", (req, res) => {
    let db = getData();
    const { customer, item, price, originCoords, destinationCoords } = req.body;
    
    const newOrder = {
        id: Date.now(),
        customer,
        item,
        price: parseInt(price) || 0,
        status: "PENDING",
        originCoords,
        destinationCoords,
        driverCoords: originCoords,
        assignedDriver: null,
        createdAt: new Date().toLocaleString('id-ID'),
        date: new Date().toLocaleDateString('id-ID')
    };
    
    (db.orders = db.orders || []).push(newOrder);
    saveData(db);
    res.json({ success: true, order: newOrder });
});

app.get("/api/order/:id", (req, res) => {
    const db = getData();
    const order = (db.orders || []).find(o => o.id == req.params.id);
    if (!order) return res.status(404).json({ success: false, msg: 'Order not found' });
    res.json({ success: true, order });
});

app.post("/api/order/lock", (req, res) => {
    const { orderId, driverUsername } = req.body;
    const db = getData();
    const order = (db.orders || []).find(o => o.id == orderId);
    if (!order) return res.status(404).json({ success: false, msg: 'Order not found' });
    if (order.lockedBy && order.lockedBy !== driverUsername) return res.status(409).json({ success: false, msg: 'Order already locked' });
    
    order.lockedBy = driverUsername;
    order.lockTs = Date.now();
    saveData(db);
    logTransaction('LOCK', driverUsername, 0, `Order ${orderId} locked`);
    res.json({ success: true, msg: 'Order locked', order });
});

app.post("/api/order/unlock", (req, res) => {
    const { orderId } = req.body;
    const db = getData();
    const order = (db.orders || []).find(o => o.id == orderId);
    if (!order) return res.status(404).json({ success: false, msg: 'Order not found' });
    
    delete order.lockedBy;
    delete order.lockTs;
    saveData(db);
    res.json({ success: true, msg: 'Order unlocked', order });
});

app.post("/api/driver/accept-order", (req, res) => {
    const { driverUsername, orderId } = req.body;
    const db = getData();
    const order = (db.orders || []).find(o => o.id == orderId);
    if (!order) return res.status(404).json({ success: false, msg: 'Order not found' });
    
    order.status = 'ALLOCATED';
    order.assignedDriver = driverUsername;
    saveData(db);
    res.json({ success: true, order });
});

app.post("/api/driver/start-trip", (req, res) => {
    const { driverUsername, orderId } = req.body;
    const db = getData();
    const order = (db.orders || []).find(o => o.id == orderId);
    if (!order) return res.status(404).json({ success: false, msg: 'Order not found' });
    
    order.status = 'ON_TRIP';
    order.startedAt = new Date().toLocaleString('id-ID');
    saveData(db);
    res.json({ success: true, order });
});

app.post("/api/driver/complete-order", (req, res) => {
    const { driverUsername, orderId, earnings } = req.body;
    const db = getData();
    const order = (db.orders || []).find(o => o.id == orderId);
    const driver = (db.drivers || []).find(d => d.username === driverUsername);
    
    if (!order) return res.status(404).json({ success: false, msg: 'Order not found' });
    if (!driver) return res.status(404).json({ success: false, msg: 'Driver not found' });
    
    order.status = 'COMPLETED';
    order.completedAt = new Date().toLocaleString('id-ID');
    const balBefore = driver.balance;
    driver.balance += earnings;
    driver.income = (driver.income || 0) + earnings;
    
    // Daily bonus check
    dailyTrips[driverUsername] = dailyTrips[driverUsername] || { date: new Date().toLocaleDateString('id-ID'), trips: 0 };
    if (dailyTrips[driverUsername].date === new Date().toLocaleDateString('id-ID')) {
        dailyTrips[driverUsername].trips++;
        if (dailyTrips[driverUsername].trips === DAILY_BONUS_TRIPS) {
            driver.balance += DAILY_BONUS_AMOUNT;
            logTransaction("BONUS", driverUsername, DAILY_BONUS_AMOUNT, `Daily bonus (${DAILY_BONUS_TRIPS} trips)`, balBefore, driver.balance, db, false);
        }
    }
    
    logTransaction('EARNINGS', driverUsername, earnings, `Order ${orderId} completed`, balBefore, driver.balance, db, false);
    saveData(db);
    res.json({ success: true, order, driver });
});

// ==============================================
// CHAT & MESSAGING
// ==============================================

app.post("/api/chat/send", (req, res) => {
    const { orderId, from, message } = req.body;
    const db = getData();
    (db.chats = db.chats || []).push({ id: Date.now(), orderId, from, message, timestamp: new Date().toLocaleString('id-ID') });
    saveData(db);
    res.json({ success: true, msg: 'Message sent' });
});

app.get("/api/chat", (req, res) => {
    const db = getData();
    const messages = (db.chats || []).filter(c => c.orderId == req.query.orderId);
    res.json({ success: true, messages });
});

app.get('/api/chat/smart-replies', (req,res)=>{
    const text = (req.query.text || '').toLowerCase();
    let replies = ['Baik, siap!', 'Tunggu sebentar', 'Lagi dalam perjalanan'];
    if (text.includes('lokasi') || text.includes('alamat')) replies = ['Alamat mana?', 'Posisi sudah tertera', 'Sudah sampai tujuan'];
    if (text.includes('terlambat') || text.includes('delay')) replies = ['Maaf, lagi macet', 'Traffic parah', 'Akan segera tiba'];
    if (text.includes('siap') || text.includes('ready')) replies = ['Baik, tunggu disini', 'Sudah siap diambil', 'Barang sudah disiapkan'];
    res.json({ success: true, replies });
});

// ==============================================
// SOS & SAFETY
// ==============================================

app.post("/api/driver/sos", (req, res) => {
    const { driverUsername, coords, message } = req.body;
    const db = getData();
    logTransaction('SOS', driverUsername, 0, `Emergency: ${message} at (${coords.x}, ${coords.y})`);
    saveData(db);
    console.log(`🚨 SOS from ${driverUsername}: ${message}`);
    res.json({ success: true, msg: 'SOS alert sent' });
});

// ==============================================
// SYSTEM & MISC
// ==============================================

app.post('/api/system/weather', (req,res)=>{
    const { weather } = req.body;
    const db = getData();
    db.system = db.system || {};
    db.system.weather = weather || null;
    saveData(db);
    res.json({ success: true, weather: db.system.weather });
});

app.get('/api/pricing/surge', (req,res)=>{
    res.json({ success: true, multiplier: calculateSurgeMultiplier() });
});

app.get('/api/logs/audit/all', (req,res)=>{
    const db = getData();
    res.json({ success: true, count: (db.logs || []).length, logs: db.logs || [] });
});

app.get('/api/logs/audit/type', (req,res)=>{
    const db = getData();
    const filtered = (db.logs || []).filter(l => l.type === req.query.type);
    res.json({ success: true, count: filtered.length, logs: filtered });
});

app.post("/api/voucher/validate", (req, res) => {
    const { code, basePrice } = req.body;
    const db = getData();
    const voucher = (db.vouchers || []).find(v => v.code === code);
    if (!voucher) return res.status(404).json({ success: false, msg: 'Voucher not found' });
    const bp = parseInt(basePrice) || 0;
    if (bp < voucher.minOrder) return res.status(400).json({ success: false, msg: 'Min order not met' });
    const discountedPrice = Math.max(0, bp - voucher.discount);
    res.json({ success: true, voucher, basePrice: bp, discount: voucher.discount, finalPrice: discountedPrice });
});

app.get("/api/data", (req, res) => res.json(getData()));

// ==============================================
// STATIC FILES & LANDING
// ==============================================

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SULTAN ENGINE V7.5 ONLINE`);
    console.log(`🔒 Device Binding & OTP: ACTIVE`);
    console.log(`👨‍💼 Admin Dashboard: /admin-dashboard.html`);
    console.log(`👉 Web: http://localhost:${PORT}`);
});
