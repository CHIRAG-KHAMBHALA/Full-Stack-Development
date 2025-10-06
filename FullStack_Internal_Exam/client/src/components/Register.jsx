import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Validation schema
const schema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Please enter a valid 10-digit phone number')
    .nullable(),
  dateOfBirth: yup
    .date()
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 18 years old')
    .nullable()
});

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated, error, clearErrors } = useAuth();
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    clearErrors();

    try {
      const result = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined
      });

      if (result.success) {
        toast.success(result.message || 'Registration successful!');
        reset();
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(result.message || 'Registration failed');
        
        // Handle field-specific errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach(error => {
            toast.error(error.msg || error.message);
          });
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our platform today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                {...registerField('firstName')}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                type="text"
                {...registerField('lastName')}
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              {...registerField('email')}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              {...registerField('phone')}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter your 10-digit phone number"
            />
            {errors.phone && (
              <span className="error-message">{errors.phone.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              {...registerField('dateOfBirth')}
              className={errors.dateOfBirth ? 'error' : ''}
            />
            {errors.dateOfBirth && (
              <span className="error-message">{errors.dateOfBirth.message}</span>
            )}
          </div>

          <div className="color='black' form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              {...registerField('password')}
              className={errors.password ? 'error' : ''}
              placeholder="Create a strong password"
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              type="password"
              {...registerField('confirmPassword')}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
            )}
          </div>

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;