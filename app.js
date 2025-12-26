
// Import Firebase services
import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const App = {
    /**
     * Initializes the application.
     */
    init() {
        this.authListener();
    },

    /**
     * Listens for authentication state changes.
     */
    authListener() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Sultan authenticated:", user.uid);
                const userData = await this.fetchUserData(user.uid);
                this.renderUI(userData);
            } else {
                console.log("No Sultan signed in, redirecting to login.");
                window.location.replace('login.html');
            }
        });
    },

    /**
     * Fetches user data from Firestore.
     * @param {string} uid - The user's unique ID.
     */
    async fetchUserData(uid) {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    },

    /**
     * Renders all UI components with user data.
     * @param {object} userData - The user's data from Firestore.
     */
    renderUI(userData) {
        if (!userData) return;
        this.renderDashboard(userData);
        this.renderProfile(userData);
        this.renderBottomNav();
    },

    /**
     * Renders the main dashboard (Home page).
     * @param {object} userData - The user's data.
     */
    renderDashboard(userData) {
        document.getElementById('user-name').innerText = userData.fullName || 'Sultan';
        const formattedBalance = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(userData.balance || 0);
        document.getElementById('user-balance').innerText = formattedBalance;
        this.renderServices();
    },

    /**
     * Renders the Profile page.
     * @param {object} userData - The user's data.
     */
    renderProfile(userData) {
        document.getElementById('profile-name').innerText = userData.fullName || 'Sultan';
        document.getElementById('profile-email').innerText = userData.email || 'sultan@cendikiawanstudios.com';
        // You can add more fields here like employee ID if they exist in Firestore
    },

    /**
     * Renders the service grid on the Home page.
     */
    renderServices() {
        const services = [
            { name: 'Motor', icon: 'fa-motorcycle', color: 'text-orange-500' },
            { name: 'Mobil', icon: 'fa-car', color: 'text-blue-500' },
            { name: 'Makanan', icon: 'fa-utensils', color: 'text-red-500' },
            { name: 'Paket', icon: 'fa-box-open', color: 'text-green-500' },
        ];
        document.getElementById('services-grid').innerHTML = services.map(s => `
            <div class="flex flex-col items-center space-y-2">
                <div class="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-md">
                    <i class="fas ${s.icon} ${s.color} text-2xl"></i>
                </div>
                <p class="text-xs font-bold text-zinc-700">${s.name}</p>
            </div>`).join('');
    },

    /**
     * Renders and sets up the bottom navigation bar.
     */
    renderBottomNav() {
        const navItems = [
            { id: 'home', name: 'Beranda', icon: 'fa-home' },
            { id: 'history', name: 'Riwayat', icon: 'fa-history' },
            { id: 'profile', name: 'Profil', icon: 'fa-user' },
        ];
        const nav = document.getElementById('bottom-nav');
        nav.innerHTML = navItems.map(item => `
            <a href="#" id="nav-${item.id}" class="flex flex-col items-center space-y-1 text-zinc-400">
                <i class="fas ${item.icon} text-xl"></i>
                <p class="text-[10px] font-bold">${item.name}</p>
            </a>`).join('');

        // Set initial active nav item and add event listeners
        navItems.forEach(item => {
            document.getElementById(`nav-${item.id}`).addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.id, navItems);
            });
        });
        // Activate the home page by default
        this.navigateTo('home', navItems);
    },

    /**
     * Navigates to a specific page.
     * @param {string} pageId - The ID of the page to show.
     * @param {Array} navItems - The array of navigation items.
     */
    navigateTo(pageId, navItems) {
        // Switch active page
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${pageId}`).classList.add('active');

        // Switch active nav link style
        navItems.forEach(item => {
            const link = document.getElementById(`nav-${item.id}`);
            link.classList.toggle('text-orange-500', item.id === pageId);
            link.classList.toggle('text-zinc-400', item.id !== pageId);
        });
    },

    /**
     * Logs the user out.
     */
    async logout() {
        try {
            await signOut(auth);
            // The auth listener will automatically redirect to login.
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Gagal keluar, Sultan.");
        }
    }
};

// Make App object globally accessible for inline event handlers (like logout button)
window.App = App;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => App.init());
