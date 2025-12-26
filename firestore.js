
import { db } from './firebase.js';
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

/**
 * Mendengarkan perubahan real-time pada koleksi pesanan (orders) di Firestore.
 * @param {function} callback - Fungsi yang akan dipanggil setiap kali ada pembaruan.
 *                            Akan menerima array pesanan sebagai argumen.
 */
export function listenToOrders(callback) {
  // Membuat query untuk mendapatkan pesanan yang masih PENDING
  const q = query(collection(db, "orders"), where("status", "==", "PENDING"));

  // onSnapshot akan berjalan setiap kali ada perubahan pada hasil query
  onSnapshot(q, (querySnapshot) => {
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    // Memanggil fungsi callback dengan data pesanan yang baru
    callback(orders);
  });
}

/**
 * Mengupdate lokasi driver di Firestore.
 * @param {string} driverId - ID dokumen driver.
 * @param {object} location - Objek dengan properti lat dan lng.
 */
export function updateDriverLocation(driverId, location) {
  const driverRef = doc(db, "drivers", driverId);
  updateDoc(driverRef, {
    location: new GeoPoint(location.lat, location.lng)
  });
}
