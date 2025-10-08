import React, { createContext, useState, useEffect } from 'react';
import piNetworkService from '../services/piNetworkService';

export const PiNetworkContext = createContext();

export const PiNetworkProvider = ({ children }) => {
    // Get user from localStorage directly instead of AuthContext
    const [user, setUser] = useState(null);
    const [piUser, setPiUser] = useState(null);
    const [isPiConnected, setIsPiConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [premiumFeatures, setPremiumFeatures] = useState({
        advancedAnalysis: false,
        adFree: false,
        premiumLibrary: false,
        prioritySupport: false
    });
    
    // Check for user in localStorage
    useEffect(() => {
        const checkUser = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        
        checkUser();
        // Check periodically for changes (every 30 seconds to avoid re-render storm)
        const interval = setInterval(checkUser, 30000);
        return () => clearInterval(interval);
    }, []);
    
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [paymentInProgress, setPaymentInProgress] = useState(null);
    const [analytics, setAnalytics] = useState(null);

    // Initialize Pi Network on mount
    useEffect(() => {
        initializePiNetwork();
    }, []);

    // Load user data when Pi connection changes
    useEffect(() => {
        if (isPiConnected) {
            loadUserData();
        }
    }, [isPiConnected, user]);

    const initializePiNetwork = async () => {
        try {
            // Check for existing Pi connection
            const storedUser = piNetworkService.getStoredPiUser();
            const isAuthenticated = piNetworkService.isAuthenticated();
            
            if (storedUser && isAuthenticated) {
                setPiUser(storedUser);
                setIsPiConnected(true);
                console.log('🥧 Restored Pi Network connection:', storedUser.username);
            }

            // Initialize Pi SDK if available
            if (piNetworkService.isPiAvailable()) {
                await piNetworkService.initializePi();
            }

            // Load premium features and payment history
            await loadUserData();
            updateAnalytics();

        } catch (error) {
            console.error('Failed to initialize Pi Network:', error);
            setError(error.message);
        }
    };

    const loadUserData = async () => {
        try {
            // Load premium features
            const features = user?.id 
                ? await piNetworkService.getUserPremiumFeatures(user.id)
                : piNetworkService.getLocalPremiumFeatures();
            
            setPremiumFeatures(features);

            // Load payment history
            const history = user?.id
                ? await piNetworkService.getPaymentHistory(user.id)
                : piNetworkService.getLocalPaymentHistory();
            
            setPaymentHistory(history);

            console.log('📊 Pi Network user data loaded');
        } catch (error) {
            console.error('Failed to load Pi user data:', error);
            // Use local data as fallback
            setPremiumFeatures(piNetworkService.getLocalPremiumFeatures());
            setPaymentHistory(piNetworkService.getLocalPaymentHistory());
        }
    };

    const connectPiNetwork = async () => {
        if (!piNetworkService.isPiAvailable()) {
            throw new Error('Pi Network SDK not available. Please use Pi Browser.');
        }

        setLoading(true);
        setError(null);

        try {
            const auth = await piNetworkService.authenticateUser((payment) => {
                console.log('💰 Incomplete payment found:', payment);
                setPaymentInProgress(payment);
            });

            setPiUser(auth.user);
            setIsPiConnected(true);

            // Load user data after connection
            await loadUserData();
            updateAnalytics();

            console.log('✅ Pi Network connected successfully');
            return auth;

        } catch (error) {
            console.error('❌ Pi Network connection failed:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const disconnectPiNetwork = () => {
        try {
            // Clear all Pi Network data
            piNetworkService.clearPiNetworkData();
            
            // Reset state
            setPiUser(null);
            setIsPiConnected(false);
            setPremiumFeatures({
                advancedAnalysis: false,
                adFree: false,
                premiumLibrary: false,
                unlimitedSongs: false,
                offlineMode: false,
                annualSubscription: false
            });
            setPaymentHistory([]);
            setPaymentInProgress(null);
            setAnalytics(null);
            setError(null);

            console.log('🥧 Pi Network disconnected');
        } catch (error) {
            console.error('Failed to disconnect Pi Network:', error);
            setError(error.message);
        }
    };

    const createPayment = async (featureKey, amount, memo) => {
        if (!isPiConnected) {
            throw new Error('Please connect to Pi Network first');
        }

        setLoading(true);
        setError(null);

        try {
            // Validate amount
            const expectedAmount = piNetworkService.getPremiumFeaturePrice(featureKey);
            if (!piNetworkService.validatePaymentAmount(amount, expectedAmount)) {
                throw new Error(`Invalid payment amount. Expected ${expectedAmount} π`);
            }

            const payment = await piNetworkService.createPayment(
                amount,
                memo,
                {
                    feature: featureKey,
                    userId: user?.id,
                    piUsername: piUser?.username
                }
            );

            setPaymentInProgress(payment);

            // Save payment to history
            const featureName = getFeatureName(featureKey);
            piNetworkService.savePaymentToHistory(payment, featureKey, featureName);
            
            // Refresh payment history
            const updatedHistory = piNetworkService.getLocalPaymentHistory();
            setPaymentHistory(updatedHistory);

            // In a real app, you'd wait for backend confirmation
            // For demo, simulate payment completion
            setTimeout(async () => {
                await unlockPremiumFeature(featureKey, payment.identifier);
                setPaymentInProgress(null);
                updateAnalytics();
            }, 3000);

            console.log('💳 Pi payment created successfully');
            return payment;

        } catch (error) {
            console.error('❌ Pi payment creation failed:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const unlockPremiumFeature = async (featureKey, paymentId = null) => {
        try {
            const result = await piNetworkService.unlockPremiumFeature(
                user?.id || 'anonymous',
                featureKey,
                paymentId
            );

            // Update local state
            const newFeatures = { ...premiumFeatures, [featureKey]: true };
            setPremiumFeatures(newFeatures);

            console.log(`✅ Premium feature ${featureKey} unlocked!`);
            return result;

        } catch (error) {
            console.error('❌ Failed to unlock premium feature:', error);
            setError(error.message);
            throw error;
        }
    };

    const isFeatureUnlocked = (featureKey) => {
        return premiumFeatures[featureKey] === true;
    };

    const getFeatureName = (featureKey) => {
        const featureNames = {
            advancedAnalysis: 'Advanced Song Analysis',
            adFree: 'Ad-Free Experience',
            premiumLibrary: 'Premium Song Library',
            unlimitedSongs: 'Unlimited Song Analysis',
            offlineMode: 'Offline Mode',
            annualSubscription: 'Annual Premium Subscription'
        };
        
        return featureNames[featureKey] || featureKey;
    };

    const updateAnalytics = () => {
        const analyticsData = piNetworkService.getAnalyticsData();
        setAnalytics(analyticsData);
    };

    const refreshUserData = async () => {
        setLoading(true);
        try {
            await loadUserData();
            updateAnalytics();
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    // Get environment info for debugging
    const getEnvironmentInfo = () => {
        return piNetworkService.getEnvironmentInfo();
    };

    // Check if Pi Network is available
    const isPiAvailable = () => {
        return piNetworkService.isPiAvailable();
    };

    // Format Pi amount for display
    const formatPiAmount = (amount) => {
        return piNetworkService.formatPiAmount(amount);
    };

    const contextValue = {
        // State
        piUser,
        isPiConnected,
        loading,
        error,
        premiumFeatures,
        paymentHistory,
        paymentInProgress,
        analytics,
        
        // Actions
        connectPiNetwork,
        disconnectPiNetwork,
        createPayment,
        unlockPremiumFeature,
        isFeatureUnlocked,
        refreshUserData,
        clearError,
        
        // Utilities
        getEnvironmentInfo,
        isPiAvailable,
        formatPiAmount,
        getFeatureName,
        
        // Service access
        piNetworkService
    };

    return (
        <PiNetworkContext.Provider value={contextValue}>
            {children}
        </PiNetworkContext.Provider>
    );
};

// Custom hook to use Pi Network context
export const usePiNetwork = () => {
    const context = useContext(PiNetworkContext);
    if (!context) {
        throw new Error('usePiNetwork must be used within a PiNetworkProvider');
    }
    return context;
};