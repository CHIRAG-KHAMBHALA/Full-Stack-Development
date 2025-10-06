# MERN Authentication Portal

A complete user authentication system built with MongoDB, Express.js, React, and Node.js.

## Features

- ✅ User Registration with validation
- ✅ Secure Login with JWT tokens
- ✅ Password encryption using bcrypt
- ✅ Protected routes and middleware
- ✅ User profile management
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling
- ✅ Context-based state management

## Technology Stack

### Frontend
- React 19
- React Router
- React Hook Form
- Axios for API calls
- Yup for validation
- React Toastify for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled
- Input validation with express-validator

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/

2. **MongoDB** (Choose one option):
   
   **Option A: MongoDB Compass (Recommended for development)**
   - Download from: https://www.mongodb.com/products/compass
   - Install and start MongoDB Compass
   - Create a new connection using: `mongodb://localhost:27017`
   
   **Option B: MongoDB Atlas (Cloud solution)**
   - Create account at: https://www.mongodb.com/atlas
   - Create a cluster and get connection string
   - Update `.env` file with your Atlas connection string
   
   **Option C: Docker**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd Internal_prac_1
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create/update `.env` file in server directory:
```env
MONGODB_URL=mongodb://127.0.0.1:27017/auth_portal
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
- If using MongoDB Compass: Start the application
- If using Docker: Run the docker command above
- If using Atlas: Ensure your cluster is running

### 5. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

## Project Structure

```
Internal_prac_1/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/        # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   │   └── User.js
│   ├── routes/             # API routes
│   │   └── auth.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Troubleshooting

### MongoDB Connection Issues

**Error: `connect ECONNREFUSED ::1:27017`**

Solutions:
1. **Install and start MongoDB locally:**
   - Download MongoDB Community Server from mongodb.com
   - Install and start the MongoDB service
   - Or use MongoDB Compass for easier management

2. **Use MongoDB Atlas (Cloud):**
   - Create free account at mongodb.com/atlas
   - Create cluster and get connection string
   - Update MONGODB_URL in .env file

3. **Use Docker:**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

### Registration/Login Issues

1. **Check server logs** for specific error messages
2. **Verify MongoDB is running** and accessible
3. **Check network requests** in browser dev tools
4. **Ensure .env file** has correct values

### Frontend Issues

1. **Clear browser cache** and localStorage
2. **Check console** for JavaScript errors
3. **Verify backend is running** on port 5000

## Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens for stateless authentication
- Input validation and sanitization
- Protected routes with middleware
- CORS configuration
- Environment variables for sensitive data

## Development Notes

- Frontend runs on port 3000 (Vite dev server)
- Backend runs on port 5000 (Express server)
- Database uses MongoDB on port 27017
- JWT tokens expire in 24 hours
- Passwords must contain uppercase, lowercase, and numbers

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is for educational purposes.