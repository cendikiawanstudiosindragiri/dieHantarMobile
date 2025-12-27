
import { auth, db } from './firebase.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- DOM Elements ---
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const fullnameInput = document.getElementById('fullname');
const authBtn = document.getElementById('btn-auth');
const toggleText = document.getElementById('toggle-text');
const authTitle = document.getElementById('auth-title').querySelector('h2');
const authSubtitle = document.getElementById('auth-title').querySelector('p');

// --- AuthManager ---
const AuthManager = {
    mode: 'login', // 'login' or 'register'

    init() {
        this.addEventListeners();
        this.checkAuthState();
    },

    addEventListeners() {
        authForm.addEventListener('submit', this.handleAuth.bind(this));
        // Toggle button's onclick is in the HTML
    },

    async handleAuth(e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const fullname = fullnameInput.value.trim();

        try {
            authBtn.disabled = true;
            authBtn.textContent = 'PROSES...';

            if (this.mode === 'register') {
                if (!fullname) {
                    alert('Nama Lengkap Sultan wajib diisi!');
                    throw new Error('Fullname is required');
                }
                // Create user
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Update user's profile with display name
                await updateProfile(user, {
                    displayName: fullname
                });
                
                // Create a user document in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    displayName: fullname,
                    email: user.email,
                    createdAt: new Date(),
                    role: "Sultan" // Default role
                });

                alert('Akun Sultan berhasil dibuat! Anda akan dialihkan ke dasbor.');
                window.location.href = 'index.html';

            } else {
                // Sign in user
                await signInWithEmailAndPassword(auth, email, password);
                // Redirect is handled by checkAuthState
            }
        } catch (error) {
            console.error(`${this.mode} error:`, error);
            alert(`Error: ${error.message}`);
        } finally {
            authBtn.disabled = false;
            this.updateUI(); // Reset button text
        }
    },

    checkAuthState() {
        onAuthStateChanged(auth, user => {
            if (user && (window.location.pathname.includes('login.html') || window.location.pathname === '/')) {
                console.log('User is logged in, redirecting to dashboard.');
                window.location.href = 'index.html';
            } else if (!user && !window.location.pathname.includes('login.html')) {
                console.log('User is not logged in, redirecting to login.');
                window.location.href = 'login.html';
            }
        });
    },
    
    toggleMode() {
        this.mode = this.mode === 'login' ? 'register' : 'login';
        this.updateUI();
    },

    updateUI() {
        if (this.mode === 'register') {
            authTitle.textContent = 'Buat Akun Baru, Sultan!';
            authSubtitle.textContent = 'Daftarkan diri untuk akses eksklusif.';
            fullnameInput.classList.remove('hidden');
            authBtn.textContent = 'Daftar Sekarang';
            toggleText.innerHTML = 'Sudah punya akun? <span class="text-orange-500">Masuk Sultan</span>';
        } else {
            authTitle.textContent = 'Selamat Datang, Sultan!';
            authSubtitle.textContent = 'Masuk untuk memulai perjalanan.';
            fullnameInput.classList.add('hidden');
            authBtn.textContent = 'Masuk Sekarang';
            toggleText.innerHTML = 'Belum punya akun? <span class="text-orange-500">Daftar Sultan</span>';
        }
    }
};

// --- Initialization ---
// Make AuthManager globally accessible for the inline onclick
window.AuthManager = AuthManager; 
AuthManager.init();
