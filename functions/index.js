
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function (Callable) untuk menghitung tarif secara aman di sisi server.
 * Mencegah manipulasi perhitungan tarif dari client-side.
 */
exports.calculateFare = functions.https.onCall(async (data, context) => {
    // Pastikan user sudah terotentikasi sebelum menghitung
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Anda harus login untuk melakukan aksi ini.');
    }

    const distance = data.distance; // dalam km
    if (!distance || typeof distance !== 'number') {
        throw new functions.https.HttpsError('invalid-argument', 'Data jarak (distance) tidak valid.');
    }

    // --- Logika Tarif Dinamis Sultan ---
    const BASE_FARE = 5000; // Rp 5.000
    const RATE_PER_KM = 2500; // Rp 2.500 per km

    // Dapatkan multiplier berdasarkan waktu (contoh: jam sibuk)
    const now = new Date();
    const hours = now.getHours();
    let surgeMultiplier = 1.0; // Normal
    if (hours >= 17 && hours <= 19) { // Jam sibuk (5 sore - 7 malam)
        surgeMultiplier = 1.5;
    }

    const finalFare = (BASE_FARE + (distance * RATE_PER_KM)) * surgeMultiplier;

    // Mengembalikan hasil perhitungan ke client
    return { calculatedFare: Math.round(finalFare) };
});

/**
 * Cloud Function (Firestore Trigger) untuk memproses pembayaran setelah order selesai.
 * Terpicu secara otomatis saat status order diubah menjadi 'COMPLETED'.
 */
exports.processCompletedOrder = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
        const orderDataAfter = change.after.data();
        const orderDataBefore = change.before.data();

        // Hanya proses jika status berubah menjadi 'COMPLETED'
        if (orderDataAfter.status === 'COMPLETED' && orderDataBefore.status !== 'COMPLETED') {
            const { customerId, driverId, price } = orderDataAfter;

            if (!customerId || !driverId || !price) {
                console.error("Data order tidak lengkap untuk proses pembayaran.", context.params.orderId);
                return null;
            }

            // Referensi ke dokumen user dan driver
            const customerRef = db.collection('users').doc(customerId);
            const driverRef = db.collection('users').doc(driverId); // Asumsi driver ada di koleksi users

            try {
                 return db.runTransaction(async (transaction) => {
                    const customerDoc = await transaction.get(customerRef);
                    const driverDoc = await transaction.get(driverRef);

                    if (!customerDoc.exists || !driverDoc.exists) {
                        throw new Error("Dokumen customer atau driver tidak ditemukan.");
                    }

                    const customerBalance = customerDoc.data().balance || 0;
                    const driverBalance = driverDoc.data().balance || 0;

                    if (customerBalance < price) {
                        console.error(`Saldo customer ${customerId} tidak cukup untuk membayar pesanan ${context.params.orderId}`);
                        // Mungkin perlu menandai pesanan sebagai 'PAYMENT_FAILED'
                        return null;
                    }

                    // Lakukan pemotongan saldo customer dan penambahan saldo driver
                    transaction.update(customerRef, { balance: customerBalance - price });
                    transaction.update(driverRef, { balance: driverBalance + price });
                    
                    console.log(`Pembayaran untuk order ${context.params.orderId} berhasil. Saldo driver ${driverId} ditambah ${price}.`);
                    return true;
                });
            } catch (error) {
                console.error("Gagal memproses transaksi pembayaran:", error);
                return null;
            }
        }

        return null;
    });

/**
 * Cloud Function (Callable) untuk driver menerima pesanan (Accept Order).
 * Menggunakan transaksi untuk memastikan hanya satu driver yang dapat mengambil.
 * Mengubah status pesanan dan mengirim notifikasi ke user.
 */
exports.acceptOrder = functions.https.onCall(async (data, context) => {
    // 1. Pastikan user (driver) sudah terotentikasi
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Akses ditolak. Anda harus login sebagai driver.');
    }

    const driverId = context.auth.uid;
    const { orderId } = data;

    if (!orderId) {
        throw new functions.https.HttpsError('invalid-argument', 'OrderID tidak boleh kosong.');
    }

    // 2. Referensi ke dokumen-dokumen yang relevan
    const orderRef = db.collection('orders').doc(orderId);
    const driverRef = db.collection('users').doc(driverId);

    try {
        let customerId;
        let customerFcmToken;

        // 3. Menjalankan Firestore Transaction
        await db.runTransaction(async (transaction) => {
            const orderDoc = await transaction.get(orderRef);
            const driverDoc = await transaction.get(driverRef);

            // Validasi dasar
            if (!orderDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Pesanan tidak ditemukan.');
            }
            if (!driverDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Data driver tidak ditemukan.');
            }

            const orderData = orderDoc.data();
            const driverData = driverDoc.data();

            // 4. Kondisi Kritis: Pastikan order masih tersedia
            if (orderData.status !== 'LOOKING_FOR_DRIVER') {
                // Jika status bukan 'LOOKING_FOR_DRIVER', berarti driver lain sudah mengambilnya.
                // Transaksi akan gagal dan driver akan mendapat error.
                throw new functions.https.HttpsError('aborted', 'Maaf, pesanan ini sudah diambil oleh driver lain.');
            }
            
            // Simpan customerId untuk notifikasi nanti
            customerId = orderData.customerId;

            // 5. Update Dokumen Order dan Driver dalam transaksi
            transaction.update(orderRef, {
                status: 'PICKING_UP', // Ubah status pesanan
                driverId: driverId,
                driverInfo: { // Simpan info driver untuk ditampilkan ke user
                    name: driverData.fullname || 'Mitra Driver',
                    vehicle: driverData.vehicle || { plate: 'B 1234 XYZ', type: 'Motor Matic' },
                    rating: driverData.rating || 5.0
                }
            });

            // Update status driver menjadi 'sibuk'
            transaction.update(driverRef, {
                currentOrderStatus: 'BUSY'
            });
            
            console.log(`Driver ${driverId} berhasil menerima pesanan ${orderId}. Transaksi berhasil.`);
        });

        // --- Logika setelah transaksi sukses ---
        
        if (!customerId) {
            console.error('Transaksi berhasil, namun customerId tidak ditemukan untuk mengirim notifikasi.');
            return { success: true, message: 'Pesanan berhasil diterima, tetapi gagal mengirim notifikasi ke user.' };
        }
        
        // 6. Dapatkan FCM Token milik customer
        const customerRef = db.collection('users').doc(customerId);
        const customerDoc = await customerRef.get();
        if (customerDoc.exists && customerDoc.data().fcmToken) {
            customerFcmToken = customerDoc.data().fcmToken;
        }

        // 7. Kirim Notifikasi Push ke User jika token ada
        if (customerFcmToken) {
            const payload = {
                notification: {
                    title: 'Driver Ditemukan!',
                    body: 'Seorang Sultan Driver sedang dalam perjalanan untuk menjemput Anda.',
                    sound: 'default'
                },
                token: customerFcmToken
            };

            await admin.messaging().send(payload);
            console.log(`Notifikasi berhasil dikirim ke customer ${customerId} untuk pesanan ${orderId}.`);
        } else {
             console.log(`Customer ${customerId} tidak memiliki FCM token, notifikasi tidak dikirim.`);
        }

        return { success: true, message: 'Pesanan berhasil diterima!' };

    } catch (error) {
        console.error(`Gagal menerima pesanan ${orderId} oleh driver ${driverId}:`, error);

        // Mengembalikan error yang lebih informatif ke client
        if (error.code === 'aborted') {
             throw new functions.https.HttpsError('aborted', 'Maaf, pesanan ini sudah diambil oleh driver lain.');
        }

        throw new functions.https.HttpsError('internal', 'Terjadi kesalahan di server saat mencoba menerima pesanan.', error.message);
    }
});


/**
 * Cloud Function (Callable) untuk memproses pembayaran pesanan via diePAY.
 * Fungsi ini menjamin keamanan & integritas data dengan transaksi atomik.
 * 1. Cek saldo user.
 * 2. Kurangi saldo user.
 * 3. Tambah saldo driver (setelah dipotong komisi).
 * 4. Catat riwayat transaksi.
 */
exports.processDiePayPayment = functions.https.onCall(async (data, context) => {
    // 1. Validasi Otentikasi: Pastikan user yang memanggil fungsi sudah login.
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Akses ditolak. Silakan login untuk melanjutkan pembayaran.');
    }

    const userId = context.auth.uid;
    const { orderId, amount, driverId } = data;

    // 2. Validasi Argumen: Pastikan semua data yang dibutuhkan tersedia.
    if (!orderId || !amount || !driverId) {
        throw new functions.https.HttpsError('invalid-argument', 'Data permintaan (orderId, amount, driverId) tidak lengkap.');
    }
    if (typeof amount !== 'number' || amount <= 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Jumlah pembayaran (amount) tidak valid.');
    }

    // --- Konfigurasi Bisnis ---
    const ADMIN_COMMISSION_RATE = 0.10; // Komisi admin 10%

    // --- Referensi Dokumen Firestore ---
    const userRef = db.collection('users').doc(userId);
    const driverRef = db.collection('users').doc(driverId);
    const transactionRef = db.collection('transactions').doc(); // Buat ID unik untuk transaksi

    try {
        // 3. Menjalankan Transaksi Atomik
        await db.runTransaction(async (t) => {
            const userDoc = await t.get(userRef);
            const driverDoc = await t.get(driverRef);

            // 3a. Validasi Dokumen & Saldo User
            if (!userDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Data pengguna tidak ditemukan.');
            }
            if (!driverDoc.exists) {
                throw new functions.https.HttpsError('not-found', 'Data driver tidak ditemukan.');
            }

            const userBalance = userDoc.data().balance || 0;
            if (userBalance < amount) {
                throw new functions.https.HttpsError('failed-precondition', 'Saldo diePAY Anda tidak mencukupi.');
            }

            // 3b. Perhitungan Komisi & Pendapatan
            const adminCommission = Math.floor(amount * ADMIN_COMMISSION_RATE);
            const driverPayout = amount - adminCommission;
            const driverCurrentBalance = driverDoc.data().balance || 0;

            // 3c. Eksekusi Update Saldo & Pencatatan Transaksi
            t.update(userRef, { balance: userBalance - amount });
            t.update(driverRef, { balance: driverCurrentBalance + driverPayout });
            t.set(transactionRef, {
                userId,
                driverId,
                orderId,
                amount,
                driverPayout,
                adminCommission,
                status: 'COMPLETED',
                createdAt: admin.firestore.FieldValue.serverTimestamp() // Timestamp server
            });
        });

        console.log(`Transaksi ${transactionRef.id} untuk order ${orderId} berhasil diproses.`);
        return { success: true, message: 'Pembayaran berhasil diproses.', transactionId: transactionRef.id };

    } catch (error) {
        console.error(`Gagal memproses pembayaran untuk order ${orderId}:`, error);
        
        // Mengembalikan error yang sesuai ke client
        if (error.code) {
            throw error;
        }
        
        throw new functions.https.HttpsError('internal', 'Terjadi kesalahan tak terduga saat memproses pembayaran.', error.message);
    }
});
