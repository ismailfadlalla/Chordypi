import React from 'react';
import usePremiumFeatures from '../../hooks/usePremiumFeatures';
import './UsageTracker.css';

const UsageTracker = ({ compact = false }) => {
    const {
        hasUnlimitedSongs,
        hasAnnualSubscription,
        getAnalysisLimit,
        getRemainingAnalysis,
        unlockFeature,
        formatPiAmount
    } = usePremiumFeatures();

    const limit = getAnalysisLimit();
    const remaining = getRemainingAnalysis();
    const used = limit === Infinity ? 0 : limit - remaining;
    const percentage = limit === Infinity ? 100 : (used / limit) * 100;

    const handleUpgrade = async () => {
        try {
            await unlockFeature('annualSubscription');
        } catch (error) {
            console.error('Failed to unlock annual subscription:', error);
        }
    };

    if (hasUnlimitedSongs() || hasAnnualSubscription()) {
        return compact ? (
            <div className="usage-tracker compact premium">
                <span className="premium-indicator">∞ Unlimited</span>
            </div>
        ) : (
            <div className="usage-tracker premium">
                <div className="usage-header">
                    <h3>🌟 Premium Active</h3>
                    <span className="unlimited-badge">∞ Unlimited Analysis</span>
                </div>
                <div className="premium-benefits">
                    <div className="benefit">✅ No daily limits</div>
                    <div className="benefit">✅ Ad-free experience</div>
                    <div className="benefit">✅ All premium features</div>
                </div>
            </div>
        );
    }

    const isLimitReached = remaining <= 0;
    const isNearLimit = remaining <= 1 && remaining > 0;

    return (
        <div className={`usage-tracker ${compact ? 'compact' : ''} ${isLimitReached ? 'limit-reached' : isNearLimit ? 'near-limit' : ''}`}>
            {!compact && (
                <div className="usage-header">
                    <h3>📊 Daily Usage</h3>
                    <span className="usage-count">{used} / {limit} songs analyzed</span>
                </div>
            )}

            <div className="usage-bar">
                <div className="usage-progress" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                {compact && (
                    <span className="usage-text">{remaining} remaining</span>
                )}
            </div>

            {!compact && (
                <>
                    <div className="usage-details">
                        <div className="remaining-songs">
                            {isLimitReached ? (
                                <span className="limit-message">Daily limit reached!</span>
                            ) : (
                                <span className="remaining-count">{remaining} songs remaining today</span>
                            )}
                        </div>
                        
                        <div className="reset-info">
                            <span>Resets at midnight</span>
                        </div>
                    </div>

                    {(isLimitReached || isNearLimit) && (
                        <div className="upgrade-prompt">
                            <div className="prompt-content">
                                <h4>🚀 Want Unlimited Analysis?</h4>
                                <p>Get our Annual Premium Subscription for unlimited song analysis, ad-free experience, and all premium features!</p>
                                
                                <div className="upgrade-benefits">
                                    <div className="benefit-item">✅ Unlimited daily analysis</div>
                                    <div className="benefit-item">✅ Remove all ads</div>
                                    <div className="benefit-item">✅ Advanced chord analysis</div>
                                    <div className="benefit-item">✅ 1000+ premium songs</div>
                                    <div className="benefit-item">✅ Offline mode</div>
                                </div>

                                <div className="pricing">
                                    <span className="price">{formatPiAmount(1.0)} for 1 full year</span>
                                    <span className="value">Best value - all features included!</span>
                                </div>

                                <button className="upgrade-btn" onClick={handleUpgrade}>
                                    🌟 Get Annual Premium
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UsageTracker;