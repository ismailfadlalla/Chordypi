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
            
            // Get environment variables (Vite uses import.meta.env)
            const piApiKey = import.meta.env.VITE_PI_API_KEY || 
                            import.meta.env.VITE_PI_NETWORK_API_KEY || 
                            process.env.REACT_APP_PI_API_KEY;
            const environment = import.meta.env.VITE_PI_ENVIRONMENT || 
                               process.env.REACT_APP_PI_ENVIRONMENT || 
                               'sandbox';
            
            console.log('🔧 Pi SDK Config:', {
                environment,
                hasApiKey: !!piApiKey,
                version: "2.0",
                sandbox: environment === 'sandbox'
            });
            
            // Initialize Pi SDK - Try simplified initialization first
            try {
                // Method 1: Simple initialization
                await window.Pi.init({ version: "2.0" });
                console.log(`✅ Pi Network SDK initialized (simple mode)`);
            } catch (simpleError) {
                console.warn('⚠️ Simple init failed, trying with sandbox flag:', simpleError.message);
                // Method 2: With sandbox flag
                await window.Pi.init({
                    version: "2.0",
                    sandbox: environment === 'sandbox'
                });
                console.log(`✅ Pi Network SDK initialized (${environment} mode)`);
            }
            
            console.log('✅ SDK initialization complete');
            setSdkInitialized(true);
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize Pi SDK:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                type: error.constructor.name
            });
            setError(`Failed to initialize Pi Network: ${error.message || 'Unknown error'}`);
            return false;
        }
    };

    // Authenticate with Pi Network - triggers native Pi permission dialog
    const handlePiAuth = async () => {
        // Debug: Confirm button click
        console.log('🔘 Pi Auth button clicked!');
        console.log('🔍 Window.Pi available:', !!window.Pi);
        console.log('🔍 Window.Pi object:', window.Pi);
        console.log('🔍 SDK initialized:', sdkInitialized);
        
        setIsLoading(true);
        setError(null);

        try {
            // Initialize SDK first if needed
            if (!sdkInitialized) {
                console.log('⚙️ Initializing Pi SDK...');
                const initialized = await initializePi();
                if (!initialized) {
                    setIsLoading(false);
                    return;
                }
            }

            console.log('🔐 Requesting Pi Network authentication...');
            console.log('📋 Authentication params:', {
                scopes: ['username', 'payments'],
                sdkVersion: '2.0',
                timestamp: new Date().toISOString()
            });
            
            // Add timeout to prevent infinite loading
            const authPromise = window.Pi.authenticate(
                ['username', 'payments'],
                (payment) => {
                    console.log('💰 Incomplete payment found:', payment);
                    setPiPayment(payment);
                }
            );
            
            console.log('⏳ Waiting for user to accept permission dialog...');
            
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Authentication timed out after 30 seconds. Please try again.')), 30000)
            );
            
            const auth = await Promise.race([authPromise, timeoutPromise]);

            console.log('✅ Pi Authentication successful:', auth);
            setPiUser(auth.user);
            setIsAuthenticated(true);
            
            // Call the parent callback if provided
            if (onAuthSuccess) {
                onAuthSuccess(auth.user);
            }
            
        } catch (error) {
            console.error('❌ Pi Authentication failed:', error);
            
            // Handle user decline
            if (error.message && error.message.includes('declined')) {
                setError('Authentication declined. Please allow access to continue.');
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
            {/* Debug Info - Remove after testing */}
            <div style={{background: '#ffe0e0', padding: '10px', marginBottom: '10px', fontSize: '12px', borderRadius: '5px'}}>
                <strong>🔧 Debug Info:</strong><br/>
                Pi SDK Available: {isPiAvailable ? '✅ Yes' : '❌ No'}<br/>
                SDK Initialized: {sdkInitialized ? '✅ Yes' : '❌ No'}<br/>
                Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}<br/>
                Loading: {isLoading ? '✅ Yes' : '❌ No'}<br/>
                Error: {error || 'None'}
            </div>
            
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
                    
                    {isLoading && (
                        <button 
                            className="pi-auth-button"
                            onClick={() => {
                                setIsLoading(false);
                                setError('Authentication cancelled. Please try again.');
                            }}
                            style={{ marginTop: '10px', background: '#666' }}
                        >
                            ✕ Cancel
                        </button>
                    )}
                    
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
