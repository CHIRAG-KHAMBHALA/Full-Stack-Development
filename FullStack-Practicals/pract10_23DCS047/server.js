const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Logs directory
const LOGS_DIR = path.join(__dirname, 'logs');

// Ensure logs directory exists
async function ensureLogsDirectory() {
    try {
        await fs.access(LOGS_DIR);
    } catch (error) {
        await fs.mkdir(LOGS_DIR, { recursive: true });
        console.log('📁 Created logs directory');
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API to list available log files
app.get('/api/logs', async (req, res) => {
    try {
        const files = await fs.readdir(LOGS_DIR);
        const logFiles = files.filter(file => file.endsWith('.txt') || file.endsWith('.log'));
        
        const filesWithStats = await Promise.all(
            logFiles.map(async (file) => {
                try {
                    const filePath = path.join(LOGS_DIR, file);
                    const stats = await fs.stat(filePath);
                    return {
                        name: file,
                        size: stats.size,
                        modified: stats.mtime,
                        sizeFormatted: formatFileSize(stats.size)
                    };
                } catch (error) {
                    return {
                        name: file,
                        size: 0,
                        modified: new Date(),
                        sizeFormatted: '0 B',
                        error: 'Cannot read file stats'
                    };
                }
            })
        );

        res.json({
            success: true,
            files: filesWithStats.sort((a, b) => b.modified - a.modified)
        });
    } catch (error) {
        console.error('Error listing log files:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list log files',
            message: error.message
        });
    }
});

// API to read a specific log file
app.get('/api/logs/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(LOGS_DIR, filename);
        
        // Security check - prevent directory traversal
        const resolvedPath = path.resolve(filePath);
        const resolvedLogsDir = path.resolve(LOGS_DIR);
        
        if (!resolvedPath.startsWith(resolvedLogsDir)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied',
                message: 'Invalid file path'
            });
        }

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch (error) {
            return res.status(404).json({
                success: false,
                error: 'File not found',
                message: `The log file '${filename}' does not exist`
            });
        }

        // Read file with pagination support
        const page = parseInt(req.query.page) || 1;
        const linesPerPage = parseInt(req.query.limit) || 100;
        const search = req.query.search || '';

        const content = await fs.readFile(filePath, 'utf8');
        let lines = content.split('\n');

        // Filter lines if search query provided
        if (search) {
            lines = lines.filter(line => 
                line.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Calculate pagination
        const totalLines = lines.length;
        const totalPages = Math.ceil(totalLines / linesPerPage);
        const startIndex = (page - 1) * linesPerPage;
        const endIndex = startIndex + linesPerPage;
        const paginatedLines = lines.slice(startIndex, endIndex);

        // Get file stats
        const stats = await fs.stat(filePath);

        res.json({
            success: true,
            file: {
                name: filename,
                size: stats.size,
                sizeFormatted: formatFileSize(stats.size),
                modified: stats.mtime,
                lines: paginatedLines,
                totalLines,
                currentPage: page,
                totalPages,
                linesPerPage,
                hasSearch: !!search,
                searchTerm: search
            }
        });

    } catch (error) {
        console.error('Error reading log file:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to read log file',
            message: error.message
        });
    }
});

// API to download a log file
app.get('/api/download/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(LOGS_DIR, filename);
        
        // Security check
        const resolvedPath = path.resolve(filePath);
        const resolvedLogsDir = path.resolve(LOGS_DIR);
        
        if (!resolvedPath.startsWith(resolvedLogsDir)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        // Check if file exists
        try {
            await fs.access(filePath);
            res.download(filePath, filename);
        } catch (error) {
            res.status(404).json({
                success: false,
                error: 'File not found'
            });
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to download file'
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Start server
async function startServer() {
    try {
        await ensureLogsDirectory();
        
        app.listen(PORT, () => {
            console.log(`🔍 Log Viewer Server is running on port ${PORT}`);
            console.log(`📱 Visit: http://localhost:${PORT}`);
            console.log(`📁 Logs directory: ${LOGS_DIR}`);
            console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
