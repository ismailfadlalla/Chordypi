import React, { useEffect, useState } from 'react';
import '../../styles/components/pi-auth.css';

const PiNetworkAuth = ({ onAuthenticated }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [piUser, setPiUser] = useState(null);

    useEffect(() => {
        initializePiSDK();
    }, []);

    const initializePiSDK = async () => {
        try {
            console.log('🥧 Initializing Pi SDK...');
            
            // Check if Pi SDK is loaded
            if (typeof window.Pi === 'undefined') {
                throw new Error('Pi SDK not loaded. Please open this app in Pi Browser.');
            }

            console.log('✅ Pi SDK found, initializing...');
            
            // Initialize Pi SDK
            await window.Pi.init({ 
                version: "2.0",
                sandbox: true // MUST be true during development/testing - set to false only after production approval
            });

            console.log('✅ Pi SDK initialized (SANDBOX MODE), authenticating user...');

            // Authenticate user with timeout
            const scopes = ['username', 'payments', 'wallet_address'];
            
            // Set a timeout for authentication (30 seconds)
            const authTimeout = setTimeout(() => {
                console.warn('⏱️ Pi authentication timeout - origin mismatch or network issue');
                setError('Authentication timeout. This may be due to domain configuration in Pi Developer Portal.');
                setLoading(false);
            }, 30000);
            
            const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
            
            clearTimeout(authTimeout);
            
            console.log('✅ Pi authentication successful:', authResult);
            
            setPiUser(authResult.user);
            
            // Store authentication in localStorage
            localStorage.setItem('piNetworkAuth', JSON.stringify({
                user: authResult.user,
                accessToken: authResult.accessToken,
                timestamp: Date.now()
            }));

            setLoading(false);
            
            // Notify parent component
            if (onAuthenticated) {
                onAuthenticated(authResult.user);
            }

        } catch (err) {
            console.error('❌ Pi SDK initialization error:', err);
            setError(err.message || 'Failed to authenticate with Pi Network');
            setLoading(false);
        }
    };

    const onIncompletePaymentFound = (payment) => {
        console.log('⚠️ Incomplete payment found:', payment);
        // Handle incomplete payment if needed
        return payment.id;
    };

    if (error) {
        return (
            <div className="pi-auth-container">
                <div className="pi-auth-error">
                    <div className="error-icon">⚠️</div>
                    <h2>Pi Authentication Issue</h2>
                    <p>{error}</p>
                    <div style={{ marginTop: '20px' }}>
                        <button 
                            className="retry-button"
                            onClick={initializePiSDK}
                            style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                backgroundColor: '#764ba2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            🔄 Retry Authentication
                        </button>
                        <button 
                            onClick={() => {
                                console.log('⚠️ Skipping Pi authentication (demo mode)');
                                // Create a demo user for testing
                                const demoUser = {
                                    username: 'demo_user',
                                    uid: 'demo_' + Date.now()
                                };
                                localStorage.setItem('piNetworkAuth', JSON.stringify({
                                    user: demoUser,
                                    accessToken: 'demo_token',
                                    timestamp: Date.now()
                                }));
                                if (onAuthenticated) {
                                    onAuthenticated(demoUser);
                                }
                            }}
                            style={{
                                padding: '12px 24px',
                                fontSize: '16px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            🚀 Continue Without Pi Auth (Demo Mode)
                        </button>
                    </div>
                    <p className="error-hint" style={{ marginTop: '20px', fontSize: '14px', opacity: 0.8' }}>
                        If you're testing on Vercel, the Pi SDK may have origin issues. Use demo mode or test in Pi Browser mobile app.
                    </p>
                        Make sure you're opening this app in the official Pi Browser
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="pi-auth-container">
                <div className="pi-auth-loading">
                    <div className="pi-logo">
                        <img src="https://minepi.com/img/pi-logo.png" alt="Pi Network" />
                    </div>
                    <h2>Connecting to Pi Network</h2>
                    <div className="loading-spinner"></div>
                    <p className="loading-message">
                        Please approve the permission request to continue
                    </p>
                    <div className="loading-steps">
                        <div className="step">✅ SDK Loaded</div>
                        <div className="step active">🔐 Waiting for permission...</div>
                        <div className="step">🎸 Loading ChordyPi</div>
                    </div>
                </div>
            </div>
        );
    }

    // If authenticated, this component will be replaced by the main app
    return null;
};

export default PiNetworkAuth;
