import React, { useState, useEffect } from 'react';
import './PiNetworkIntegration.css';

const PiNetworkIntegration = ({ onAuthSuccess, authMode = false, onClose }) => {
    // Check for existing Pi user in localStorage on mount
    const existingPiUser = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('piNetworkUser') || 'null')
        : null;
    
    const [piUser, setPiUser] = useState(existingPiUser);
    const [piPayment, setPiPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!existingPiUser); // If user exists in localStorage, consider authenticated
    const [sdkInitialized, setSdkInitialized] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    // Check if payment scope was granted in previous session
    const existingPaymentScope = typeof window !== 'undefined' 
        ? localStorage.getItem('piPaymentScope') === 'true'
        : false;
    const [hasPaymentScope, setHasPaymentScope] = useState(existingPaymentScope);

    // Check if Pi SDK is available (non-blocking check only)
    const [isPiAvailable, setIsPiAvailable] = useState(typeof window !== 'undefined' && !!window.Pi);
    
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

    // Check for Pi SDK availability on mount and periodically
    useEffect(() => {
        const checkPiSDK = () => {
            const available = typeof window !== 'undefined' && !!window.Pi;
            setIsPiAvailable(available);
            if (available) {
                console.log('✅ Pi SDK detected and available');
            } else {
                console.log('⚠️ Pi SDK not yet available, will retry...');
            }
            return available;
        };

        // Initial check
        checkPiSDK();

        // Retry every 500ms for up to 5 seconds if SDK not found
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(() => {
            attempts++;
            if (checkPiSDK() || attempts >= maxAttempts) {
                clearInterval(interval);
                if (attempts >= maxAttempts && !window.Pi) {
                    console.error('❌ Pi SDK not loaded after 5 seconds');
                    setError('Pi SDK not loaded. Please refresh the page or make sure you are using Pi Browser.');
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Auto-initialize SDK if user is already authenticated from previous session
    useEffect(() => {
        const autoInitialize = async () => {
            if (isAuthenticated && !sdkInitialized && isPiAvailable) {
                console.log('🔄 Auto-initializing Pi SDK for returning user...');
                await initializePi();
            }
        };
        
        autoInitialize();
    }, []); // Run once on mount

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
            
            // FORCE SANDBOX MODE FOR TESTNET APP TESTING
            // Change this to false when switching to Mainnet app
            const useSandbox = true;
            const environment = useSandbox ? 'sandbox (testnet)' : 'production (mainnet)';
            
            console.log(`🌍 Environment: ${environment}`);
            console.log(`🔧 Sandbox mode: ${useSandbox}`);
            
            // Initialize Pi SDK - fast, non-blocking
            await window.Pi.init({
                version: "2.0",
                sandbox: useSandbox // TRUE = Testnet, FALSE = Mainnet
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
            // Check if Pi SDK is available first
            if (!window.Pi) {
                throw new Error('Pi SDK not available. Please make sure you are using Pi Browser.');
            }

            console.log('🔐 Starting Pi Network authentication...');
            console.log('🔍 User Agent:', navigator.userAgent);
            console.log('🔍 Window.Pi available:', !!window.Pi);
            console.log('🔍 Window.Pi.authenticate available:', !!window.Pi.authenticate);
            console.log('🔍 Is Pi Browser detected:', isPiBrowser);
            
            // Initialize SDK first if needed
            if (!sdkInitialized) {
                console.log('🔧 Initializing Pi SDK...');
                const initialized = await initializePi();
                if (!initialized) {
                    throw new Error('Failed to initialize Pi SDK');
                }
                console.log('✅ Pi SDK initialized successfully');
            }
            
            // Log warning if not detected as Pi Browser
            if (!isPiBrowser) {
                console.warn('⚠️ Pi Browser not detected in user agent');
            }
            
            console.log('⏳ Calling window.Pi.authenticate()...');
            console.log('📋 Scopes requested: username, payments');
            
            // Call Pi authenticate - this should trigger the native dialog
            const auth = await window.Pi.authenticate(
                ['username', 'payments'],
                function onIncompletePaymentFound(payment) {
                    console.log('💰 Incomplete payment found:', payment);
                    setPiPayment(payment);
                }
            );
            
            console.log('🎉 Authentication response received:', auth);
            console.log('✅ Pi Authentication successful!');
            console.log('📋 Scopes granted:', auth.scopes || 'N/A');
            
            setPiUser(auth.user);
            setIsAuthenticated(true);
            
            // Check if payments scope was granted
            const paymentsGranted = auth.scopes && auth.scopes.includes('payments');
            setHasPaymentScope(paymentsGranted);
            console.log(`💳 Payments scope granted: ${paymentsGranted}`);
            
            // Save auth data to localStorage with scopes info
            if (typeof window !== 'undefined') {
                localStorage.setItem('piNetworkUser', JSON.stringify(auth.user));
                localStorage.setItem('piPaymentScope', paymentsGranted ? 'true' : 'false');
            }
            
            // Call the parent callback if provided
            if (onAuthSuccess) {
                onAuthSuccess(auth.user);
            }
            
        } catch (error) {
            console.error('❌ Pi Authentication failed:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                type: error.constructor.name
            });
            
            // Handle specific error types
            let errorMessage = 'Failed to authenticate with Pi Network. ';
            
            if (error.message && error.message.includes('every is not a function')) {
                errorMessage += 'SDK initialization error. Please refresh the page.';
            } else if (error.message && error.message.includes('declined')) {
                errorMessage += 'You declined the authentication request.';
            } else if (error.message && error.message.includes('not available')) {
                errorMessage += 'Please make sure you are using Pi Browser.';
            } else if (error.message && error.message.includes('postMessage')) {
                errorMessage += 'Connection error. Please update Pi Browser.';
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Unknown error occurred.';
            }
            
            setError(errorMessage);
            alert(`❌ ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Create Pi payment for premium features
    const createPiPayment = async (amount, memo) => {
        console.log('💳 createPiPayment called with:', { amount, memo });
        
        if (!window.Pi) {
            console.error('❌ window.Pi not available');
            const errorMsg = 'Pi SDK not available. Please refresh the page.';
            setError(errorMsg);
            alert(`❌ ${errorMsg}`);
            return;
        }
        
        // Check if user is authenticated
        if (!isAuthenticated) {
            console.error('❌ User not authenticated');
            const errorMsg = 'Please connect with Pi Network first';
            setError(errorMsg);
            alert(`❌ ${errorMsg}\n\nClick "Connect with Pi Network" to continue.`);
            return;
        }
        
        // If payment scope not confirmed, try to re-authenticate to get it
        if (!hasPaymentScope) {
            console.warn('⚠️ Payment scope not confirmed, attempting to re-authenticate...');
            try {
                // Re-authenticate to ensure we have payment scope
                const auth = await window.Pi.authenticate(
                    ['username', 'payments'],
                    function onIncompletePaymentFound(payment) {
                        console.log('💰 Incomplete payment found:', payment);
                        setPiPayment(payment);
                    }
                );
                
                // Check if payments scope was granted
                const paymentsGranted = auth.scopes && auth.scopes.includes('payments');
                setHasPaymentScope(paymentsGranted);
                
                if (!paymentsGranted) {
                    throw new Error('Payments permission was not granted. Please approve payments when prompted.');
                }
                
                console.log('✅ Payment scope confirmed');
            } catch (authError) {
                console.error('❌ Failed to get payment scope:', authError);
                setError('Please grant payments permission to continue');
                alert(`❌ Payment Permission Required\n\nPlease approve the payments permission when prompted by Pi Browser.`);
                return;
            }
        }

        setIsLoading(true);
        setError(null);
        
        // Show visual feedback
        alert(`💰 Creating payment for ${amount} π...\n\nPi Browser will show the payment dialog next.`);

        try {
            // Initialize SDK if not already done
            if (!sdkInitialized) {
                console.log('🔧 Initializing Pi SDK before payment...');
                await initializePi();
            }
            
            console.log(`💰 Creating Pi payment: ${amount} π for "${memo}"`);
            console.log('📋 Payment details:', {
                amount,
                memo,
                metadata: {
                    service: 'ChordyPi Premium',
                    timestamp: Date.now(),
                    user: piUser?.username
                }
            });
            
            // Check if createPayment method exists
            if (typeof window.Pi.createPayment !== 'function') {
                throw new Error('window.Pi.createPayment is not available. SDK may not be properly initialized.');
            }
            
            // Log SDK state for debugging
            alert(`🔍 SDK Debug Info:\n\n` +
                  `✅ SDK Initialized: ${sdkInitialized}\n` +
                  `✅ User Authenticated: ${isAuthenticated}\n` +
                  `✅ Username: ${piUser?.username || 'N/A'}\n` +
                  `✅ createPayment available: Yes\n\n` +
                  `Now calling Pi Browser payment API...`);
            
            // Add timeout to detect hanging payment
            const paymentPromise = window.Pi.createPayment({
                amount: amount,
                memo: memo,
                metadata: { 
                    service: 'ChordyPi Premium',
                    timestamp: Date.now(),
                    user: piUser?.username
                }
            });
            
            // Show a message after 3 seconds if still waiting
            const warningTimeout = setTimeout(() => {
                alert('⏰ Payment request is taking longer than expected...\n\n' +
                      'This usually means:\n' +
                      '1. Payments not enabled in Pi Developer Portal\n' +
                      '2. Testnet app needs payment configuration\n' +
                      '3. Waiting for Pi Network approval\n\n' +
                      'For hackathon: You can show judges the working authentication and explain payments are pending Pi Network approval.');
            }, 3000);
            
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    clearTimeout(warningTimeout);
                    reject(new Error('❌ Payment Request Timeout\n\n' +
                                   'The payment dialog did not appear after 30 seconds.\n\n' +
                                   'NEXT STEPS:\n' +
                                   '1. Go to Pi Developer Portal (develop.pi)\n' +
                                   '2. Open Testnet app settings\n' +
                                   '3. Enable "Payments" feature\n' +
                                   '4. Configure wallet address\n' +
                                   '5. Save and wait 5-10 minutes\n\n' +
                                   'For immediate demo: Show authentication working!'));
                }, 30000);
            });
            
            const payment = await Promise.race([paymentPromise, timeoutPromise]);
            clearTimeout(warningTimeout);

            console.log('✅ Pi Payment created successfully:', payment);
            console.log('💳 Payment ID:', payment.identifier);
            setPiPayment(payment);
            
            // Show success message
            alert(`🎉 Payment Successful!\n\nPayment ID: ${payment.identifier}\nAmount: ${amount} π\n\nThank you for supporting ChordyPi!`);
            
            // Here you would submit payment to your backend for verification
            // await submitPaymentToBackend(payment);
            
            return payment;
            
        } catch (error) {
            console.error('❌ Pi Payment creation failed:', error);
            
            if (error.message && error.message.includes('cancelled')) {
                setError('Payment was cancelled. No charges were made.');
            } else {
                setError(error.message || 'Failed to create Pi payment');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Premium feature: Unlock advanced chord analysis
    const unlockPremiumFeatures = async () => {
        console.log('🚀 Unlock Premium Features button clicked');
        console.log('🔍 isAuthenticated:', isAuthenticated);
        console.log('🔍 piUser:', piUser);
        console.log('🔍 window.Pi available:', !!window.Pi);
        
        // Visual feedback for debugging
        if (!window.Pi) {
            alert('❌ Error: Pi SDK not available. Please refresh the page.');
            return;
        }
        
        if (!isAuthenticated) {
            alert('❌ Error: Not authenticated. Please sign in first.');
            return;
        }
        
        try {
            await createPiPayment(1, 'ChordyPi Premium Access - Advanced Features');
        } catch (error) {
            console.error('Failed to create payment:', error);
            alert(`❌ Payment Error: ${error.message || 'Unknown error'}`);
        }
    };

    // Premium feature: Remove ads
    const removeAds = async () => {
        console.log('🚫 Remove Ads button clicked');
        console.log('🔍 isAuthenticated:', isAuthenticated);
        console.log('🔍 piUser:', piUser);
        
        try {
            await createPiPayment(0.5, 'ChordyPi - Remove Advertisements');
        } catch (error) {
            console.error('Failed to create payment:', error);
        }
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
                    
                    {!isPiAvailable && !isLoading && (
                        <div style={{
                            background: 'rgba(255, 193, 7, 0.2)',
                            border: '2px solid #ffc107',
                            borderRadius: '10px',
                            padding: '15px',
                            marginBottom: '15px',
                            color: '#333'
                        }}>
                            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>⚠️ Pi SDK Not Loaded</p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                                The Pi Network SDK hasn't loaded yet. This usually means:
                            </p>
                            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px' }}>
                                <li>You need to refresh the page</li>
                                <li>You need to use Pi Browser app</li>
                                <li>Network connection issue</li>
                            </ul>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 20px',
                                    background: '#ffc107',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                🔄 Refresh Page
                            </button>
                        </div>
                    )}
                    
                    <button 
                        className="pi-auth-button"
                        onClick={handlePiAuth}
                        disabled={isLoading || !isPiAvailable}
                        style={{
                            opacity: (!isPiAvailable && !isLoading) ? 0.5 : 1,
                            cursor: (!isPiAvailable && !isLoading) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? '🔄 Connecting...' : (isPiAvailable ? '🥧 Sign in with Pi Network' : '⏳ Waiting for Pi SDK...')}
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
                    <div className="pi-user-info" style={{
                        background: 'linear-gradient(135deg, #00ff88 0%, #00cc88 100%)',
                        padding: '20px',
                        borderRadius: '15px',
                        marginBottom: '20px',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
                            ✅ Connected to Pi Network
                        </h4>
                        <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
                            Welcome Pioneer! 👋
                        </p>
                        {piUser?.username && (
                            <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                                @{piUser.username}
                            </p>
                        )}
                    </div>

                    <div className="pi-premium-features">
                        <h4>🌟 Premium Features</h4>
                        <p style={{ fontSize: '13px', marginBottom: '15px', color: '#666' }}>
                            Support ChordyPi and unlock premium features with Pi cryptocurrency!
                        </p>
                        
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
                                {isLoading ? '⏳ Processing...' : '🚀 Upgrade Now'}
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

                        {/* Continue Free Option */}
                        <div className="continue-free-section" style={{
                            marginTop: '25px',
                            paddingTop: '25px',
                            borderTop: '2px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center'
                        }}>
                            <p style={{ 
                                fontSize: '14px', 
                                color: '#b0b0b0', 
                                marginBottom: '15px' 
                            }}>
                                Not ready to upgrade? No problem!
                            </p>
                            <button 
                                className="pi-continue-free-button"
                                onClick={() => {
                                    console.log('👍 User chose to continue with free version');
                                    // Close modal using parent callback
                                    if (onClose) {
                                        onClose();
                                    }
                                }}
                                style={{
                                    background: 'transparent',
                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                    color: '#fff',
                                    padding: '12px 30px',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: 'bold'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                }}
                            >
                                🎸 Continue Free
                            </button>
                            <p style={{ 
                                fontSize: '12px', 
                                color: '#888', 
                                marginTop: '10px' 
                            }}>
                                You can upgrade anytime from your profile
                            </p>
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
