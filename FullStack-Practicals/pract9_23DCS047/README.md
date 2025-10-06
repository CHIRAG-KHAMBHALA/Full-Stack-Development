# Basic Express.js Server - Product Site

**Project:** pract9_23DCS122  
**Student ID:** 23DCS122

## Overview

This is a basic Express.js server created as a proof of concept for a small product site. The server displays a welcoming home page and demonstrates the fundamental Express framework structure with clean, scalable code architecture.

## Features

- 🚀 **Modern UI**: Glassmorphism design with responsive layout
- ⚡ **Fast Performance**: Built with Express.js for optimal speed
- 🛡️ **Secure**: Implements web security best practices
- 📱 **Responsive**: Works perfectly on all devices
- 🔧 **Scalable**: Clean architecture for future feature expansion

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: HTML5, CSS3, JavaScript
- **Design**: Modern glassmorphism UI with CSS animations
- **Icons**: Font Awesome 6.0

## Project Structure

```
pract9_23DCS122/
├── server.js          # Main Express server file
├── package.json       # Project dependencies and scripts
├── public/            # Static files
│   ├── index.html     # Main homepage
│   ├── 404.html       # Error page
│   ├── styles.css     # CSS styling
│   └── script.js      # Client-side JavaScript
└── README.md          # This file
```

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd pract9_23DCS122
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

The server will start on `http://localhost:3000`

## Available Routes

- **GET /**: Homepage with welcome message
- **GET /api/status**: Server status API endpoint
- **GET /404**: Custom 404 error page

## Features Demonstrated

### 1. Basic Express Server Setup
- Clean server configuration
- Middleware setup for static files
- JSON and URL-encoded request handling
- Environment-based port configuration

### 2. Error Handling
- Custom 404 error page
- Global error handler middleware
- Graceful error responses

### 3. API Endpoints
- RESTful status endpoint (`/api/status`)
- JSON response formatting
- Error handling for API routes

### 4. Static File Serving
- CSS, JS, and HTML file serving
- Optimized static file middleware
- Cache-friendly headers

### 5. Modern Frontend
- Interactive UI elements
- Real-time server status checking
- Modal dialogs for information display
- Smooth animations and transitions

## Environment Variables

The server supports the following environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## Development Notes

This project demonstrates:
- **Clean Code**: Well-structured and commented code
- **Scalability**: Modular architecture for easy expansion
- **User Experience**: Modern, intuitive interface
- **Performance**: Optimized for fast loading and responsiveness
- **Maintainability**: Clear separation of concerns

## Future Enhancements

The current architecture supports easy addition of:
- User authentication system
- Product catalog management
- Shopping cart functionality
- Database integration
- Payment processing
- Admin dashboard

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Author

**Student ID:** 23DCS122  
**Project:** Basic Express.js Server for Product Site  
**Date:** August 2024

---

*This project serves as a proof of concept demonstrating Express.js fundamentals with modern web development practices.*
