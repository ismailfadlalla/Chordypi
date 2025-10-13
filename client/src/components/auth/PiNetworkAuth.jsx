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

            // Authenticate user - This will show the permission dialog
            const scopes = ['username', 'payments', 'wallet_address'];
            
            const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
            
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
                    <h2>Authentication Error</h2>
                    <p>{error}</p>
                    <button 
                        className="retry-button"
                        onClick={initializePiSDK}
                    >
                        🔄 Retry
                    </button>
                    <p className="error-hint">
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
