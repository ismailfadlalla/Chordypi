import { useContext } from 'react';
import { PiNetworkContext } from '../context/PiNetworkContext';

// Custom hook to use Pi Network premium features
export const usePremiumFeatures = () => {
    const piNetwork = useContext(PiNetworkContext);
    
    if (!piNetwork) {
        // Return basic functionality if Pi Network is not available
        return {
            // State
            isConnected: false,
            premiumFeatures: {
                advancedAnalysis: false,
                adFree: false,
                premiumLibrary: false,
                unlimitedSongs: false,
                offlineMode: false
            },
            analytics: null,
            loading: false,
            error: null,
            
            // Feature checks
            hasAdvancedAnalysis: () => false,
            hasAdFree: () => false,
            hasPremiumLibrary: () => false,
            hasUnlimitedSongs: () => false,
            hasOfflineMode: () => false,
            
            // Actions
            unlockFeature: async () => { throw new Error('Pi Network not available'); },
            checkFeatureAccess: () => false,
            
            // Utilities
            shouldShowAds: () => true,
            canAnalyzeSong: () => true, // Allow basic analysis
            getAnalysisLimit: () => 10, // Basic daily limit
            formatPiAmount: (amount) => `${amount} π`
        };
    }

    const {
        isPiConnected,
        premiumFeatures,
        analytics,
        loading,
        error,
        unlockPremiumFeature,
        isFeatureUnlocked,
        formatPiAmount,
        createPayment
    } = piNetwork;

    // Feature-specific checks
    const hasAdvancedAnalysis = () => isFeatureUnlocked('advancedAnalysis') || isFeatureUnlocked('annualSubscription');
    const hasAdFree = () => isFeatureUnlocked('adFree') || isFeatureUnlocked('annualSubscription');
    const hasPremiumLibrary = () => isFeatureUnlocked('premiumLibrary') || isFeatureUnlocked('annualSubscription');
    const hasUnlimitedSongs = () => isFeatureUnlocked('unlimitedSongs') || isFeatureUnlocked('annualSubscription');
    const hasOfflineMode = () => isFeatureUnlocked('offlineMode') || isFeatureUnlocked('annualSubscription');
    const hasAnnualSubscription = () => isFeatureUnlocked('annualSubscription');

    // Unlock feature with payment
    const unlockFeature = async (featureKey) => {
        const featurePrices = {
            advancedAnalysis: 1.0,
            adFree: 0.5,
            premiumLibrary: 2.0,
            unlimitedSongs: 1.5,
            offlineMode: 1.0,
            annualSubscription: 1.0
        };

        const featureNames = {
            advancedAnalysis: 'Advanced Song Analysis',
            adFree: 'Ad-Free Experience', 
            premiumLibrary: 'Premium Song Library',
            unlimitedSongs: 'Unlimited Song Analysis',
            offlineMode: 'Offline Mode',
            annualSubscription: 'Annual Premium Subscription'
        };

        const price = featurePrices[featureKey];
        const name = featureNames[featureKey];

        if (!price || !name) {
            throw new Error(`Unknown feature: ${featureKey}`);
        }

        try {
            await createPayment(featureKey, price, `ChordyPi - ${name}`);
        } catch (error) {
            console.error(`Failed to unlock ${featureKey}:`, error);
            throw error;
        }
    };

    // Check if user can access a feature
    const checkFeatureAccess = (featureKey) => {
        return isPiConnected && isFeatureUnlocked(featureKey);
    };

    // Determine if ads should be shown between songs
    const shouldShowAdsBetweenSongs = () => {
        return !hasAdFree() && !hasAnnualSubscription();
    };

    // Determine if ads should be shown
    const shouldShowAds = () => {
        return !hasAdFree() && !hasAnnualSubscription();
    };

    // Check if user can analyze a song (considering limits)
    const canAnalyzeSong = () => {
        if (hasUnlimitedSongs()) {
            return true; // No limits for premium users
        }
        
        // Basic users have daily limits (implement your limit logic here)
        return true; // For now, allow basic analysis
    };

    // Get daily analysis limit
    const getAnalysisLimit = () => {
        if (hasUnlimitedSongs()) {
            return Infinity; // No limit
        }
        return 3; // Basic daily limit (3 songs per day)
    };

    // Get remaining analysis count for today
    const getRemainingAnalysis = () => {
        if (hasUnlimitedSongs()) {
            return Infinity;
        }
        
        // Implement daily usage tracking
        const today = new Date().toDateString();
        const usageKey = `analysis_usage_${today}`;
        const used = parseInt(localStorage.getItem(usageKey) || '0');
        
        return Math.max(0, getAnalysisLimit() - used);
    };

    // Track song analysis usage
    const trackAnalysisUsage = () => {
        if (hasUnlimitedSongs()) {
            return; // No tracking needed for unlimited users
        }

        const today = new Date().toDateString();
        const usageKey = `analysis_usage_${today}`;
        const used = parseInt(localStorage.getItem(usageKey) || '0');
        localStorage.setItem(usageKey, (used + 1).toString());
    };

    // Check if user can access premium songs
    const canAccessPremiumSong = (songId) => {
        return hasPremiumLibrary();
    };

    // Get user's premium status summary
    const getPremiumStatus = () => {
        const unlockedCount = Object.values(premiumFeatures).filter(Boolean).length;
        const totalFeatures = Object.keys(premiumFeatures).length;
        
        return {
            isPremium: unlockedCount > 0,
            unlockedFeatures: unlockedCount,
            totalFeatures: totalFeatures,
            completionPercentage: Math.round((unlockedCount / totalFeatures) * 100),
            nextRecommendedFeature: getNextRecommendedFeature()
        };
    };

    // Get next recommended feature to unlock
    const getNextRecommendedFeature = () => {
        if (!hasAdFree()) return 'adFree';
        if (!hasAdvancedAnalysis()) return 'advancedAnalysis';
        if (!hasUnlimitedSongs()) return 'unlimitedSongs';
        if (!hasPremiumLibrary()) return 'premiumLibrary';
        if (!hasOfflineMode()) return 'offlineMode';
        return null; // All features unlocked
    };

    // Calculate total Pi spent
    const getTotalPiSpent = () => {
        return analytics?.totalSpent || 0;
    };

    // Get feature benefits for display
    const getFeatureBenefits = (featureKey) => {
        const benefits = {
            advancedAnalysis: [
                'Detailed chord progressions',
                'Key signature detection',
                'Scale recommendations',
                'Chord substitution suggestions',
                'Music theory insights',
                'Professional analysis reports'
            ],
            adFree: [
                'No banner advertisements',
                'No video interruptions',
                'Faster page loading',
                'Clean, minimal interface',
                'Uninterrupted learning',
                'Premium user badge'
            ],
            premiumLibrary: [
                '1000+ premium songs',
                'Advanced arrangements',
                'Exclusive artist collaborations',
                'Weekly new additions',
                'High-quality chord charts',
                'Professional transcriptions'
            ],
            unlimitedSongs: [
                'No daily analysis limits',
                'Batch song processing',
                'Save unlimited favorites',
                'Priority processing queue',
                'Export analysis results',
                'API access for developers'
            ],
            offlineMode: [
                'Download songs offline',
                'Offline chord playback',
                'Sync when connected',
                'Data usage savings',
                'Practice anywhere',
                'Offline favorites access'
            ],
            annualSubscription: [
                'All premium features included',
                'One year unlimited access',
                'Best value - only 1 π total',
                'Advanced song analysis',
                'Ad-free experience',
                'Premium song library (1000+)',
                'Unlimited daily analysis',
                'Offline mode & sync',
                'Priority customer support'
            ]
        };

        return benefits[featureKey] || [];
    };

    return {
        // State
        isConnected: isPiConnected,
        premiumFeatures,
        analytics,
        loading,
        error,
        
        // Feature checks
        hasAdvancedAnalysis,
        hasAdFree,
        hasPremiumLibrary,
        hasUnlimitedSongs,
        hasOfflineMode,
        hasAnnualSubscription,
        
        // Actions
        unlockFeature,
        checkFeatureAccess,
        
        // Utilities
        shouldShowAds,
        shouldShowAdsBetweenSongs,
        canAnalyzeSong,
        getAnalysisLimit,
        getRemainingAnalysis,
        trackAnalysisUsage,
        canAccessPremiumSong,
        getPremiumStatus,
        getTotalPiSpent,
        getFeatureBenefits,
        formatPiAmount
    };
};

export default usePremiumFeatures;