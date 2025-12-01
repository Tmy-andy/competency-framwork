// auth.js - Authentication & Authorization

(function() {
    'use strict';

    // Check authentication on page load
    function checkAuth() {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
            // Not logged in, redirect to login
            if (window.location.pathname.indexOf('login.html') === -1) {
                window.location.href = 'login.html';
            }
            return null;
        }

        return currentUser;
    }

    // Get current logged in user
    function getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) return null;
        
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }

    // Logout function
    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    // Setup logout button
    function setupLogoutButton() {
        // Use event delegation on document since sidebar loads dynamically
        document.addEventListener('click', (e) => {
            const logoutBtn = e.target.closest('#logoutBtn');
            if (logoutBtn) {
                e.preventDefault();
                if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                    logout();
                }
            }
        });
    }

    // Update user info in sidebar
    function updateUserInfo(user) {
        // Wait for sidebar to load
        const checkAndUpdate = () => {
            const userName = document.getElementById('userName');
            const userRole = document.getElementById('userRole');
            
            if (userName && userRole) {
                userName.textContent = user.name || user.username;
                const roleText = user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên';
                userRole.textContent = roleText;
                console.log('✅ User info updated:', user.name, '-', roleText);
            } else {
                // Retry after sidebar loads
                setTimeout(checkAndUpdate, 100);
            }
        };
        
        checkAndUpdate();
    }

    // Apply role-based access control
    function applyRoleBasedAccess(user) {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (user.role === 'user') {
            // User role: Only access to own profile
            hideAdminMenuItems();
            
            // If not on allowed pages, redirect to own profile
            const allowedPages = ['nhan-vien-infor.html', 'login.html'];
            const isAllowed = allowedPages.some(page => currentPage.includes(page));
            
            if (!isAllowed && currentPage !== '') {
                // Redirect to own profile
                window.location.href = `nhan-vien-infor.html?id=${user.employeeId || user.username}`;
            }
        }
    }

    // Hide admin menu items for regular users
    function hideAdminMenuItems() {
        // Wait for sidebar to load
        const checkAndHide = () => {
            const menuSection = document.querySelector('aside .flex-1');
            
            if (menuSection) {
                // Sidebar loaded, now hide admin items
                menuSection.innerHTML = `
                    <div class="flex flex-col">
                        <p class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Menu</p>
                        <nav class="flex flex-col gap-1">
                            <a class="flex items-center gap-3 rounded-lg px-3 py-2 bg-primary/10 text-primary nav-link" 
                                href="nhan-vien-infor.html?id=${getCurrentUser().employeeId || getCurrentUser().username}">
                                <span class="material-symbols-outlined">person</span>
                                <span class="text-sm font-medium">Hồ Sơ Năng Lực Của Tôi</span>
                            </a>
                        </nav>
                    </div>
                `;
                console.log('✅ User menu updated - showing only profile access');
            } else {
                // Retry after sidebar loads
                setTimeout(checkAndHide, 100);
            }
        };
        
        checkAndHide();
    }

    // Initialize authentication
    function init() {
        const user = checkAuth();
        if (!user) return;

        setupLogoutButton();
        updateUserInfo(user);
        applyRoleBasedAccess(user);
    }

    // Export functions to global scope
    window.auth = {
        checkAuth,
        getCurrentUser,
        logout,
        init
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
