
import { login, register } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const formLoginElement = document.getElementById('form-login-element');
    const formRegisterElement = document.getElementById('form-register-element');

    // Switcher Tab
    tabLogin.addEventListener('click', () => {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabLogin.classList.add('bg-orange-500');
        tabLogin.classList.remove('text-zinc-400');
        tabRegister.classList.remove('bg-orange-500');
        tabRegister.classList.add('text-zinc-400');
    });

    tabRegister.addEventListener('click', () => {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        tabRegister.classList.add('bg-orange-500');
        tabRegister.classList.remove('text-zinc-400');
        tabLogin.classList.remove('bg-orange-500');
        tabLogin.classList.add('text-zinc-400');
    });

    // **LOGIKA BARU: Pilihan Peran di Form Registrasi**
    const roleBtnUser = document.getElementById('role-btn-user');
    const roleBtnDriver = document.getElementById('role-btn-driver');
    const registerRoleInput = document.getElementById('register-role');

    roleBtnUser.addEventListener('click', () => {
        registerRoleInput.value = 'user';
        roleBtnUser.classList.add('bg-orange-500', 'text-white');
        roleBtnUser.classList.remove('text-zinc-400');
        roleBtnDriver.classList.remove('bg-orange-500', 'text-white');
        roleBtnDriver.classList.add('text-zinc-400');
    });

    roleBtnDriver.addEventListener('click', () => {
        registerRoleInput.value = 'driver';
        roleBtnDriver.classList.add('bg-orange-500', 'text-white');
        roleBtnDriver.classList.remove('text-zinc-400');
        roleBtnUser.classList.remove('bg-orange-500', 'text-white');
        roleBtnUser.classList.add('text-zinc-400');
    });
    // **AKHIR LOGIKA BARU**

    // Handler untuk form login
    formLoginElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        await login(email, password);
        // Redirect ditangani oleh onAuthStateChanged di auth.js
    });

    // Handler untuk form registrasi
    formRegisterElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = e.target.fullname.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const role = e.target.role.value; // Mengambil nilai peran dari input tersembunyi
        
        // Panggil fungsi register dengan parameter role yang baru
        await register(fullName, email, password, role);
        
        // Set active_role di localStorage agar langsung dibawa ke dashboard yang benar
        localStorage.setItem('active_role', role);
        
        // Redirect akan ditangani oleh onAuthStateChanged di auth.js
    });
});
