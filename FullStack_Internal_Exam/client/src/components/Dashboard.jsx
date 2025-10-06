import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

// Validation schema for profile update
const profileSchema = yup.object({
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
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Please enter a valid 10-digit phone number')
    .nullable(),
  dateOfBirth: yup
    .date()
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 18 years old')
    .nullable()
});

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
    }
  });

  // Reset form when user data changes or editing mode changes
  React.useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
      });
    }
  }, [user, reset, isEditing]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const onUpdateProfile = async (data) => {
    setIsUpdating(true);

    try {
      const result = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined
      });

      if (result.success) {
        toast.success(result.message || 'Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.message || 'Failed to update profile');
        
        // Handle field-specific errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach(error => {
            toast.error(error.msg || error.message);
          });
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Profile update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user.firstName}!</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="profile-card">
          <div className="profile-header">
            <h2>Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="edit-btn"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onUpdateProfile)} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    {...register('firstName')}
                    className={errors.firstName ? 'error' : ''}
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
                    {...register('lastName')}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && (
                    <span className="error-message">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
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
                  {...register('dateOfBirth')}
                  className={errors.dateOfBirth ? 'error' : ''}
                />
                {errors.dateOfBirth && (
                  <span className="error-message">{errors.dateOfBirth.message}</span>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="cancel-btn"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <label>Full Name:</label>
                <span>{user.firstName} {user.lastName}</span>
              </div>

              <div className="info-group">
                <label>Email Address:</label>
                <span>{user.email}</span>
              </div>

              <div className="info-group">
                <label>Phone Number:</label>
                <span>{user.phone || 'Not provided'}</span>
              </div>

              <div className="info-group">
                <label>Date of Birth:</label>
                <span>{formatDate(user.dateOfBirth)}</span>
              </div>

              <div className="info-group">
                <label>Member Since:</label>
                <span>{formatDate(user.createdAt)}</span>
              </div>

              <div className="info-group">
                <label>Account Status:</label>
                <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="stats-card">
          <h3>Account Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1</div>
              <div className="stat-label">Total Logins</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="stat-label">Days Active</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{user.isActive ? 'Active' : 'Inactive'}</div>
              <div className="stat-label">Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;