import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to SecureAuth Portal</h1>
          <p className="hero-description">
            A secure and modern authentication system built with the MERN stack.
            Experience seamless user registration, login, and profile management.
          </p>

          {isAuthenticated ? (
            <div className="authenticated-section">
              <h2>Hello, {user?.firstName}!</h2>
              <p>You are successfully logged in to your account.</p>
              <Link to="/dashboard" className="cta-button">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/register" className="cta-button primary">
                Get Started
              </Link>
              <Link to="/login" className="cta-button secondary">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="tech-stack-section">
        <div className="container">
          <h2>Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h4>Frontend</h4>
              <ul>
                <li>React 19</li>
                <li>React Router</li>
                <li>React Hook Form</li>
                <li>Axios</li>
                <li>Yup Validation</li>
              </ul>
            </div>
            <div className="tech-item">
              <h4>Backend</h4>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB</li>
                <li>Mongoose</li>
                <li>JWT</li>
              </ul>
            </div>
            <div className="tech-item">
              <h4>Security</h4>
              <ul>
                <li>bcryptjs</li>
                <li>JWT Tokens</li>
                <li>CORS</li>
                <li>Input Validation</li>
                <li>Secure Headers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;