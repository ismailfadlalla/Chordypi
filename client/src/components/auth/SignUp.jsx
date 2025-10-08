import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/components/auth-enhanced.css';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await register(username, email, password);
            setSuccess('Account created successfully! Redirecting...');
            setTimeout(() => {
                history.push('/');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-title">🎸 Join ChordyPi</h1>
                    <p className="auth-subtitle">Create your account and start your musical journey</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-error-message">
                            ⚠️ {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="auth-success-message">
                            ✅ {success}
                        </div>
                    )}

                    <div className="auth-form-group">
                        <label htmlFor="username" className="auth-form-label">
                            Username <span className="required">*</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="auth-form-input"
                            placeholder="Choose your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="email" className="auth-form-label">
                            Email <span className="required">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="auth-form-input"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="password" className="auth-form-label">
                            Password <span className="required">*</span>
                        </label>
                        <div className="auth-password-group">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="auth-form-input"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                autoComplete="new-password"
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth-loading">
                                <span className="auth-loading-spinner"></span>
                                Creating Account...
                            </span>
                        ) : (
                            '🚀 Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-toggle">
                    <p className="auth-toggle-text">
                        Already have an account?{' '}
                        <button
                            type="button"
                            className="btn-glass"
                            onClick={() => history.push('/signin')}
                            disabled={loading}
                        >
                            Sign In
                        </button>
                    </p>
                    <button
                        type="button"
                        className="btn-outline"
                        onClick={() => history.push('/')}
                        disabled={loading}
                    >
                        🏠 Back to Home
                    </button>
                </div>

                <p className="auth-terms">
                    By signing up, you agree to our{' '}
                    <a href="/terms">Terms of Service</a> and{' '}
                    <a href="/privacy">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;