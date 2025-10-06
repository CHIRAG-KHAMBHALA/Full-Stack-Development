// Check server status
async function checkStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        // Create a modal-like alert
        showModal('Server Status', `
            <div style="text-align: left;">
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Version:</strong> ${data.version}</p>
                <p><strong>Timestamp:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
                <p><strong>Uptime:</strong> Server is running smoothly!</p>
            </div>
        `);
    } catch (error) {
        showModal('Error', 'Failed to fetch server status. Please try again later.');
    }
}

// Show info modal
function showInfo() {
    showModal('About Our Site', `
        <div style="text-align: left;">
            <p><strong>Technology Stack:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Backend: Express.js (Node.js)</li>
                <li>Frontend: HTML5, CSS3, JavaScript</li>
                <li>Design: Modern glassmorphism UI</li>
            </ul>
            <p><strong>Features:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Responsive design for all devices</li>
                <li>RESTful API endpoints</li>
                <li>Scalable architecture</li>
                <li>Modern UI/UX design</li>
            </ul>
            <p>This is a proof of concept for a product site backend built with Express.js.</p>
        </div>
    `);
}

// Generic modal function
function showModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
        }
        
        .modal-overlay {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 500px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header h3 {
            color: white;
            margin: 0;
            font-size: 1.5rem;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .modal-body {
            padding: 20px;
            color: white;
            line-height: 1.6;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: right;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Close modal function
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Update server info periodically
    updateServerInfo();
    setInterval(updateServerInfo, 30000); // Update every 30 seconds
});

// Update server status indicator
async function updateServerInfo() {
    try {
        const response = await fetch('/api/status');
        if (response.ok) {
            const serverInfo = document.getElementById('serverInfo');
            const statusDot = serverInfo.querySelector('.status-dot');
            statusDot.style.background = '#4caf50';
            serverInfo.querySelector('span:last-child').textContent = 'Server Online';
        }
    } catch (error) {
        const serverInfo = document.getElementById('serverInfo');
        const statusDot = serverInfo.querySelector('.status-dot');
        statusDot.style.background = '#ff6b6b';
        serverInfo.querySelector('span:last-child').textContent = 'Server Offline';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
