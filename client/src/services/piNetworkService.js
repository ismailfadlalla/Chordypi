// Pi Network Service for backend integration
class PiNetworkService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'https://chordypi.onrender.com/api';
        this.piAppId = process.env.REACT_APP_PI_APP_ID || 'chords-legend';
        this.piEnvironment = process.env.REACT_APP_PI_ENVIRONMENT || 'sandbox';
        this.sandboxMode = this.piEnvironment === 'sandbox';
    }

    // Check if Pi Network SDK is available
    isPiAvailable() {
        return typeof window !== 'undefined' && window.Pi;
    }

    // Initialize Pi SDK
    async initializePi() {
        if (!this.isPiAvailable()) {
            throw new Error('Pi Network SDK not available');
        }

        try {
            await window.Pi.init({
                version: "2.0",
                sandbox: this.sandboxMode,
                appId: this.piAppId
            });
            
            console.log(`✅ Pi Network SDK initialized for app: ${this.piAppId} (${this.piEnvironment})`);
            return true;
        } catch (error) {
            console.error('❌ Pi SDK initialization failed:', error);
            throw error;
        }
    }

    // Authenticate with Pi Network
    async authenticateUser(onIncompletePaymentFound = null) {
        if (!this.isPiAvailable()) {
            throw new Error('Pi Network SDK not available');
        }

        try {
            const auth = await window.Pi.authenticate(
                ['username', 'payments'],
                onIncompletePaymentFound || ((payment) => {
                    console.log('💰 Incomplete payment found:', payment);
                })
            );

            console.log('🔐 Pi Authentication successful:', auth);
            
            // Save authentication data
            this.saveAuthData(auth);
            
            return auth;
        } catch (error) {
            console.error('❌ Pi Authentication failed:', error);
            throw error;
        }
    }

    // Create Pi payment
    async createPayment(amount, memo, metadata = {}) {
        if (!this.isPiAvailable()) {
            throw new Error('Pi Network SDK not available');
        }

        try {
            const payment = await window.Pi.createPayment({
                amount: parseFloat(amount),
                memo: memo,
                metadata: {
                    service: 'ChordyPi',
                    timestamp: Date.now(),
                    ...metadata
                }
            });

            console.log('💳 Pi Payment created:', payment);
            
            // Submit payment to backend for verification
            await this.submitPaymentToBackend(payment);
            
            return payment;
        } catch (error) {
            console.error('❌ Pi Payment creation failed:', error);
            throw error;
        }
    }

    // Submit payment to backend for verification
    async submitPaymentToBackend(payment) {
        try {
            const response = await fetch(`${this.baseURL}/api/pi/payments/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'X-Pi-API-Key': this.piAPIKey
                },
                body: JSON.stringify({
                    payment_id: payment.identifier,
                    txid: payment.txid,
                    amount: payment.amount,
                    memo: payment.memo,
                    metadata: payment.metadata,
                    status: payment.status,
                    created_at: payment.createdAt
                })
            });

            if (!response.ok) {
                throw new Error(`Payment verification failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Payment verified by backend:', result);
            
            return result;
        } catch (error) {
            console.error('❌ Backend payment verification failed:', error);
            // Don't throw - allow local verification in demo mode
            return { verified: false, error: error.message };
        }
    }

    // Get user's premium features from backend
    async getUserPremiumFeatures(userId) {
        try {
            const response = await fetch(`${this.baseURL}/api/users/${userId}/premium-features`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'X-Pi-API-Key': this.piAPIKey
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch premium features: ${response.statusText}`);
            }

            const features = await response.json();
            console.log('📋 Premium features loaded:', features);
            
            return features;
        } catch (error) {
            console.error('❌ Failed to load premium features:', error);
            // Return default features for demo mode
            return this.getLocalPremiumFeatures();
        }
    }

    // Unlock premium feature
    async unlockPremiumFeature(userId, feature, paymentId) {
        try {
            const response = await fetch(`${this.baseURL}/api/users/${userId}/premium-features`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'X-Pi-API-Key': this.piAPIKey
                },
                body: JSON.stringify({
                    feature: feature,
                    payment_id: paymentId,
                    unlocked_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to unlock feature: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Premium feature unlocked:', result);
            
            // Also save locally
            this.saveLocalPremiumFeature(feature);
            
            return result;
        } catch (error) {
            console.error('❌ Failed to unlock premium feature:', error);
            // Fallback to local storage
            this.saveLocalPremiumFeature(feature);
            return { feature, unlocked: true, local: true };
        }
    }

    // Get payment history
    async getPaymentHistory(userId, limit = 10) {
        try {
            const response = await fetch(`${this.baseURL}/api/users/${userId}/payments?limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'X-Pi-API-Key': this.piAPIKey
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch payment history: ${response.statusText}`);
            }

            const payments = await response.json();
            console.log('📋 Payment history loaded:', payments);
            
            return payments;
        } catch (error) {
            console.error('❌ Failed to load payment history:', error);
            // Return local payment history
            return this.getLocalPaymentHistory();
        }
    }

    // Save authentication data locally
    saveAuthData(auth) {
        try {
            localStorage.setItem('piNetworkUser', JSON.stringify(auth.user));
            localStorage.setItem('piNetworkAuth', JSON.stringify({
                accessToken: auth.accessToken,
                scopes: auth.scopes,
                authenticatedAt: Date.now()
            }));
        } catch (error) {
            console.error('Failed to save auth data:', error);
        }
    }

    // Get authentication token
    getAuthToken() {
        try {
            const authData = localStorage.getItem('piNetworkAuth');
            if (authData) {
                const auth = JSON.parse(authData);
                return auth.accessToken;
            }
        } catch (error) {
            console.error('Failed to get auth token:', error);
        }
        return null;
    }

    // Save premium feature locally
    saveLocalPremiumFeature(feature) {
        try {
            const features = this.getLocalPremiumFeatures();
            features[feature] = true;
            localStorage.setItem('premiumFeatures', JSON.stringify(features));
        } catch (error) {
            console.error('Failed to save premium feature:', error);
        }
    }

    // Get local premium features
    getLocalPremiumFeatures() {
        try {
            const features = localStorage.getItem('premiumFeatures');
            if (features) {
                return JSON.parse(features);
            }
        } catch (error) {
            console.error('Failed to get local premium features:', error);
        }
        
        // Return default features
        return {
            advancedAnalysis: false,
            adFree: false,
            premiumLibrary: false,
            unlimitedSongs: false,
            offlineMode: false
        };
    }

    // Save payment to local history
    savePaymentToHistory(payment, featureKey, featureName) {
        try {
            const history = this.getLocalPaymentHistory();
            const newPayment = {
                id: payment.identifier,
                txid: payment.txid,
                feature: featureKey,
                featureName: featureName,
                amount: payment.amount,
                status: payment.status,
                createdAt: payment.createdAt || new Date().toISOString()
            };
            
            history.unshift(newPayment); // Add to beginning
            
            // Keep only last 50 payments
            if (history.length > 50) {
                history.splice(50);
            }
            
            localStorage.setItem('piPaymentHistory', JSON.stringify(history));
            
            console.log('💾 Payment saved to local history');
        } catch (error) {
            console.error('Failed to save payment to history:', error);
        }
    }

    // Get local payment history
    getLocalPaymentHistory() {
        try {
            const history = localStorage.getItem('piPaymentHistory');
            if (history) {
                return JSON.parse(history);
            }
        } catch (error) {
            console.error('Failed to get local payment history:', error);
        }
        return [];
    }

    // Clear all Pi Network data
    clearPiNetworkData() {
        try {
            localStorage.removeItem('piNetworkUser');
            localStorage.removeItem('piNetworkAuth');
            localStorage.removeItem('premiumFeatures');
            localStorage.removeItem('piPaymentHistory');
            console.log('🧹 Pi Network data cleared');
        } catch (error) {
            console.error('Failed to clear Pi Network data:', error);
        }
    }

    // Get stored Pi user
    getStoredPiUser() {
        try {
            const userData = localStorage.getItem('piNetworkUser');
            if (userData) {
                return JSON.parse(userData);
            }
        } catch (error) {
            console.error('Failed to get stored Pi user:', error);
        }
        return null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        try {
            const authData = localStorage.getItem('piNetworkAuth');
            if (authData) {
                const auth = JSON.parse(authData);
                // Check if authentication is not older than 24 hours
                const isRecent = Date.now() - auth.authenticatedAt < 24 * 60 * 60 * 1000;
                return isRecent;
            }
        } catch (error) {
            console.error('Failed to check authentication status:', error);
        }
        return false;
    }

    // Validate payment amount for security
    validatePaymentAmount(amount, expectedAmount) {
        const numAmount = parseFloat(amount);
        const numExpected = parseFloat(expectedAmount);
        
        // Allow small floating-point differences
        const difference = Math.abs(numAmount - numExpected);
        return difference < 0.0001;
    }

    // Get Pi Network environment info
    getEnvironmentInfo() {
        return {
            sandboxMode: this.sandboxMode,
            apiAvailable: this.isPiAvailable(),
            authenticated: this.isAuthenticated(),
            user: this.getStoredPiUser()
        };
    }

    // Format Pi amount for display
    formatPiAmount(amount) {
        return `${parseFloat(amount).toFixed(2)} π`;
    }

    // Get premium feature price
    getPremiumFeaturePrice(featureKey) {
        const prices = {
            advancedAnalysis: 1.0,
            adFree: 0.5,
            premiumLibrary: 2.0,
            unlimitedSongs: 1.5,
            offlineMode: 1.0
        };
        
        return prices[featureKey] || 0.0;
    }

    // Check if feature is unlocked
    isFeatureUnlocked(featureKey) {
        const features = this.getLocalPremiumFeatures();
        return features[featureKey] === true;
    }

    // Get analytics data for Pi integration
    getAnalyticsData() {
        const paymentHistory = this.getLocalPaymentHistory();
        const premiumFeatures = this.getLocalPremiumFeatures();
        
        return {
            totalPayments: paymentHistory.length,
            totalSpent: paymentHistory.reduce((sum, payment) => sum + parseFloat(payment.amount), 0),
            unlockedFeatures: Object.values(premiumFeatures).filter(Boolean).length,
            lastPayment: paymentHistory[0]?.createdAt || null,
            mostUsedFeature: this.getMostUsedFeature(paymentHistory)
        };
    }

    // Get most used feature from payment history
    getMostUsedFeature(paymentHistory) {
        if (!paymentHistory.length) return null;
        
        const featureCounts = {};
        paymentHistory.forEach(payment => {
            if (payment.feature) {
                featureCounts[payment.feature] = (featureCounts[payment.feature] || 0) + 1;
            }
        });
        
        return Object.keys(featureCounts).reduce((a, b) => 
            featureCounts[a] > featureCounts[b] ? a : b
        );
    }
}

// Export singleton instance
const piNetworkService = new PiNetworkService();
export default piNetworkService;