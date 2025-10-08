import React, { useState } from 'react';
import '../../styles/components/auth.css';

const AuthForm = ({ onSubmit, isSignUp = false, loading = false }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Username validation for sign up
        if (isSignUp) {
            if (!formData.username.trim()) {
                newErrors.username = 'Username is required';
            } else if (formData.username.length < 3) {
                newErrors.username = 'Username must be at least 3 characters';
            } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
                newErrors.username = 'Username can only contain letters, numbers, and underscores';
            }
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm password validation for sign up
        if (isSignUp) {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
        } catch (err) {
            console.error('Form submission error:', err);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        // Real-time password confirmation validation
        if (field === 'confirmPassword' && isSignUp) {
            if (value && formData.password && value !== formData.password) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            } else if (value === formData.password && formData.password) {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }

        // Also check confirm password when main password changes
        if (field === 'password' && isSignUp && formData.confirmPassword) {
            if (formData.confirmPassword && value !== formData.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            } else if (formData.confirmPassword === value) {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    return (
        <form className="auth-form enhanced" onSubmit={handleSubmit}>
            {isSignUp && (
                <div className="form-group">
                    <label htmlFor="username">
                        👤 Username
                        <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className={errors.username ? 'error' : ''}
                        placeholder="Enter your username"
                        disabled={loading}
                        autoComplete="username"
                    />
                    {errors.username && (
                        <span className="error-text enhanced">
                            <span className="error-icon-inline">⚠️</span>
                            <span>{errors.username}</span>
                        </span>
                    )}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="email">
                    📧 Email Address
                    <span className="required">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email"
                    disabled={loading}
                    autoComplete="email"
                />
                {errors.email && (
                    <span className="error-text enhanced">
                        <span className="error-icon-inline">⚠️</span>
                        <span>{errors.email}</span>
                    </span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="password">
                    🔒 Password
                    <span className="required">*</span>
                </label>
                <div className="password-input-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={errors.password ? 'error' : ''}
                        placeholder={isSignUp ? "Create a password (min. 6 characters)" : "Enter your password"}
                        disabled={loading}
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>
                {errors.password && (
                    <span className="error-text enhanced">
                        <span className="error-icon-inline">⚠️</span>
                        <span>{errors.password}</span>
                    </span>
                )}
            </div>

            {isSignUp && (
                <div className="form-group">
                    <label htmlFor="confirmPassword">
                        🔒 Confirm Password
                        <span className="required">*</span>
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={
                            errors.confirmPassword ? 'error' : 
                            (formData.confirmPassword && formData.password && formData.confirmPassword === formData.password) ? 'success' : ''
                        }
                        placeholder="Confirm your password"
                        disabled={loading}
                        autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                        <span className="error-text enhanced">
                            <span className="error-icon-inline">⚠️</span>
                            <span>{errors.confirmPassword}</span>
                        </span>
                    )}
                    {!errors.confirmPassword && formData.confirmPassword && formData.password && formData.confirmPassword === formData.password && (
                        <span className="success-text enhanced">
                            <span className="success-icon-inline">✅</span>
                            <span>Passwords match!</span>
                        </span>
                    )}
                </div>
            )}

            <button 
                type="submit" 
                className="auth-submit-button"
                disabled={loading}
            >
                {loading ? (
                    <span className="loading-content">
                        <span className="spinner">⏳</span>
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </span>
                ) : (
                    <span>
                        {isSignUp ? '🚀 Create Account' : '🔑 Sign In'}
                    </span>
                )}
            </button>

            {isSignUp && (
                <div className="form-footer">
                    <p className="terms-text">
                        By creating an account, you agree to our{' '}
                        <a href="/terms" target="_blank" rel="noopener noreferrer">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            )}
        </form>
    );
};

export default AuthForm;