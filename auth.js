
import { 
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { auth, db } from './firebase.js';

/**
 * Checks authentication state and redirects the user based on the correct flow.
 */
export function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        const isLoginPage = window.location.pathname.includes('login.html');
        
        if (user) {
            // User is logged in.
            console.log("Authenticated user:", user.uid);

            // If the user is on the login page (which means they just logged in or registered)
            if (isLoginPage) {
                // The 'active_role' is set in auth-page.js upon registration.
                // If it exists, it means the user just registered and their role is decided.
                // Redirect them straight to the main app.
                if (localStorage.getItem('active_role')) {
                    window.location.replace('index.html');
                } else {
                // If 'active_role' is not set, it's an existing user who just logged in.
                // They need to select a role for this session.
                    window.location.replace('role-selection.html');
                }
            }
        } else {
            // User is not logged in.
            // Clear any active role from the previous session.
            localStorage.removeItem('active_role'); 
            console.log("No authenticated user.");
            
            // If the user is NOT on the login/onboarding page, redirect them there.
            if (!isLoginPage && !window.location.pathname.includes('onboarding.html')) {
                window.location.replace('login.html');
            }
        }
    });
}

/**
 * Logs in a user.
 * @param {string} email 
 * @param {string} password 
 */
export async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle the redirect to role-selection.html
    } catch (error) {
        console.error("Login Error:", error.message);
        alert(`Login failed: ${error.message}`);
    }
}

/**
 * Registers a new user with a specific role.
 * @param {string} fullName 
 * @param {string} email 
 * @param {string} password 
 * @param {string} role 'user' or 'driver'
 */
export async function register(fullName, email, password, role) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Add the full name to the user's profile
        await updateProfile(user, { displayName: fullName });

        // **THE FIX**: Save user data to Firestore, now including the 'role'.
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullName: fullName,
            email: email,
            role: role, // Using the role from the parameter
            createdAt: serverTimestamp(),
            // Set initial balance based on the selected role
            balance: role === 'driver' ? 50000 : 1000000, 
            totalTrips: 0,
            points: 0
        });

        // onAuthStateChanged will handle the redirect to index.html

    } catch (error) {
        console.error("Registration Error:", error.message);
        alert(`Registration failed: ${error.code} - ${error.message}`);
    }
}

/**
 * Logs out the current user.
 */
export async function logout() {
    try {
        await signOut(auth);
        // onAuthStateChanged will handle redirecting to the login page.
    } catch (error) {
        console.error("Logout Error:", error);
        alert("Failed to log out.");
    }
}

// Initial call to check auth state when the app loads.
checkAuthState();
