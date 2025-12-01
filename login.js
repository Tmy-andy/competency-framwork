// login.js - Simple Login Functionality

(function() {
    'use strict';

    // Demo accounts
    const accounts = [
        { 
            username: 'admin', 
            password: '123456', 
            role: 'admin', 
            name: 'Quản trị viên',
            employeeId: null
        },
        { 
            username: 'user1', 
            password: '123456', 
            role: 'user', 
            name: 'Nguyễn Văn A',
            employeeId: 'NV001'
        },
        { 
            username: 'user2', 
            password: '123456', 
            role: 'user', 
            name: 'Trần Thị B',
            employeeId: 'NV002'
        }
    ];

    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');

    // Initialize
    function init() {
        setupEventListeners();
        checkRememberedUser();
    }

    // Setup Event Listeners
    function setupEventListeners() {
        loginForm.addEventListener('submit', handleLogin);
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
        
        // Hide error on input
        usernameInput.addEventListener('input', hideError);
        passwordInput.addEventListener('input', hideError);
    }

    // Check if user is remembered
    function checkRememberedUser() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            usernameInput.value = rememberedUser;
            rememberCheckbox.checked = true;
        }
    }

    // Handle Login
    function handleLogin(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;

        // Validate inputs
        if (!username || !password) {
            showError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        // Check credentials
        const user = accounts.find(acc => 
            acc.username === username && acc.password === password
        );

        if (user) {
            // Successful login
            handleSuccessfulLogin(user, remember);
        } else {
            showError('Tên đăng nhập hoặc mật khẩu không đúng');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    // Handle Successful Login
    function handleSuccessfulLogin(user, remember) {
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            role: user.role,
            name: user.name,
            employeeId: user.employeeId,
            loginTime: new Date().toISOString()
        }));

        // Remember user if checked
        if (remember) {
            localStorage.setItem('rememberedUser', user.username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        // Show success message
        showSuccess('Đăng nhập thành công! Đang chuyển hướng...');

        // Redirect based on role
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'index.html';
            } else {
                // User role: redirect to own profile
                window.location.href = `nhan-vien-infor.html?id=${user.employeeId || user.username}`;
            }
        }, 1000);
    }

    // Show Error Message
    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden', 'bg-green-50', 'border-green-200', 'text-green-700');
        errorMessage.classList.add('bg-red-50', 'border-red-200', 'text-red-700');
        
        // Shake animation
        errorMessage.classList.add('animate-shake');
        setTimeout(() => errorMessage.classList.remove('animate-shake'), 500);
    }

    // Show Success Message
    function showSuccess(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden', 'bg-red-50', 'border-red-200', 'text-red-700');
        errorMessage.classList.add('bg-green-50', 'border-green-200', 'text-green-700');
        
        // Change icon
        const icon = errorMessage.querySelector('i');
        icon.className = 'fas fa-check-circle mr-2';
    }

    // Hide Error Message
    function hideError() {
        errorMessage.classList.add('hidden');
    }

    // Toggle Password Visibility
    function togglePasswordVisibility() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // Toggle eye icon
        if (type === 'text') {
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    }

    // Check if user is already logged in
    function checkExistingLogin() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // Already logged in, redirect to dashboard
            window.location.href = 'index.html';
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            checkExistingLogin();
            init();
        });
    } else {
        checkExistingLogin();
        init();
    }

    // Console info for demo
    console.log('🔐 Demo Login Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    accounts.forEach(acc => {
        console.log(`👤 ${acc.role.toUpperCase()}`);
        console.log(`   Username: ${acc.username}`);
        console.log(`   Password: ${acc.password}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

})();
