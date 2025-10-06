// Session Management for Library Portal
class SessionManager {
    constructor() {
        this.sessionKey = 'libraryPortalSession';
        this.initializeSession();
        this.setupEventListeners();
    }

    // Initialize session on page load
    initializeSession() {
        document.addEventListener('DOMContentLoaded', () => {
            if (this.isLoggedIn()) {
                this.showLoggedInContent();
                this.updateSessionDisplay();
                this.startSessionTimer();
            } else {
                this.showLoginForm();
            }
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Login form submission
        document.addEventListener('DOMContentLoaded', () => {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleLogin();
                });
            }
        });
    }

    // Generate unique session ID
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Handle login process
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!username || !email) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        // Validate email format
        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Create session data
        const sessionData = {
            name: username,
            email: email,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId(),
            isActive: true
        };

        // Store session in localStorage
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));

        // Show success message and redirect
        this.showMessage('Login successful! Welcome to Library Portal', 'success');
        
        setTimeout(() => {
            this.showLoggedInContent();
            this.updateSessionDisplay();
            this.startSessionTimer();
        }, 1000);
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Check if user is logged in
    isLoggedIn() {
        const session = this.getSession();
        return session && session.isActive;
    }

    // Get current session data
    getSession() {
        const sessionData = localStorage.getItem(this.sessionKey);
        return sessionData ? JSON.parse(sessionData) : null;
    }

    // Show login form
    showLoginForm() {
        const loginSection = document.getElementById('loginSection');
        const mainContent = document.getElementById('mainContent');
        const navigation = document.getElementById('navigation');

        if (loginSection) loginSection.style.display = 'block';
        if (mainContent) mainContent.style.display = 'none';
        if (navigation) navigation.style.display = 'none';
    }

    // Show logged in content
    showLoggedInContent() {
        const loginSection = document.getElementById('loginSection');
        const mainContent = document.getElementById('mainContent');
        const navigation = document.getElementById('navigation');

        if (loginSection) loginSection.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        if (navigation) navigation.style.display = 'flex';
    }

    // Update session display information
    updateSessionDisplay() {
        const session = this.getSession();
        if (!session) return;

        // Update welcome name
        const welcomeName = document.getElementById('welcomeName');
        if (welcomeName) {
            welcomeName.textContent = session.name;
        }

        // Update login time
        const loginTime = document.getElementById('loginTime');
        if (loginTime) {
            const loginDate = new Date(session.loginTime);
            loginTime.textContent = this.formatDateTime(loginDate);
        }

        // Update session duration
        this.updateSessionDuration();
    }

    // Update session duration display
    updateSessionDuration() {
        const session = this.getSession();
        if (!session) return;

        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const duration = this.calculateDuration(loginTime, now);

        const sessionDuration = document.getElementById('sessionDuration');
        if (sessionDuration) {
            sessionDuration.textContent = duration;
        }

        const sessionDurationProfile = document.getElementById('sessionDurationProfile');
        if (sessionDurationProfile) {
            sessionDurationProfile.textContent = duration;
        }
    }

    // Calculate and format duration
    calculateDuration(startTime, endTime) {
        const diffMs = endTime - startTime;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        if (diffHours > 0) {
            return `${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes}m ${diffSeconds}s`;
        } else {
            return `${diffSeconds}s`;
        }
    }

    // Format date and time
    formatDateTime(date) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Start session timer to update duration
    startSessionTimer() {
        // Update duration every second
        this.sessionTimer = setInterval(() => {
            this.updateSessionDuration();
        }, 1000);
    }

    // Stop session timer
    stopSessionTimer() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
    }

    // Handle logout
    logout() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            // Clear session data
            localStorage.removeItem(this.sessionKey);
            
            // Stop timer
            this.stopSessionTimer();
            
            // Show logout message
            this.showMessage('You have been logged out successfully', 'info');
            
            // Redirect to login after delay
            setTimeout(() => {
                if (window.location.pathname.includes('profile.html')) {
                    window.location.href = 'index.html';
                } else {
                    this.showLoginForm();
                    this.clearForm();
                }
            }, 1500);
        }
    }

    // Clear login form
    clearForm() {
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        
        if (username) username.value = '';
        if (email) email.value = '';
    }

    // Refresh session (extend session time)
    refreshSession() {
        const session = this.getSession();
        if (session) {
            session.loginTime = new Date().toISOString();
            session.sessionId = this.generateSessionId();
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            
            this.updateSessionDisplay();
            this.showMessage('Session refreshed successfully', 'success');
        }
    }

    // Show message to user
    showMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas ${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getMessageColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add CSS animation
        if (!document.querySelector('#messageStyles')) {
            const style = document.createElement('style');
            style.id = 'messageStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add to document
        document.body.appendChild(messageDiv);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 4000);
    }

    // Get message icon based on type
    getMessageIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'info': 'fa-info-circle',
            'warning': 'fa-exclamation-triangle'
        };
        return icons[type] || icons['info'];
    }

    // Get message color based on type
    getMessageColor(type) {
        const colors = {
            'success': 'linear-gradient(45deg, #4caf50, #45a049)',
            'error': 'linear-gradient(45deg, #f44336, #d32f2f)',
            'info': 'linear-gradient(45deg, #2196f3, #1976d2)',
            'warning': 'linear-gradient(45deg, #ff9800, #f57c00)'
        };
        return colors[type] || colors['info'];
    }
}

// Profile page specific functions
function loadProfileData() {
    const sessionManager = new SessionManager();
    const session = sessionManager.getSession();
    
    if (!session) {
        // Show login required message
        const profileSection = document.getElementById('profileSection');
        const loginRequired = document.getElementById('loginRequired');
        const navigation = document.getElementById('navigation');
        
        if (profileSection) profileSection.style.display = 'none';
        if (loginRequired) loginRequired.style.display = 'flex';
        if (navigation) navigation.style.display = 'none';
        return;
    }

    // Update profile header
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    
    if (profileName) profileName.textContent = session.name;
    if (profileEmail) profileEmail.textContent = session.email;

    // Update session details
    const sessionName = document.getElementById('sessionName');
    const sessionEmail = document.getElementById('sessionEmail');
    const sessionLoginTime = document.getElementById('sessionLoginTime');
    const sessionId = document.getElementById('sessionId');
    
    if (sessionName) sessionName.textContent = session.name;
    if (sessionEmail) sessionEmail.textContent = session.email;
    if (sessionLoginTime) {
        const loginDate = new Date(session.loginTime);
        sessionLoginTime.textContent = sessionManager.formatDateTime(loginDate);
    }
    if (sessionId) sessionId.textContent = session.sessionId;

    // Start updating duration
    sessionManager.updateSessionDisplay();
    sessionManager.startSessionTimer();
}

// Global functions accessible from HTML
function logout() {
    window.sessionManager.logout();
}

function refreshSession() {
    window.sessionManager.refreshSession();
}

// Initialize session manager globally
window.sessionManager = new SessionManager();

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SessionManager;
}
