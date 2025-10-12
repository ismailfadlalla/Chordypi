import React, { useState, useEffect } from 'react';
import './PiNetworkIntegration.css';

const EnhancedPiNetworkIntegration = () => {
    // Local state instead of context
    const [piUser, setPiUser] = useState(null);
    const [isPiUser, setIsPiUser] = useState(false);
    const [piConnected, setPiConnected] = useState(false);
    const [user, setUser] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Initialize state from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        const piUserData = localStorage.getItem('piNetworkUser');
        
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                setUser(null);
            }
        }
        
        if (piUserData) {
            try {
                setPiUser(JSON.parse(piUserData));
                setIsPiUser(true);
                setPiConnected(true);
            } catch (e) {
                setPiUser(null);
                setIsPiUser(false);
                setPiConnected(false);
            }
        }
    }, []);
    
    // Placeholder functions for Pi Network operations
    const connectPiNetwork = async (piUserData, piAuthData) => {
        try {
            localStorage.setItem('piNetworkUser', JSON.stringify(piUserData));
            localStorage.setItem('piNetworkAuth', JSON.stringify(piAuthData));
            setPiUser(piUserData);
            setIsPiUser(true);
            setPiConnected(true);
        } catch (error) {
            console.error('Failed to connect Pi Network:', error);
        }
    };
    
    const disconnectPiNetwork = () => {
        try {
            localStorage.removeItem('piNetworkUser');
            localStorage.removeItem('piNetworkAuth');
            setPiUser(null);
            setIsPiUser(false);
            setPiConnected(false);
        } catch (error) {
            console.error('Failed to disconnect Pi Network:', error);
        }
    };
    const [paymentInProgress, setPaymentInProgress] = useState(null);
    const [premiumFeatures, setPremiumFeatures] = useState({
        advancedAnalysis: false,
        adFree: false,
        premiumLibrary: false,
        unlimitedSongs: false,
        offlineMode: false,
        annualSubscription: false
    });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);

    // Enhanced premium features with detailed information
    const PREMIUM_FEATURES = {
        advancedAnalysis: {
            name: 'Advanced Song Analysis',
            description: 'Get detailed chord progressions, key signatures, and music theory insights',
            longDescription: 'Unlock professional-level chord analysis with AI-powered recognition, scale suggestions, and chord substitution recommendations.',
            price: 1.0,
            icon: '🎼',
            color: 'gradient-blue',
            benefits: [
                'Detailed chord progressions',
                'Key signature detection', 
                'Scale recommendations',
                'Chord substitution suggestions',
                'Music theory insights',
                'Professional analysis reports'
            ]
        },
        adFree: {
            name: 'Ad-Free Experience',
            description: 'Remove all advertisements and enjoy uninterrupted music learning',
            longDescription: 'Enjoy a clean, distraction-free interface with no ads interrupting your music learning journey.',
            price: 0.5,
            icon: '🚫',
            color: 'gradient-green',
            benefits: [
                'No banner advertisements',
                'No video interruptions', 
                'Faster page loading',
                'Clean, minimal interface',
                'Uninterrupted learning',
                'Premium user badge'
            ]
        },
        premiumLibrary: {
            name: 'Premium Song Library',
            description: 'Access exclusive premium songs and advanced arrangements',
            longDescription: 'Gain access to our curated collection of premium songs with advanced chord arrangements and exclusive content.',
            price: 2.0,
            icon: '🎵',
            color: 'gradient-purple',
            benefits: [
                '1000+ premium songs',
                'Advanced arrangements',
                'Exclusive artist collaborations',
                'Weekly new additions',
                'High-quality chord charts',
                'Professional transcriptions'
            ]
        },
        unlimitedSongs: {
            name: 'Unlimited Song Analysis',
            description: 'Analyze unlimited songs per day without restrictions',
            longDescription: 'Remove all daily limits and analyze as many songs as you want with priority processing.',
            price: 1.5,
            icon: '∞',
            color: 'gradient-orange',
            benefits: [
                'No daily analysis limits',
                'Batch song processing',
                'Save unlimited favorites',
                'Priority processing queue',
                'Export analysis results',
                'API access for developers'
            ]
        },
        offlineMode: {
            name: 'Offline Mode',
            description: 'Download songs and use the app offline',
            longDescription: 'Download your favorite songs and chord charts for offline access, perfect for practice sessions anywhere.',
            price: 1.0,
            icon: '📱',
            color: 'gradient-teal',
            benefits: [
                'Download songs offline',
                'Offline chord playback',
                'Sync when connected',
                'Data usage savings',
                'Practice anywhere',
                'Offline favorites access'
            ]
        },
        annualSubscription: {
            name: 'Annual Premium Subscription',
            description: 'All premium features for one full year',
            longDescription: 'Get access to ALL premium features for an entire year! Best value option with everything included.',
            price: 1.0,
            icon: '👑',
            color: 'gradient-gold',
            benefits: [
                'ALL premium features included',
                'One year unlimited access',
                'Advanced song analysis',
                'Ad-free experience',
                'Premium song library (1000+)',
                'Unlimited daily analysis',
                'Offline mode & sync',
                'Priority customer support',
                'Best value - only 1 π total!'
            ]
        }
    };

    useEffect(() => {
        initializePi();
        loadPremiumFeatures();
        loadPaymentHistory();
    }, []);

    useEffect(() => {
        if (piConnected && piUser) {
            loadPremiumFeatures();
        }
    }, [piConnected, piUser]);

    const initializePi = async () => {
        try {
            if (typeof window !== 'undefined' && window.Pi) {
                console.log('🥧 Pi Network SDK detected');
                
                await window.Pi.init({
                    version: "2.0",
                    sandbox: process.env.REACT_APP_PI_NETWORK_SANDBOX === 'true'
                });
                
                console.log('✅ Pi Network SDK initialized successfully');
            } else {
                console.info('ℹ️ Pi Network SDK not available - requires Pi Browser');
            }
        } catch (error) {
            console.error('❌ Failed to initialize Pi SDK:', error);
            setError('Failed to initialize Pi Network connection');
        }
    };

    const handlePiAuth = async () => {
        if (!window.Pi) {
            setError('Pi Network SDK not available. Please use Pi Browser.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const auth = await window.Pi.authenticate(
                ['username', 'payments'],
                (payment) => {
                    console.log('💰 Incomplete payment found:', payment);
                    setPaymentInProgress(payment);
                }
            );

            console.log('🔐 Pi Authentication successful:', auth);
            
            // Use AuthContext to manage Pi user state
            connectPiNetwork(auth.user, auth);
            
            // Load user's premium features after authentication
            await loadPremiumFeatures();
            
        } catch (error) {
            console.error('❌ Pi Authentication failed:', error);
            setError('Failed to authenticate with Pi Network');
        } finally {
            setLoading(false);
        }
    };

    const handlePiDisconnect = () => {
        disconnectPiNetwork();
        setPremiumFeatures({
            advancedAnalysis: false,
            adFree: false,
            premiumLibrary: false,
            unlimitedSongs: false,
            offlineMode: false
        });
        setPaymentHistory([]);
        setError(null);
    };

    const loadPremiumFeatures = async () => {
        try {
            const savedFeatures = localStorage.getItem('premiumFeatures');
            if (savedFeatures) {
                setPremiumFeatures(JSON.parse(savedFeatures));
            }
            
            // TODO: Load from backend API
            // const response = await api.get('/user/premium-features');
            // setPremiumFeatures(response.data);
        } catch (error) {
            console.error('Failed to load premium features:', error);
        }
    };

    const loadPaymentHistory = () => {
        try {
            const savedHistory = localStorage.getItem('piPaymentHistory');
            if (savedHistory) {
                setPaymentHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error('Failed to load payment history:', error);
        }
    };

    const createPiPayment = async (featureKey, feature) => {
        if (!window.Pi || !piConnected) {
            setError('Please authenticate with Pi Network first');
            return;
        }

        setLoading(true);
        setError(null);
        setSelectedFeature(featureKey);

        try {
            const payment = await window.Pi.createPayment({
                amount: feature.price,
                memo: `ChordyPi - ${feature.name}`,
                metadata: { 
                    service: 'ChordyPi Premium',
                    feature: featureKey,
                    userId: user?.id || 'anonymous',
                    piUsername: piUser?.username,
                    timestamp: Date.now()
                }
            });

            console.log('💳 Pi Payment created:', payment);
            setPaymentInProgress(payment);
            
            // Save payment to history
            const newPayment = {
                id: payment.identifier,
                feature: featureKey,
                featureName: feature.name,
                amount: feature.price,
                status: payment.status,
                createdAt: new Date().toISOString()
            };
            
            const updatedHistory = [...paymentHistory, newPayment];
            setPaymentHistory(updatedHistory);
            localStorage.setItem('piPaymentHistory', JSON.stringify(updatedHistory));
            
            // Simulate payment completion for demo (in real app, this would be handled by backend)
            setTimeout(() => {
                unlockPremiumFeature(featureKey);
                setPaymentInProgress(null);
            }, 3000);
            
            return payment;
            
        } catch (error) {
            console.error('❌ Pi Payment creation failed:', error);
            setError('Failed to create Pi payment. Please try again.');
        } finally {
            setLoading(false);
            setSelectedFeature(null);
        }
    };

    const unlockPremiumFeature = (featureKey) => {
        const newFeatures = { ...premiumFeatures, [featureKey]: true };
        setPremiumFeatures(newFeatures);
        localStorage.setItem('premiumFeatures', JSON.stringify(newFeatures));
        
        // TODO: Update backend
        // await api.post('/user/unlock-feature', { feature: featureKey });
        
        console.log(`✅ ${featureKey} unlocked!`);
    };

    const openPaymentModal = (featureKey) => {
        setSelectedFeature(featureKey);
        setShowPaymentModal(true);
    };

    const closePaymentModal = () => {
        setShowPaymentModal(false);
        setSelectedFeature(null);
    };

    // Pi Browser required message
    if (!window.Pi) {
        return (
            <div className="pi-integration-container">
                <div className="pi-not-available">
                    <div className="pi-header-unavailable">
                        <h3>🥧 Pi Network Integration</h3>
                        <div className="pi-browser-badge">Pi Browser Required</div>
                    </div>
                    
                    <div className="pi-browser-info">
                        <p>To access Pi Network premium features, please use the <strong>Pi Browser</strong> app.</p>
                        
                        <div className="pi-download-steps">
                            <h4>📱 How to get Pi Browser:</h4>
                            <ol>
                                <li>Open your Pi Network mobile app</li>
                                <li>Tap on the browser icon</li>
                                <li>Navigate to ChordyPi</li>
                                <li>Unlock premium features with Pi!</li>
                            </ol>
                        </div>
                        
                        <div className="pi-benefits-preview">
                            <h4>🌟 Available Premium Features:</h4>
                            <div className="features-grid-preview">
                                {Object.entries(PREMIUM_FEATURES).map(([key, feature]) => (
                                    <div key={key} className="feature-preview-card">
                                        <div className="feature-icon">{feature.icon}</div>
                                        <div className="feature-name">{feature.name}</div>
                                        <div className="feature-price">{feature.price} π</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="pi-info-footer">
                        <p>🔒 Secure blockchain payments • 💎 Support independent developers</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pi-integration-container enhanced">
            <div className="pi-header">
                <div className="pi-title-section">
                    <h3>🥧 Pi Network Premium</h3>
                    <div className="pi-status">
                        {piConnected ? (
                            <span className="status-connected">✅ Connected</span>
                        ) : (
                            <span className="status-disconnected">⭕ Connect to unlock</span>
                        )}
                    </div>
                </div>
                
                {piConnected && piUser && (
                    <div className="pi-user-info">
                        <div className="user-details">
                            <span className="username">👤 {piUser.username}</span>
                            <button className="disconnect-btn" onClick={handlePiDisconnect}>
                                Disconnect
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                    <button className="close-error" onClick={() => setError(null)}>×</button>
                </div>
            )}

            {!piConnected ? (
                <div className="pi-auth-section">
                    <div className="auth-content">
                        <h4>🚀 Unlock Premium Features</h4>
                        <p>Connect your Pi Network account to access advanced features and support independent developers!</p>
                        
                        <button 
                            className="pi-auth-button"
                            onClick={handlePiAuth}
                            disabled={loading}
                        >
                            {loading ? (
                                <>🔄 Connecting...</>
                            ) : (
                                <>🔗 Connect Pi Network</>
                            )}
                        </button>
                        
                        <div className="auth-benefits">
                            <h5>Why connect Pi Network?</h5>
                            <ul>
                                <li>🔒 Secure blockchain payments</li>
                                <li>💎 Support independent developers</li>
                                <li>🌟 Unlock premium features</li>
                                <li>📱 Decentralized user control</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="pi-premium-section">
                    {/* Premium Features Grid */}
                    <div className="premium-features-grid">
                        {Object.entries(PREMIUM_FEATURES).map(([key, feature]) => (
                            <div 
                                key={key} 
                                className={`premium-feature-card ${feature.color} ${premiumFeatures[key] ? 'unlocked' : ''}`}
                            >
                                <div className="feature-header">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <div className="feature-status">
                                        {premiumFeatures[key] ? (
                                            <span className="status-unlocked">✅ Unlocked</span>
                                        ) : (
                                            <span className="status-locked">🔒 Locked</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="feature-content">
                                    <h4>{feature.name}</h4>
                                    <p className="feature-description">{feature.description}</p>
                                    
                                    <div className="feature-benefits">
                                        <h5>Benefits:</h5>
                                        <ul>
                                            {feature.benefits.slice(0, 3).map((benefit, index) => (
                                                <li key={index}>{benefit}</li>
                                            ))}
                                        </ul>
                                        {feature.benefits.length > 3 && (
                                            <span className="more-benefits">+{feature.benefits.length - 3} more</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="feature-footer">
                                    <div className="feature-price">{feature.price} π</div>
                                    {!premiumFeatures[key] ? (
                                        <button 
                                            className="unlock-button"
                                            onClick={() => createPiPayment(key, feature)}
                                            disabled={loading || paymentInProgress}
                                        >
                                            {loading && selectedFeature === key ? (
                                                <>⏳ Processing...</>
                                            ) : (
                                                <>🚀 Unlock</>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="unlocked-badge">
                                            ✨ Active
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment in Progress */}
                    {paymentInProgress && (
                        <div className="payment-progress">
                            <div className="progress-content">
                                <h4>💳 Payment in Progress</h4>
                                <div className="payment-details">
                                    <p><strong>Amount:</strong> {paymentInProgress.amount} π</p>
                                    <p><strong>Status:</strong> {paymentInProgress.status}</p>
                                    <p><strong>Transaction:</strong> {paymentInProgress.identifier}</p>
                                </div>
                                <div className="progress-indicator">
                                    <div className="spinner"></div>
                                    <span>Processing payment...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment History */}
                    {paymentHistory.length > 0 && (
                        <div className="payment-history">
                            <h4>📋 Payment History</h4>
                            <div className="history-list">
                                {paymentHistory.slice(-5).reverse().map((payment) => (
                                    <div key={payment.id} className="history-item">
                                        <div className="history-feature">
                                            <span className="feature-icon">
                                                {PREMIUM_FEATURES[payment.feature]?.icon}
                                            </span>
                                            <span className="feature-name">{payment.featureName}</span>
                                        </div>
                                        <div className="history-amount">{payment.amount} π</div>
                                        <div className="history-date">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="pi-info-footer enhanced">
                <div className="footer-content">
                    <div className="footer-section">
                        <h5>🔒 Secure Payments</h5>
                        <p>All transactions secured by Pi Network blockchain</p>
                    </div>
                    <div className="footer-section">
                        <h5>💎 Support Developers</h5>
                        <p>Your Pi helps independent developers create amazing apps</p>
                    </div>
                    <div className="footer-section">
                        <h5>🌟 Premium Experience</h5>
                        <p>Unlock advanced features and ad-free learning</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedPiNetworkIntegration;