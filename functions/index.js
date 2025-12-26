
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

