import React, { useState, useEffect } from 'react';
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
    
    // Reset state on mount to handle navigation errors and clear corrupted SDK state
    useEffect(() => {
        console.log('🔄 PiNetworkIntegration component mounted/remounted');
        
        // Clear any corrupted state
        setError(null);
        setIsLoading(false);
        
        // CRITICAL: Clear any Pi SDK cached state from browser storage
        // This fixes the persistent "Error_blocked_by_Response" issue
        try {
            // Clear any Pi-related localStorage items
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.toLowerCase().includes('pi') || key.toLowerCase().includes('minepi'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => {
                console.log('🧹 Clearing localStorage key:', key);
                localStorage.removeItem(key);
            });
            
            // Clear sessionStorage as well
            const sessionKeysToRemove = [];
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && (key.toLowerCase().includes('pi') || key.toLowerCase().includes('minepi'))) {
                    sessionKeysToRemove.push(key);
                }
            }
            sessionKeysToRemove.forEach(key => {
                console.log('🧹 Clearing sessionStorage key:', key);
                sessionStorage.removeItem(key);
            });
            
            console.log('✅ Browser storage cleanup complete');
            
            // Force SDK to reinitialize
            setSdkInitialized(false);
            
        } catch (storageError) {
            console.warn('⚠️ Could not clear browser storage:', storageError);
        }
    }, []);

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
            console.log('🔍 window.Pi object:', window.Pi);
            console.log('🔍 window.Pi.init type:', typeof window.Pi.init);
            
            // Check if init method exists
            if (!window.Pi.init) {
                console.error('❌ window.Pi.init is not a function!');
                setError('Pi SDK init method not available. SDK may not be loaded correctly.');
                return false;
            }
            
            // Get environment variables safely (Vite uses import.meta.env)
            let environment = 'sandbox'; // Default to sandbox
            let hasApiKey = false;
            
            try {
                const piApiKey = import.meta?.env?.VITE_PI_API_KEY || 
                                import.meta?.env?.VITE_PI_NETWORK_API_KEY;
                environment = import.meta?.env?.VITE_PI_ENVIRONMENT || 'sandbox';
                hasApiKey = !!piApiKey;
            } catch (envError) {
                console.warn('⚠️ Could not read env variables, using defaults:', envError.message);
            }
            
            console.log('🔧 Pi SDK Config:', {
                environment,
                hasApiKey,
                version: "2.0",
                sandbox: environment === 'sandbox'
            });
            
            // Initialize Pi SDK - Try simplified initialization first
            console.log('🔄 Calling window.Pi.init({ version: "2.0" })...');
            
            try {
                // Method 1: Simple initialization (recommended for Pi Browser)
                const initResult = await window.Pi.init({ version: "2.0" });
                console.log('✅ Pi Network SDK initialized (simple mode):', initResult);
            } catch (simpleError) {
                console.warn('⚠️ Simple init failed, trying with sandbox flag:', simpleError);
                console.warn('⚠️ Error message:', simpleError.message);
                console.warn('⚠️ Error stack:', simpleError.stack);
                
                // Method 2: With sandbox flag
                const initResult = await window.Pi.init({
                    version: "2.0",
                    sandbox: true // Always use sandbox for testing
                });
                console.log('✅ Pi Network SDK initialized (sandbox mode):', initResult);
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
        console.log('🔍 Window.Pi methods:', Object.keys(window.Pi || {}));
        
        if (!window.Pi) {
            setError('Pi SDK not available. Please open this app in Pi Browser.');
            return;
        }
        
        setIsLoading(true);
        setError(null);

        try {
            // ALWAYS initialize SDK first
            if (!sdkInitialized) {
                console.log('⚙️ Initializing Pi SDK before authentication...');
                try {
                    await window.Pi.init({ version: "2.0" });
                    console.log('✅ Pi SDK initialized successfully');
                    setSdkInitialized(true);
                } catch (initError) {
                    console.error('❌ Pi SDK init failed:', initError);
                    throw new Error(`Failed to initialize Pi SDK: ${initError.message}`);
                }
            }
            
            console.log('🔐 Calling Pi.authenticate...');
            
            // Now authenticate
            const authPromise = window.Pi.authenticate(
                ['username', 'payments'],
                (payment) => {
                    console.log('💰 Incomplete payment found:', payment);
                    setPiPayment(payment);
                }
            );
            
            console.log('⏳ Waiting for Pi Browser permission dialog...');
            console.log('💡 If the dialog doesn\'t appear, your domain may not be verified yet.');
            
            // Increase timeout to 60 seconds to allow for domain verification delays
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => {
                    reject(new Error('Authentication timed out. Possible reasons:\n1. Domain not verified in Pi Developer Portal\n2. App not submitted for review\n3. Pi Browser permission dialog blocked'));
                }, 60000)
            );
            
            const auth = await Promise.race([authPromise, timeoutPromise]);

            console.log('✅ Pi Authentication successful!');
            console.log('✅ Auth object:', JSON.stringify(auth, null, 2));
            console.log('✅ User data:', auth.user);
            
            setPiUser(auth.user);
            setIsAuthenticated(true);
            
            // Call the parent callback if provided
            if (onAuthSuccess) {
                console.log('📞 Calling onAuthSuccess callback with user:', auth.user);
                onAuthSuccess(auth.user);
            } else {
                console.warn('⚠️ No onAuthSuccess callback provided');
            }
            
        } catch (error) {
            console.error('❌ Pi Authentication failed:', error);
            console.error('❌ Error type:', error.constructor.name);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error stack:', error.stack);
            
            // Handle specific error types
            if (error.message && error.message.includes('Error_blocked_by_Response')) {
                setError('Navigation error detected. Please refresh the page and try again.');
                // Reset state
                setSdkInitialized(false);
            } else if (error.message && (error.message.includes('declined') || error.message.includes('denied'))) {
                setError('Authentication declined. Please allow access to continue.');
            } else if (error.message && error.message.includes('timeout')) {
                setError(error.message);
            } else if (error.message && error.message.includes('blocked')) {
                setError('Request blocked. Please refresh the page and try again.');
                setSdkInitialized(false);
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
        createPiPayment(0.000095493, 'ChordyPi Premium Access - Advanced Features');
    };

    // Premium feature: Remove ads
    const removeAds = () => {
        createPiPayment(0.0000477466, 'ChordyPi - Remove Advertisements');
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
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button 
                            className="error-dismiss"
                            onClick={() => setError(null)}
                            aria-label="Dismiss error"
                        >
                            ✕ Dismiss
                        </button>
                        {(error.includes('blocked') || error.includes('refresh')) && (
                            <button 
                                className="error-dismiss"
                                onClick={() => window.location.reload()}
                                style={{ background: '#4CAF50' }}
                            >
                                🔄 Refresh Page
                            </button>
                        )}
                    </div>
                </div>
            )}

            {!isAuthenticated ? (
                <div className="pi-auth-section">
                    <p>Connect your Pi Network account to sign in securely!</p>
                    <p className="pi-auth-hint">📱 You'll be asked to allow ChordyPi to access your Pi username</p>
                    
                    {!isPiAvailable && (
                        <div className="pi-warning" style={{
                            background: '#fff3cd',
                            color: '#856404',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            fontSize: '14px'
                        }}>
                            ⚠️ <strong>Important:</strong> This app must be opened in the official Pi Browser app to use Pi Network authentication.
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        <button 
                            className="pi-auth-button"
                            onClick={handlePiAuth}
                            disabled={isLoading}
                        >
                            {isLoading ? '🔄 Connecting...' : '🥧 Sign in with Pi Network'}
                        </button>
                        
                        {!isLoading && sdkInitialized && (
                            <button 
                                className="pi-auth-button"
                                onClick={() => {
                                    setSdkInitialized(false);
                                    setError(null);
                                    console.log('🔄 SDK state reset');
                                }}
                                style={{ background: '#FF9800', fontSize: '14px' }}
                            >
                                🔧 Reset SDK
                            </button>
                        )}
                    </div>
                    
                    {isLoading && (
                        <>
                            <div style={{
                                background: '#e3f2fd',
                                color: '#1976d2',
                                padding: '12px',
                                borderRadius: '8px',
                                marginTop: '10px',
                                fontSize: '14px',
                                textAlign: 'left'
                            }}>
                                <strong>⏳ Waiting for permission dialog...</strong>
                                <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
                                    If the Pi Browser permission dialog doesn't appear:
                                </p>
                                <ul style={{ margin: '8px 0 0 20px', fontSize: '13px' }}>
                                    <li>Make sure your app is submitted in Pi Developer Portal</li>
                                    <li>Verify the domain is approved (may take 5-10 minutes)</li>
                                    <li>Try refreshing the page</li>
                                </ul>
                            </div>
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
                        </>
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
                        <h4>🌟 Choose Your Experience</h4>
                        
                        {/* Free Option with Ads */}
                        <div className="premium-option" style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: '2px solid #667eea'
                        }}>
                            <div className="feature-info">
                                <h5>🆓 Use Free (with ads)</h5>
                                <p>Access all basic features with advertisement support.</p>
                                <span className="pi-price" style={{ color: '#fff' }}>FREE</span>
                            </div>
                            <button 
                                className="pi-payment-button free"
                                onClick={() => {
                                    console.log('User chose free version with ads');
                                    if (onAuthSuccess) {
                                        onAuthSuccess(piUser);
                                    }
                                }}
                                style={{
                                    background: '#fff',
                                    color: '#667eea',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✅ Continue Free
                            </button>
                        </div>
                        
                        <div className="premium-option">
                            <div className="feature-info">
                                <h5>🎸 Advanced Chord Analysis</h5>
                                <p>Unlock AI-powered chord recognition, key detection, and professional chord progressions.</p>
                                <span className="pi-price">0.000095493 π</span>
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
                                <span className="pi-price">0.0000477466 π</span>
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
