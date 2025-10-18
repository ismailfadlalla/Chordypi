import React, { useState } from 'react';
import './PiNetworkIntegration.css';

const PiNetworkIntegration = ({ onAuthSuccess, authMode = false }) => {
    const [piUser, setPiUser] = useState(null);
    const [piPayment, setPiPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sdkInitialized, setSdkInitialized] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    // Check if Pi SDK is available (non-blocking check only)
    const isPiAvailable = typeof window !== 'undefined' && window.Pi;
    
    // Detect if we're actually in Pi Browser - check multiple indicators
    const isPiBrowser = typeof window !== 'undefined' && (
        navigator.userAgent.toLowerCase().includes('pibrowser') ||
        navigator.userAgent.toLowerCase().includes('pi browser') ||
        navigator.userAgent.toLowerCase().includes('pi-browser') ||
        window.location.hostname.includes('minepi.com') ||
        window.location.hostname.includes('pi.app') ||
        // If Pi SDK loads successfully, assume we're in compatible environment
        (window.Pi && window.Pi.authenticate)
    );

    // Initialize Pi SDK (only when user clicks connect)
    const initializePi = async () => {
        if (!isPiAvailable) {
            setError('Pi Network SDK not available. Please use Pi Browser.');
            return false;
        }

        if (sdkInitialized) {
            return true; // Already initialized
        }

        try {
            console.log('🥧 Initializing Pi Network SDK...');
            console.log('🔍 Pi Browser detected:', isPiBrowser);
            console.log('🔍 Current hostname:', window.location.hostname);
            
            // Get environment variables - default to production for Pi Hackathon
            const piApiKey = process.env.REACT_APP_PI_API_KEY || process.env.REACT_APP_PI_NETWORK_API_KEY;
            
            // Auto-detect environment based on domain
            // Use production mode for deployed apps (vercel.app)
            const isProduction = window.location.hostname.includes('vercel.app') || 
                                window.location.hostname.includes('chordypi.com');
            const environment = isProduction ? 'production' : 'sandbox';
            
            console.log(`🌍 Environment: ${environment} mode (isProduction: ${isProduction})`);
            
            // Initialize Pi SDK - fast, non-blocking
            await window.Pi.init({
                version: "2.0",
                sandbox: !isProduction // Use production mode on vercel.app
            });
            
            console.log(`✅ Pi Network SDK initialized successfully (${environment} mode)`);
            setSdkInitialized(true);
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize Pi SDK:', error);
            setError('Failed to initialize Pi Network. Please try again.');
            return false;
        }
    };

    // Authenticate with Pi Network - triggers native Pi permission dialog
    const handlePiAuth = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Initialize SDK first if needed
            if (!sdkInitialized) {
                const initialized = await initializePi();
                if (!initialized) {
                    setIsLoading(false);
                    return;
                }
            }

            console.log('🔐 Requesting Pi Network authentication...');
            console.log('🔍 User Agent:', navigator.userAgent);
            console.log('🔍 Window.Pi available:', !!window.Pi);
            console.log('🔍 Window.Pi.authenticate available:', !!window.Pi.authenticate);
            console.log('🔍 Is Pi Browser detected:', isPiBrowser);
            
            // Log warning if not detected as Pi Browser but allow authentication attempt
            if (!isPiBrowser) {
                console.warn('⚠️ Pi Browser not detected in user agent, but attempting authentication anyway...');
            }
            
            // This triggers the native Pi Browser permission dialog
            // User will see: "Share information with ChordyPi?"
            // - Auth: Authenticate you on this app with your Pi account
            // - Username: Your Pi username
            // - Payments: Enable Pi payments
            
            // Pi SDK v2.0 authenticate format with timeout detection
            console.log('⏳ Calling window.Pi.authenticate()...');
            console.log('📋 Scopes requested: username, payments');
            
            // Set a timeout to detect if authentication is hanging
            const authTimeout = setTimeout(() => {
                console.log('⏰ Authentication is taking longer than expected (5+ seconds)...');
                console.log('💡 Possible issues:');
                console.log('   1. Check if Pi Browser is showing a permission dialog');
                console.log('   2. Check if you need to approve in Pi Browser');
                console.log('   3. Network connectivity to Pi servers');
            }, 5000);
            
            // Race between authentication and 30-second timeout
            const authPromise = window.Pi.authenticate(
                ['username', 'payments'],  // scopes array
                function onIncompletePaymentFound(payment) {
                    console.log('💰 Incomplete payment found:', payment);
                    setPiPayment(payment);
                }
            );
            
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Pi Network authentication timed out after 30 seconds. This might be a network issue or the app needs to be registered in Pi Developer Portal.'));
                }, 30000);
            });
            
            const auth = await Promise.race([authPromise, timeoutPromise]);
            
            clearTimeout(authTimeout);
            console.log('🎉 Authentication response received:', auth);
            console.log('✅ Pi Authentication successful:', auth);
            setPiUser(auth.user);
            setIsAuthenticated(true);
            
            // Call the parent callback if provided
            if (onAuthSuccess) {
                onAuthSuccess(auth.user);
            }
            
        } catch (error) {
            console.error('❌ Pi Authentication failed:', error);
            
            // Handle specific error types
            if (error.message && error.message.includes('every is not a function')) {
                setError('🔄 Pi SDK initialization error. Please refresh the page and try again.');
            } else if (error.message && error.message.includes('declined')) {
                setError('Authentication declined. Please allow access to continue.');
            } else if (error.message && error.message.includes('postMessage')) {
                setError('Connection error. Please make sure you\'re using the latest Pi Browser.');
            } else {
                setError(error.message || 'Failed to authenticate with Pi Network');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Create Pi payment for premium features
    const createPiPayment = async (amount, memo) => {
        if (!window.Pi || !isAuthenticated) {
            setError('Please authenticate with Pi Network first');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payment = await window.Pi.createPayment({
                amount: amount,
                memo: memo,
                metadata: { 
                    service: 'ChordyPi Premium',
                    timestamp: Date.now()
                }
            });

            console.log('💳 Pi Payment created:', payment);
            setPiPayment(payment);
            
            // Here you would submit payment to your backend for verification
            // await submitPaymentToBackend(payment);
            
            return payment;
            
        } catch (error) {
            console.error('❌ Pi Payment creation failed:', error);
            setError('Failed to create Pi payment');
        } finally {
            setIsLoading(false);
        }
    };

    // Premium feature: Unlock advanced chord analysis
    const unlockPremiumFeatures = () => {
        createPiPayment(1, 'ChordyPi Premium Access - Advanced Features');
    };

    // Premium feature: Remove ads
    const removeAds = () => {
        createPiPayment(0.5, 'ChordyPi - Remove Advertisements');
    };

    // Show Pi Browser required message if SDK is not available
    if (!isPiAvailable) {
        return (
            <div className="pi-integration-container">
                <div className="pi-not-available">
                    <h3>🥧 Pi Network Integration</h3>
                    <p>To access Pi Network features, please use the <strong>Pi Browser</strong> app.</p>
                    <div className="pi-browser-info">
                        <p>📱 Download Pi Browser from:</p>
                        <ul>
                            <li>Pi Network mobile app</li>
                            <li>Official Pi Network website</li>
                        </ul>
                    </div>
                    <div className="pi-info-footer">
                        <p>🔒 Secure payments powered by Pi Network blockchain</p>
                        <p>💎 Support indie developers with Pi cryptocurrency</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pi-integration-container">
            <div className="pi-header">
                <h3>🥧 Pi Network Integration</h3>
                <div className="pi-status">
                    {isAuthenticated ? (
                        <span className="status-connected">✅ Connected</span>
                    ) : (
                        <span className="status-disconnected">⭕ Not Connected</span>
                    )}
                </div>
            </div>
            
            {/* Show info banner about Pi Browser - informational only */}
            {!isPiBrowser && (
                <div className="pi-browser-info-banner" style={{
                    background: 'linear-gradient(135deg, rgba(123,97,255,0.2) 0%, rgba(255,106,136,0.2) 100%)',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '15px',
                    color: '#333',
                    textAlign: 'center',
                    border: '1px solid rgba(123,97,255,0.3)'
                }}>
                    <p style={{ margin: '0', fontSize: '13px' }}>
                        💡 For the best experience, use the official <strong>Pi Browser</strong> app
                    </p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <span>⚠️ {error}</span>
                    <button 
                        className="error-dismiss"
                        onClick={() => setError(null)}
                        aria-label="Dismiss error"
                    >
                        ✕
                    </button>
                </div>
            )}

            {!isAuthenticated ? (
                <div className="pi-auth-section">
                    <p>Connect your Pi Network account to sign in securely!</p>
                    <p className="pi-auth-hint">📱 You'll be asked to allow ChordyPi to access your Pi username</p>
                    
                    <button 
                        className="pi-auth-button"
                        onClick={handlePiAuth}
                        disabled={isLoading}
                    >
                        {isLoading ? '🔄 Connecting...' : '🥧 Sign in with Pi Network'}
                    </button>
                    
                    <div className="pi-auth-benefits">
                        <p><strong>Why Pi Network?</strong></p>
                        <ul>
                            <li>🔒 Secure blockchain authentication</li>
                            <li>⚡ One-click sign in</li>
                            <li>💰 Pay for premium features with Pi</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="pi-user-section">
                    <div className="pi-user-info">
                        <h4>👤 Welcome, {piUser?.username || 'Pi User'}!</h4>
                        <p>Your Pi Network account is connected.</p>
                    </div>

                    <div className="pi-premium-features">
                        <h4>🌟 Premium Features</h4>
                        
                        <div className="premium-option">
                            <div className="feature-info">
                                <h5>🎸 Advanced Chord Analysis</h5>
                                <p>Unlock AI-powered chord recognition, key detection, and professional chord progressions.</p>
                                <span className="pi-price">1 π</span>
                            </div>
                            <button 
                                className="pi-payment-button premium"
                                onClick={unlockPremiumFeatures}
                                disabled={isLoading}
                            >
                                {isLoading ? '⏳' : '🚀 Upgrade'}
                            </button>
                        </div>

                        <div className="premium-option">
                            <div className="feature-info">
                                <h5>🚫 Remove Advertisements</h5>
                                <p>Enjoy an ad-free experience while learning guitar chords.</p>
                                <span className="pi-price">0.5 π</span>
                            </div>
                            <button 
                                className="pi-payment-button ads"
                                onClick={removeAds}
                                disabled={isLoading}
                            >
                                {isLoading ? '⏳' : '✨ Remove Ads'}
                            </button>
                        </div>
                    </div>

                    {piPayment && (
                        <div className="pi-payment-status">
                            <h4>💳 Payment Status</h4>
                            <div className="payment-info">
                                <p><strong>Amount:</strong> {piPayment.amount} π</p>
                                <p><strong>Status:</strong> {piPayment.status}</p>
                                <p><strong>Transaction ID:</strong> {piPayment.identifier}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="pi-info-footer">
                <p>🔒 Secure payments powered by Pi Network blockchain</p>
                <p>💎 Support indie developers with Pi cryptocurrency</p>
            </div>
        </div>
    );
};

export default PiNetworkIntegration;
