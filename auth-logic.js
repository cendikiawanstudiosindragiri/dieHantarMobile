
// Import Firebase services from our config file
import { auth, db } from './firebase.js';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


const AuthManager = {
    isLoginMode: true,

    /**
     * Toggles between Login and Registration mode.
     */
    toggleMode() {
        this.isLoginMode = !this.isLoginMode;
        const titleElement = document.getElementById('auth-title');
        const buttonElement = document.getElementById('btn-auth');
        const toggleTextElement = document.getElementById('toggle-text');
        const fullnameField = document.getElementById('fullname');

        if (this.isLoginMode) {
            titleElement.innerHTML = `<h2 class="font-montserrat text-xl font-extrabold italic text-white">Selamat Datang, Sultan!</h2><p class="text-[9px] text-zinc-400 uppercase font-bold mt-1">Masuk untuk memulai perjalanan.</p>`;
            buttonElement.innerText = 'Masuk Sekarang';
            toggleTextElement.innerHTML = 'Belum punya akun? <span class="text-orange-500">Daftar Sultan</span>';
            fullnameField.classList.add('hidden');
        } else {
            titleElement.innerHTML = `<h2 class="font-montserrat text-xl font-extrabold italic text-white">Daftar Akun Sultan</h2><p class="text-[9px] text-zinc-400 uppercase font-bold mt-1">Bergabung dengan ekosistem dieHantar.</p>`;
            buttonElement.innerText = 'Buat Akun Sekarang';
            toggleTextElement.innerHTML = 'Sudah punya akun? <span class="text-orange-500">Login Sultan</span>';
            fullnameField.classList.remove('hidden');
            fullnameField.required = true;
        }
    },

    /**
     * Handles the authentication process (login or registration).
     */
    async handleAuth(event) {
        event.preventDefault(); // Prevent form from reloading the page
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password || (!this.isLoginMode && !fullname)) {
            alert('Harap isi semua kolom yang diperlukan, Sultan.');
            return;
        }

        try {
            if (this.isLoginMode) {
                // Process Login
                await signInWithEmailAndPassword(auth, email, password);
                alert("Berhasil Masuk, Sultan Rama!");
                window.location.href = 'index.html'; // Redirect to the main app
            } else {
                // Process Registration
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Automatically create a user profile in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: email,
                    fullName: fullname,
                    role: "user", // Default role for new sign-ups
                    createdAt: serverTimestamp(),
                    balance: 1000000, // Default balance for new users
                    studio: "Cendikiawan Studios",
                    location: "Indragiri Hilir"
                });

                alert("Akun Sultan Berhasil Dibuat!");
                window.location.href = 'index.html'; // Redirect to the main app
            }
        } catch (error) {
            console.error("Authentication Error:", error);
            alert("Error Sultan: " + error.message);
        }
    }
};

// Attach event listener to the form
document.getElementById('auth-form').addEventListener('submit', (event) => AuthManager.handleAuth(event));
