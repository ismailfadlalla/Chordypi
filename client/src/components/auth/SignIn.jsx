import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { signIn } from '../../services/authService';
import '../../styles/components/auth-enhanced.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await signIn({ email, password });
            setSuccess('Welcome back! Redirecting...');
            setTimeout(() => {
                history.push('/');
            }, 1500);
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-title">🎸 Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to continue your musical journey</p>
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                autoComplete="current-password"
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
                                Signing In...
                            </span>
                        ) : (
                            '🔐 Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-toggle">
                    <p className="auth-toggle-text">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="btn-glass"
                            onClick={() => history.push('/signup')}
                            disabled={loading}
                        >
                            Sign Up
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
                    By signing in, you agree to our{' '}
                    <a href="/terms">Terms of Service</a> and{' '}
                    <a href="/privacy">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;