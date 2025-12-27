import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

// ===================================================================================
// DEVELOPMENT PREVIEW MODE
// NOTE: Menggunakan data simulasi untuk pratinjau. Logika Firebase asli ada di bawah.
// ===================================================================================

// --- Konfigurasi Google Maps & Variabel Global ---
let map;
let driverMarker;
const TembilahanCenter = { lat: -0.3333, lng: 103.15 }; // Pusat Indragiri Hilir

// UI Elements
const driverNameEl = document.getElementById('driver-name');
const driverVehicleEl = document.getElementById('driver-vehicle');
const driverRatingEl = document.getElementById('driver-rating');
const driverPhotoEl = document.getElementById('driver-photo');

// Custom SVG icon untuk motor "Sultan Edition"
const motorcycleIcon = {
    path: 'M256 32c-20.8 0-38.9 11.4-48.2 28.5-40.4 7.2-74.8 28.1-100.9 59.3-33.4 40-54.8 91.2-54.8 146.2 0 106 86 192 192 192s192-86 192-192c0-55-21.4-106.2-54.8-146.2-26.1-31.2-60.5-52.1-100.9-59.3C294.9 43.4 276.8 32 256 32zm-80.1 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm160.2 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z',
    fillColor: '#f97316', // Orange-500
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 0.08,
    anchor: new google.maps.Point(256, 256),
};

/**
 * Inisialisasi Peta Google
 */
function initMap() {
    const mapStyles = [
        { elementType: "geometry", stylers: [{ color: "#18181b" }] }, // Zinc-950
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        { featureType: "poi.parks", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    ];

    map = new google.maps.Map(document.getElementById("map"), {
        center: TembilahanCenter,
        zoom: 16,
        disableDefaultUI: true,
        styles: mapStyles,
    });
}

/**
 * Mengupdate Info Driver di UI Card
 * @param {object} driverInfo - Objek berisi data driver
 */
function updateDriverInfoUI(driverInfo) {
    driverNameEl.textContent = driverInfo.name;
    driverVehicleEl.textContent = `${driverInfo.vehicle.plate} | ${driverInfo.vehicle.type}`;
    driverRatingEl.innerHTML = `<i class="fas fa-star text-orange-400"></i> ${driverInfo.rating.toFixed(1)}`;
    driverPhotoEl.src = driverInfo.photoUrl;
}

/**
 * Menganimasikan pergerakan marker dengan mulus
 * @param {google.maps.Marker} marker - Marker yang akan digerakkan
 * @param {object} newPosition - Posisi tujuan (lat, lng)
 * @param {number} duration - Durasi animasi dalam milidetik
 */
function smoothMove(marker, newPosition, duration) {
    const startPosition = marker.getPosition();
    let startTime = performance.now();

    function animate() {
        let elapsed = performance.now() - startTime;
        let fraction = elapsed / duration;
        if (fraction > 1) fraction = 1;

        const lat = startPosition.lat() + (newPosition.lat - startPosition.lat()) * fraction;
        const lng = startPosition.lng() + (newPosition.lng - startPosition.lng()) * fraction;
        marker.setPosition({ lat, lng });

        // Menghitung rotasi/bearing agar motor menghadap arah tujuan
        const heading = google.maps.geometry.spherical.computeHeading(startPosition, newPosition);
        marker.setIcon({...motorcycleIcon, rotation: heading });

        if (fraction < 1) {
            requestAnimationFrame(animate);
        } else {
             marker.setPosition(newPosition);
        }
    }
    requestAnimationFrame(animate);
}


/**
 * Memulai Simulasi Pelacakan Driver
 */
function startSimulation() {
    const mockDriverData = {
        name: "Sultan Driver",
        vehicle: { plate: "BM 1234 SS", type: "NMAX Sultan Edition" },
        rating: 4.9,
        photoUrl: "https://i.pravatar.cc/150?u=driverSultan"
    };
    updateDriverInfoUI(mockDriverData);

    // Buat marker jika belum ada
    if (!driverMarker) {
        driverMarker = new google.maps.Marker({
            position: TembilahanCenter,
            map: map,
            icon: motorcycleIcon
        });
    }

    // Simulasikan pergerakan setiap 3 detik
    let step = 0;
    setInterval(() => {
        step++;
        const newLat = TembilahanCenter.lat + (Math.sin(step * 0.1) * 0.005);
        const newLng = TembilahanCenter.lng + (Math.cos(step * 0.1) * 0.005);
        const newPosition = { lat: newLat, lng: newLng };
        
        smoothMove(driverMarker, newPosition, 3000);
        map.panTo(newPosition);

    }, 3000);

     console.log("Simulasi pelacakan driver dimulai.");
}

// --- Inisialisasi --- 
// Fungsi initMap dipanggil setelah script Google Maps selesai dimuat.
window.initMap = initMap;

// Tunggu map terinisialisasi, lalu mulai simulasi
setTimeout(() => {
    if(typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
        initMap();
        startSimulation();
    } else {
        // Jika script Gmaps belum siap, coba lagi
        setTimeout(() => { 
            initMap(); 
            startSimulation();
        }, 1000);
    }
}, 500)


// ===========================================================================
// LOGIKA FIREBASE ASLI (Untuk Produksi)
// ===========================================================================
/*
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function startRealtimeTracking(tripId) {
    const tripRef = doc(db, 'active_trips', tripId);

    onSnapshot(tripRef, (docSnap) => {
        if (docSnap.exists()) {
            const tripData = docSnap.data();
            
            // 1. Update UI Driver Info
            if(tripData.driver_info) {
                updateDriverInfoUI(tripData.driver_info);
            }

            // 2. Animasikan Marker
            const newPosition = {
                lat: tripData.driver_location.latitude,
                lng: tripData.driver_location.longitude
            };

            if (!driverMarker) {
                driverMarker = new google.maps.Marker({
                    position: newPosition,
                    map: map,
                    icon: motorcycleIcon
                });
            } else {
                smoothMove(driverMarker, newPosition, 2000);
            }
            map.panTo(newPosition);
        } else {
            console.error("Perjalanan tidak ditemukan atau sudah selesai.");
            // Di sini bisa ditambahkan logika untuk menghentikan pelacakan dan menampilkan pesan.
        }
    });
}

// Untuk menggunakan, panggil initMap() lalu startRealtimeTracking('ID_PERJALANAN_DARI_FIRESTORE');
*/