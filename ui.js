
// This is the new UI Engine for our redesigned app.

/**
 * Initializes the UI components and event listeners.
 */
export function initializeUI() {
    setupEventListeners();
    switchPage('home'); // Set initial page
}

/**
 * Sets up event listeners for navigation and other interactive elements.
 */
function setupEventListeners() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // The page to switch to is derived from the button's ID (e.g., 'nav-home' -> 'home')
            const pageId = event.currentTarget.id.replace('nav-', '');
            switchPage(pageId);
        });
    });
}

/**
 * Switches the visible page in the main content area.
 * @param {string} pageId The ID of the page to display (e.g., 'home', 'history').
 */
export function switchPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the requested page
    const newPage = document.getElementById(`page-${pageId}`);
    if (newPage) {
        newPage.classList.add('active');
    } else {
        console.error(`Page with ID 'page-${pageId}' not found.`);
        return; // Exit if page not found
    }

    // Update the active state of the navigation bar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.id === `nav-${pageId}`) {
            item.classList.add('active');
        }
    });
}

/**
 * Updates the user's display name and avatar in the header.
 * @param {object} user - The user object from Firebase Auth.
 */
export function updateHeader(user) {
    const displayNameEl = document.getElementById('user-display-name');
    const avatarEl = document.getElementById('user-avatar');
    if (user) {
        displayNameEl.textContent = user.displayName || 'Sultan';
        avatarEl.src = user.photoURL || `https://i.pravatar.cc/100?u=${user.uid}`;
    }
}

/**
 * Updates the balance display for the user.
 * @param {number} balance - The user's current balance.
 */
export function updateBalance(balance) {
    const balanceEl = document.getElementById('balance');
    const formattedBalance = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(balance);
    balanceEl.textContent = formattedBalance;
}

/**
 * Configures the UI for a specific role (user or driver).
 * @param {string} role - The active role ('user' or 'driver').
 */
export function setUIMode(role) {
    const header = document.getElementById('app-header');
    const userWallet = document.getElementById('wallet-card-user');
    const driverStatus = document.getElementById('status-card-driver');
    const userServices = document.getElementById('services-grid-user');
    const driverOrders = document.getElementById('order-list-driver');
    const navItems = document.querySelectorAll('.nav-item');

    if (role === 'driver') {
        header.classList.add('driver-mode');
        navItems.forEach(item => item.classList.add('driver-mode'));
        userWallet.style.display = 'none';
        driverStatus.style.display = 'block';
        userServices.style.display = 'none';
        driverOrders.style.display = 'block';
    } else {
        header.classList.remove('driver-mode');
        navItems.forEach(item => item.classList.remove('driver-mode'));
        userWallet.style.display = 'block';
        driverStatus.style.display = 'none';
        userServices.style.display = 'block';
        driverOrders.style.display = 'none';
    }
}
