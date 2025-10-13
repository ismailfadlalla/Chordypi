import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PiNetworkIntegration from '../components/pi/PiNetworkIntegration';
import ChordyPiLogo from '../components/common/ChordyPiLogo';
import '../styles/components/auth.css';

const AuthPage = () => {
    const { signIn, signUp, user } = useAuth();
    const history = useHistory();
    
    const [piError, setPiError] = useState('');
    const [showError, setShowError] = useState(true);

    // Update isSignUp when route changes
    React.useEffect(() => {
        setIsSignUp(location.pathname === '/signup');
    }, [location.pathname]);

    // DISABLED for debugging - Redirect if already authenticated (but not during active authentication)
    // React.useEffect(() => {
    //     // Add a small delay to ensure error state is processed first
    //     const timeoutId = setTimeout(() => {
    //         if (user && !isAuthenticating && !localError) {
    //             console.log('🔍 Redirecting because user exists, not authenticating, and no error:', user);
    //             history.push('/');
    //         } else {
    //             console.log('🔍 Not redirecting. User:', !!user, 'Authenticating:', isAuthenticating, 'Error:', !!localError);
    //         }
    //     }, 100);
        
    //     return () => clearTimeout(timeoutId);
    // }, [user, history, isAuthenticating, localError]);

    const showLocalStorageState = () => {
        console.log('📋 Current localStorage state:');
        console.log('📋 users:', localStorage.getItem('users'));
        console.log('📋 user:', localStorage.getItem('user'));
        console.log('📋 token:', localStorage.getItem('token'));
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('📋 Parsed users:', users);
        
        alert('Check console for localStorage state');
    };

    const testDirectAuth = async () => {
        console.log('🧪 Testing direct authentication...');
        setLocalError('');
        
        try {
            // Import authService directly
            const authService = await import('../services/authService');
            
            // Test with wrong credentials
            await authService.signIn({ email: 'test@test.com', password: 'wrongpassword' });
            console.log('❌ This should not happen - auth should have failed');
            
        } catch (err) {
            console.log('✅ Direct auth correctly failed:', err.message);
            setLocalError(err.message);
        }
    };

    const clearAuthData = () => {
        console.log('🧹 Clearing all authentication data...');
        console.log('🔍 Current localStorage state:', {
            token: localStorage.getItem('token'),
            user: localStorage.getItem('user'),
            users: localStorage.getItem('users'),
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('users');
        localStorage.removeItem('piNetworkUser');
        localStorage.removeItem('piNetworkAuth');
        console.log('🧹 All auth data cleared');
        window.location.reload(); // Reload to reset all state
    };

    const createTestUser = () => {
        console.log('👤 Creating test user...');
        const testUsers = [
            {
                id: 'test-user-1',
                username: 'testuser',
                email: 'test@test.com',
                password: 'test123',
                createdAt: Date.now()
            }
        ];
        localStorage.setItem('users', JSON.stringify(testUsers));
        console.log('👤 Test user created: test@test.com / test123');
    };

    const handleTraditionalAuth = async (formData) => {
        setLocalError(''); // Clear any previous error
        setIsAuthenticating(true);
        
        try {
            const { email, password, username } = formData;
            
            if (isSignUp) {
                await signUp(email, password, username);
                console.log('✅ Account created successfully!');
                setIsAuthenticating(false);
                history.push('/');
            } else {
                await signIn(email, password);
                console.log('✅ Signed in successfully!');
                setIsAuthenticating(false);
                history.push('/');
            }
            
        } catch (err) {
            console.error('❌ Authentication error:', err);
            
            // Clear any authentication tokens on error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            setLocalError(err.message || 'Authentication failed. Please try again.');
            setIsAuthenticating(false);
        }
    };

    const handlePiAuth = async (piUserData) => {
        setPiError('');
        
        try {
            console.log('🥧 Pi Network authentication:', piUserData);
            setPiUser(piUserData);
            
            // Create account using Pi Network data
            await signUp(
                piUserData.username + '@pi.network', // Temporary email
                'pi-network-auth', // Temporary password
                piUserData.username
            );
            
            console.log('✅ Pi Network account created/signed in!');
            history.push('/');
            
        } catch (err) {
            console.error('❌ Pi Network authentication error:', err);
            setPiError(err.message || 'Pi Network authentication failed.');
        }
    };

    if (user) {
        return (
            <div className="auth-page loading">
                <div className="loading-spinner">Redirecting...</div>
            </div>
        );
    }


    return (
        <div className="auth-page enhanced">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="logo-section">
                        <ChordyPiLogo size="medium" showTagline={true} />
                    </div>
                </div>

                <div className="auth-content">
                    {/* Modal Overlay Backdrop - Blocks Interaction */}
                    {piError && showError && (
                        <div className="error-modal-overlay">
                            {/* Enhanced Error Message */}
                            <div className="error-message enhanced">
                                <div className="error-content">
                                    <span className="error-icon">⚠️</span>
                                    <div className="error-text-container">
                                        <p className="error-main-text">{piError}</p>
                                        {piError.includes('network') && (
                                            <p className="error-hint">🌐 Please check your internet connection</p>
                                        )}
                                        {piError.includes('server') && (
                                            <p className="error-hint">⚙️ Our servers might be experiencing issues. Please try again later</p>
                                        )}
                                    </div>
                                    <button 
                                        className="error-close-btn"
                                        onClick={() => {
                                            setShowError(false);
                                            setPiError('');
                                        }}
                                        aria-label="Close error message"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pi Network Authentication ONLY */}
                    <div className="pi-auth">
                        <h2>🥧 Pi Network Authentication</h2>
                        <p className="auth-description">
                            ChordyPi is exclusively for Pi Network users. Connect with your Pi Network account for secure, blockchain-based authentication.
                        </p>
                        
                        <PiNetworkIntegration 
                            onAuthSuccess={handlePiAuth}
                            authMode={true}
                        />
                        
                        <div className="pi-benefits">
                            <h3>🌟 Pi Network Benefits:</h3>
                            <ul>
                                <li>🔒 Secure blockchain authentication</li>
                                <li>💰 Pay for premium features with Pi</li>
                                <li>🚀 Support decentralized web</li>
                                <li>💎 Exclusive Pi user features</li>
                                <li>🎸 Learn guitar with blockchain rewards</li>
                            </ul>
                        </div>
                    </div>

                    {/* Quick Features Preview */}
                    <div className="features-preview">
                        <h3>🎵 What you'll get:</h3>
                        <div className="features-grid">
                            <div className="feature-item">
                                <span className="feature-icon">🎸</span>
                                <span>AI Chord Analysis</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">📊</span>
                                <span>Progress Tracking</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">❤️</span>
                                <span>Save Favorites</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🔄</span>
                                <span>Song History</span>
                            </div>
                        </div>
                    </div>

                    {/* Home Button - Bottom Right */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(108, 92, 231, 0.2)'
                    }}>
                        <button 
                            className="home-button-bottom"
                            onClick={() => history.push('/')}
                            aria-label="Go to Home"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>🏠</span>
                            <span>Go to Home</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthPage;