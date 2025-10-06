# People's Pulse – Civic Empowerment Platform

A modern, multilingual civic engagement website where citizens can submit complaints, track their status, and understand government policies.

## Features

- **Authentication System**: User signup, login, and profile management
- **Multilingual Support**: English and Hindi interface
- **Complaint Management**: Submit, track, and manage complaints
- **Policy Hub**: Curated government policies with summaries
- **Mobile-First Design**: Responsive UI for all devices
- **Backend API**: MongoDB-based backend with JWT authentication

## Tech Stack

- **Frontend**: Next.js 14, React 18, CSS3
- **Backend**: Node.js, MongoDB with Mongoose
- **Authentication**: JWT tokens with HTTP-only cookies
- **Database**: MongoDB (local or cloud)

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd peoples-pulse
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/peoples-pulse
   JWT_SECRET=your-super-secret-jwt-key
   ```

3. **Database Setup**
   - Start MongoDB locally: `mongod`
   - Or use MongoDB Atlas (cloud)

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit: `http://localhost:3000`

## Project Structure

```
peoples-pulse/
├── app/                    # Next.js app directory
│   ├── (routes)/          # Page routes
│   │   ├── login/         # Login page
│   │   ├── signup/        # Signup page
│   │   ├── submit/        # Submit complaint
│   │   ├── track/         # Track complaint
│   │   └── policies/      # Policy hub
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication APIs
│   │   └── complaints/    # Complaint APIs
│   ├── globals.css        # Global styles
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Homepage
├── backend/                # Backend models & config
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB schemas
│   └── middleware/        # Auth middleware
├── components/             # React components
│   ├── AuthNav.jsx        # Authentication navigation
│   └── LocaleToggle.jsx   # Language switcher
└── package.json           # Dependencies & scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Complaints
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints` - Get user's complaints
- `GET /api/complaints/[id]` - Get specific complaint

## Database Models

### User
- name, email, phone, password
- role (user/admin)
- createdAt timestamp

### Complaint
- userId, summary, details
- language (en/hi)
- location (taluka, district, state)
- status, timeline
- images array

## Development

### Adding New Features
1. Create page in `app/(routes)/`
2. Add API route in `app/api/`
3. Create model in `backend/models/` if needed
4. Update navigation in `layout.jsx`

### Styling
- Uses CSS custom properties for theming
- Mobile-first responsive design
- Dark theme with blue/green accent colors

## Production Deployment

1. **Environment Variables**
   - Set `MONGODB_URI` to production database
   - Generate strong `JWT_SECRET`
   - Set `NODE_ENV=production`

2. **Build & Deploy**
   ```bash
   npm run build
   npm start
   ```

3. **Security Considerations**
   - Change default JWT secret
   - Use HTTPS in production
   - Set secure cookie options
   - Implement rate limiting

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

This project is for educational purposes. Modify as needed for production use.
