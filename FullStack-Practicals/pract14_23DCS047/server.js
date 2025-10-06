const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const app = express();
const PORT = 3000;

// Middleware configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// File upload configuration with Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp and random number
        const uniqueName = `resume_${Date.now()}_${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter function to validate PDF files
const fileFilter = (req, file, cb) => {
    // Check if file is PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for resume uploads! 📄'), false);
    }
};

// Configure multer with file size limit and validation
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
        files: 1 // Only one file at a time
    },
    fileFilter: fileFilter
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to get uploaded files list
async function getUploadedFiles() {
    try {
        const files = await fs.readdir(uploadsDir);
        const fileDetails = [];
        
        for (const file of files) {
            if (file.endsWith('.pdf')) {
                const filePath = path.join(uploadsDir, file);
                const stats = await fs.stat(filePath);
                fileDetails.push({
                    name: file,
                    originalName: file.replace(/^resume_\d+_\d+/, ''),
                    size: formatFileSize(stats.size),
                    uploadDate: stats.birthtime.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                });
            }
        }
        
        return fileDetails.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    } catch (error) {
        console.error('Error reading uploaded files:', error);
        return [];
    }
}

// Route to display the job portal homepage
app.get('/', async (req, res) => {
    try {
        const uploadedFiles = await getUploadedFiles();
        res.render('job-portal', {
            pageTitle: 'Job Portal - Resume Upload',
            message: null,
            messageType: null,
            uploadedFiles: uploadedFiles,
            totalUploads: uploadedFiles.length
        });
    } catch (error) {
        console.error('Error loading homepage:', error);
        res.render('job-portal', {
            pageTitle: 'Job Portal - Resume Upload',
            message: 'Error loading uploaded files',
            messageType: 'error',
            uploadedFiles: [],
            totalUploads: 0
        });
    }
});

// Route to handle file upload
app.post('/upload', (req, res) => {
    const uploadSingle = upload.single('resume');
    
    uploadSingle(req, res, async function (err) {
        let message = '';
        let messageType = '';
        
        try {
            if (err instanceof multer.MulterError) {
                // Handle Multer-specific errors
                if (err.code === 'LIMIT_FILE_SIZE') {
                    message = 'File size too large! Please upload a PDF file smaller than 2MB. 📦';
                    messageType = 'error';
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    message = 'Unexpected file upload error. Please try again. ⚠️';
                    messageType = 'error';
                } else {
                    message = `Upload error: ${err.message} 🚫`;
                    messageType = 'error';
                }
            } else if (err) {
                // Handle custom validation errors
                message = err.message;
                messageType = 'error';
            } else if (!req.file) {
                // No file uploaded
                message = 'Please select a PDF file to upload! 📁';
                messageType = 'error';
            } else {
                // Successful upload
                const fileSize = formatFileSize(req.file.size);
                message = `✅ Resume uploaded successfully! "${req.file.originalname}" (${fileSize}) is now available for employers to view.`;
                messageType = 'success';
                
                // Log successful upload
                console.log(`✅ File uploaded: ${req.file.originalname} (${fileSize}) -> ${req.file.filename}`);
            }
            
        } catch (error) {
            console.error('Upload processing error:', error);
            message = 'An unexpected error occurred during upload. Please try again. 💥';
            messageType = 'error';
        }
        
        // Get updated file list
        const uploadedFiles = await getUploadedFiles();
        
        res.render('job-portal', {
            pageTitle: 'Job Portal - Resume Upload',
            message: message,
            messageType: messageType,
            uploadedFiles: uploadedFiles,
            totalUploads: uploadedFiles.length
        });
    });
});

// Route to download uploaded files (for testing purposes)
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    // Security check - ensure file exists and is within uploads directory
    if (!filename.includes('..') && fs.existsSync(filePath)) {
        res.download(filePath, `resume_${filename}`, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(404).send('File not found or download error');
            }
        });
    } else {
        res.status(404).send('File not found');
    }
});

// Route to delete uploaded files (for testing/admin purposes)
app.post('/delete/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(uploadsDir, filename);
        
        // Security check
        if (!filename.includes('..') && await fs.pathExists(filePath)) {
            await fs.remove(filePath);
            console.log(`🗑️ File deleted: ${filename}`);
        }
        
        res.redirect('/');
    } catch (error) {
        console.error('Delete error:', error);
        res.redirect('/');
    }
});

// Route to clear all uploads (for testing purposes)
app.post('/clear-all', async (req, res) => {
    try {
        const files = await fs.readdir(uploadsDir);
        let deletedCount = 0;
        
        for (const file of files) {
            if (file.endsWith('.pdf')) {
                await fs.remove(path.join(uploadsDir, file));
                deletedCount++;
            }
        }
        
        console.log(`🗑️ Cleared ${deletedCount} resume files`);
        res.redirect('/');
    } catch (error) {
        console.error('Clear all error:', error);
        res.redirect('/');
    }
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).render('error', {
        pageTitle: 'Page Not Found',
        errorMessage: 'The page you requested could not be found.',
        errorCode: 404
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).render('error', {
        pageTitle: 'Server Error',
        errorMessage: 'An internal server error occurred. Please try again later.',
        errorCode: 500
    });
});

// Start the server
app.listen(PORT, () => {
    console.log('================================================');
    console.log('💼 JOB PORTAL - RESUME UPLOAD SERVER STARTED 💼');
    console.log('================================================');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log('📄 Accepts: PDF files only (max 2MB)');
    console.log('🔒 Security: File validation enabled');
    console.log('📁 Upload directory: ./uploads/');
    console.log('✨ Features: Drag & drop, file preview, validation');
    console.log('================================================');
});
