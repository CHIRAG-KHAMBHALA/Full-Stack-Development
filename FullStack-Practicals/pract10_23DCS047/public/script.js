// Log Viewer JavaScript functionality

let currentFile = null;
let currentPage = 1;
let totalPages = 1;
let searchTerm = '';
let searchTimeout = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadLogFiles();
    setupSearchInput();
    setupKeyboardShortcuts();
});

// Load and display log files
async function loadLogFiles() {
    try {
        showLoadingState();
        
        const response = await fetch('/api/logs');
        const data = await response.json();
        
        if (data.success) {
            displayLogFiles(data.files);
            showMainContent();
        } else {
            throw new Error(data.message || 'Failed to load log files');
        }
    } catch (error) {
        console.error('Error loading log files:', error);
        showErrorState(error.message || 'Failed to connect to server');
    }
}

// Display log files in sidebar
function displayLogFiles(files) {
    const filesList = document.getElementById('filesList');
    const filesCount = document.getElementById('filesCount');
    
    filesCount.textContent = `${files.length} file${files.length !== 1 ? 's' : ''}`;
    
    if (files.length === 0) {
        filesList.innerHTML = `
            <div style="padding: 2rem 1.5rem; text-align: center; color: rgba(255, 255, 255, 0.6);">
                <i class="fas fa-folder-open" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                <p>No log files found</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem;">Place .txt or .log files in the logs directory</p>
            </div>
        `;
        return;
    }
    
    filesList.innerHTML = files.map(file => `
        <div class="file-item" onclick="selectFile('${file.name}')" data-filename="${file.name}">
            <div class="file-name">
                <i class="fas fa-file-alt"></i>
                <span>${file.name}</span>
            </div>
            <div class="file-meta">
                <span>${file.sizeFormatted}</span>
                <span>${formatDate(file.modified)}</span>
            </div>
            ${file.error ? `<div class="file-error">${file.error}</div>` : ''}
        </div>
    `).join('');
}

// Select and load a log file
async function selectFile(filename) {
    if (currentFile === filename) return;
    
    // Update active file in sidebar
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-filename="${filename}"]`).classList.add('active');
    
    currentFile = filename;
    currentPage = 1;
    searchTerm = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    
    await loadLogContent();
}

// Load log file content
async function loadLogContent() {
    if (!currentFile) return;
    
    try {
        const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
        const response = await fetch(`/api/logs/${currentFile}?page=${currentPage}&limit=100${searchQuery}`);
        const data = await response.json();
        
        if (data.success) {
            displayLogContent(data.file);
        } else {
            throw new Error(data.message || 'Failed to load log content');
        }
    } catch (error) {
        console.error('Error loading log content:', error);
        showLogError(error.message || 'Failed to load log content');
    }
}

// Display log content
function displayLogContent(fileData) {
    // Hide welcome screen and show log viewer
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('logViewer').style.display = 'flex';
    
    // Update file info
    document.getElementById('logFileName').innerHTML = `
        <i class="fas fa-file-alt"></i>
        ${fileData.name}
    `;
    document.getElementById('logFileSize').textContent = fileData.sizeFormatted;
    document.getElementById('logFileModified').textContent = formatDate(fileData.modified);
    document.getElementById('logFileLinesCount').textContent = `${fileData.totalLines} lines`;
    
    // Update pagination info
    currentPage = fileData.currentPage;
    totalPages = fileData.totalPages;
    updatePaginationInfo(fileData);
    
    // Display log lines
    const logContent = document.getElementById('logContent');
    if (fileData.lines.length === 0) {
        logContent.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: rgba(255, 255, 255, 0.6);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <p>${fileData.hasSearch ? 'No matching lines found' : 'File is empty'}</p>
                ${fileData.hasSearch ? `<p style="font-size: 0.9rem; margin-top: 0.5rem;">Try a different search term</p>` : ''}
            </div>
        `;
    } else {
        const startLineNumber = (fileData.currentPage - 1) * fileData.linesPerPage + 1;
        logContent.innerHTML = fileData.lines.map((line, index) => {
            const lineNumber = startLineNumber + index;
            const highlightedLine = fileData.hasSearch ? 
                highlightSearchTerm(line, fileData.searchTerm) : 
                escapeHtml(line);
            
            return `
                <div class="log-line ${fileData.hasSearch && line.toLowerCase().includes(fileData.searchTerm.toLowerCase()) ? 'highlight' : ''}">
                    <span class="log-line-number">${lineNumber}</span>${highlightedLine}
                </div>
            `;
        }).join('');
    }
    
    // Scroll to top of log content
    logContent.scrollTop = 0;
}

// Update pagination information and controls
function updatePaginationInfo(fileData) {
    const pagination = document.getElementById('pagination');
    
    if (fileData.totalPages > 1) {
        pagination.style.display = 'flex';
        
        document.getElementById('currentPage').textContent = fileData.currentPage;
        document.getElementById('totalPages').textContent = fileData.totalPages;
        document.getElementById('shownLines').textContent = fileData.lines.length;
        document.getElementById('totalLines').textContent = fileData.totalLines;
        
        // Update button states
        document.getElementById('firstPageBtn').disabled = fileData.currentPage === 1;
        document.getElementById('prevPageBtn').disabled = fileData.currentPage === 1;
        document.getElementById('nextPageBtn').disabled = fileData.currentPage === fileData.totalPages;
        document.getElementById('lastPageBtn').disabled = fileData.currentPage === fileData.totalPages;
    } else {
        pagination.style.display = 'none';
    }
}

// Setup search input with debouncing
function setupSearchInput() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const value = this.value.trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Show/hide clear button
        const clearButton = document.getElementById('clearSearch');
        clearButton.style.display = value ? 'block' : 'none';
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            if (searchTerm !== value) {
                searchTerm = value;
                currentPage = 1;
                if (currentFile) {
                    loadLogContent();
                }
            }
        }, 300);
    });
    
    // Handle Enter key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            searchTerm = this.value.trim();
            currentPage = 1;
            if (currentFile) {
                loadLogContent();
            }
        }
    });
}

// Clear search
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    searchTerm = '';
    currentPage = 1;
    if (currentFile) {
        loadLogContent();
    }
}

// Pagination functions
function goToPage(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
        currentPage = page;
        loadLogContent();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadLogContent();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        loadLogContent();
    }
}

function goToLastPage() {
    if (currentPage !== totalPages) {
        currentPage = totalPages;
        loadLogContent();
    }
}

// Download current file
function downloadCurrentFile() {
    if (!currentFile) return;
    
    const link = document.createElement('a');
    link.href = `/api/download/${currentFile}`;
    link.download = currentFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Refresh logs list
function refreshLogsList() {
    currentFile = null;
    currentPage = 1;
    searchTerm = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('welcomeScreen').style.display = 'flex';
    document.getElementById('logViewer').style.display = 'none';
    loadLogFiles();
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only handle shortcuts when not typing in search box
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case 'r':
            case 'R':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    refreshLogsList();
                }
                break;
            case 'ArrowLeft':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    previousPage();
                }
                break;
            case 'ArrowRight':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    nextPage();
                }
                break;
            case '/':
                e.preventDefault();
                document.getElementById('searchInput').focus();
                break;
            case 'Escape':
                document.getElementById('searchInput').blur();
                break;
        }
    });
}

// State management functions
function showLoadingState() {
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('mainContent').style.display = 'none';
}

function showErrorState(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';
    
    // Update server status
    updateServerStatus(false);
}

function showMainContent() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('mainContent').style.display = 'flex';
    
    // Update server status
    updateServerStatus(true);
}

function showLogError(message) {
    const logContent = document.getElementById('logContent');
    logContent.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem; color: #e74c3c;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            <h3>Error Loading Log</h3>
            <p style="margin-top: 1rem;">${message}</p>
        </div>
    `;
}

// Update server status indicator
function updateServerStatus(isOnline) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('#serverStatus span:last-child');
    
    if (isOnline) {
        statusDot.classList.remove('offline');
        statusText.textContent = 'Connected';
    } else {
        statusDot.classList.add('offline');
        statusText.textContent = 'Disconnected';
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function highlightSearchTerm(text, term) {
    if (!term) return escapeHtml(text);
    
    const escapedText = escapeHtml(text);
    const escapedTerm = escapeHtml(term);
    const regex = new RegExp(`(${escapedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    
    return escapedText.replace(regex, '<span style="background: rgba(255, 235, 59, 0.8); color: #000; padding: 0 2px; border-radius: 2px;">$1</span>');
}

// Auto-refresh functionality (optional)
let autoRefreshInterval = null;

function startAutoRefresh(intervalSeconds = 30) {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        if (currentFile) {
            loadLogContent();
        } else {
            loadLogFiles();
        }
    }, intervalSeconds * 1000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Export functions for global access
window.selectFile = selectFile;
window.goToPage = goToPage;
window.previousPage = previousPage;
window.nextPage = nextPage;
window.goToLastPage = goToLastPage;
window.downloadCurrentFile = downloadCurrentFile;
window.refreshLogsList = refreshLogsList;
window.clearSearch = clearSearch;
