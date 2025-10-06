# Log Viewer - Developer Tools

**Project:** pract10_23DCS122  
**Student ID:** 23DCS122

## Overview

A professional log viewing tool built with Express.js that allows developers to view server error logs via a web browser. This application provides a user-friendly interface to read text files from the server without requiring direct server access, making debugging and monitoring much easier.

## Features

- 🔍 **File Browser**: Interactive sidebar showing all available log files
- 📄 **Real-time Viewing**: Live log content display with pagination
- 🔎 **Search Functionality**: Search within log files with highlighting
- 📥 **Download Support**: Download log files directly from the browser
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Optimized for large log files with pagination
- 🛡️ **Security**: Path traversal protection and file access controls
- 🎨 **Modern UI**: Professional developer-focused interface

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **File System**: Node.js fs module for file operations
- **Design**: Modern dark theme with glassmorphism effects
- **Icons**: Font Awesome 6.0

## Project Structure

```
pract10_23DCS122/
├── server.js          # Main Express server with file handling
├── package.json       # Dependencies and scripts
├── public/            # Frontend files
│   ├── index.html     # Main log viewer interface
│   ├── 404.html       # Error page
│   ├── styles.css     # Professional UI styling
│   └── script.js      # Client-side functionality
├── logs/              # Log files directory
│   ├── application.log# Sample application log
│   ├── error.log      # Sample error log
│   └── access.txt     # Sample access log
└── README.md          # This documentation
```

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd pract10_23DCS122
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The log viewer will be available at `http://localhost:3001`

## API Endpoints

### File Management
- **GET /api/logs**: List all available log files with metadata
- **GET /api/logs/:filename**: Read specific log file with pagination
- **GET /api/download/:filename**: Download log file

### Query Parameters
- `page`: Page number for pagination (default: 1)
- `limit`: Lines per page (default: 100)
- `search`: Search term to filter lines

### Example API Calls
```bash
# List all log files
curl http://localhost:3001/api/logs

# Read first page of application.log
curl http://localhost:3001/api/logs/application.log?page=1&limit=50

# Search for "ERROR" in error.log
curl http://localhost:3001/api/logs/error.log?search=ERROR
```

## Features in Detail

### 1. File Browser
- **Auto-discovery**: Automatically detects `.log` and `.txt` files
- **File metadata**: Shows file size, modification date, and line count
- **Error handling**: Displays issues with inaccessible files
- **Sorting**: Files sorted by modification date (newest first)

### 2. Log Viewer
- **Line numbers**: Clear line numbering for easy reference
- **Pagination**: Handle large files efficiently (100 lines per page)
- **Search highlighting**: Visual highlighting of search terms
- **Monospace font**: Optimal readability for log content

### 3. Search Functionality
- **Real-time search**: Debounced search input (300ms delay)
- **Case-insensitive**: Flexible searching
- **Result highlighting**: Visual emphasis on matching terms
- **Search statistics**: Show matching lines and total results

### 4. Security Features
- **Path traversal protection**: Prevents access outside logs directory
- **File type validation**: Only allows `.log` and `.txt` files
- **Error handling**: Graceful handling of file access errors
- **Input sanitization**: Safe handling of user input

### 5. User Experience
- **Loading states**: Visual feedback during operations
- **Error states**: Clear error messages and recovery options
- **Keyboard shortcuts**: Quick navigation and search
- **Responsive design**: Works on all screen sizes

## Keyboard Shortcuts

- **Ctrl/Cmd + R**: Refresh log list
- **Ctrl/Cmd + Left Arrow**: Previous page
- **Ctrl/Cmd + Right Arrow**: Next page
- **/**: Focus search input
- **Escape**: Clear search focus

## Configuration

### Environment Variables
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode
- `LOGS_DIR`: Custom logs directory path

### Log File Requirements
- **File extensions**: `.log` or `.txt`
- **Location**: Place files in the `logs/` directory
- **Encoding**: UTF-8 text files
- **Max size**: No hard limit (pagination handles large files)

## Sample Log Files

The project includes three sample log files:

1. **application.log**: General application events and info
2. **error.log**: Error messages with stack traces
3. **access.txt**: HTTP access logs in Common Log Format

## Error Handling

### Client-Side Errors
- Network failures with retry options
- File not found with helpful messages
- Search errors with fallback behavior

### Server-Side Errors
- File access permission issues
- Invalid file paths or names
- Large file handling with memory optimization
- Malformed requests with proper HTTP status codes

## Security Considerations

### File Access
- Restricted to designated logs directory
- Path traversal attack prevention
- File type validation
- Error message sanitization

### Input Validation
- Search query length limits
- Parameter sanitization
- SQL injection prevention (not applicable but good practice)

## Performance Optimization

### Pagination
- Efficient memory usage for large files
- Configurable page sizes
- Lazy loading of file content

### Caching
- File metadata caching
- Client-side caching of static assets
- Optimized HTTP headers

### Search
- Debounced search input
- Efficient string matching
- Limited result sets

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Development Notes

### Code Quality
- Clean, documented code structure
- Error handling at all levels
- Modular architecture for maintainability
- RESTful API design

### Scalability
- Designed for production use
- Handles multiple concurrent users
- Efficient file processing
- Memory-conscious operations

## Troubleshooting

### Common Issues

1. **No log files showing**
   - Ensure `.log` or `.txt` files are in the `logs/` directory
   - Check file permissions

2. **File access errors**
   - Verify file permissions and ownership
   - Check server has read access to logs directory

3. **Search not working**
   - Clear browser cache
   - Check for JavaScript errors in console

4. **Performance issues**
   - Reduce page size for very large files
   - Consider log rotation for extremely large files

## Author

**Student ID:** 23DCS122  
**Project:** Express.js Log Viewer Tool  
**Date:** August 2024

---

*This tool demonstrates professional Express.js development with focus on practical developer needs and production-ready code quality.*
