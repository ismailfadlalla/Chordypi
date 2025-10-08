import React, { useState, useEffect } from 'react';
import { PiNetworkProvider, usePiNetwork } from '../context/PiNetworkContext';
import usePremiumFeatures from '../hooks/usePremiumFeatures';
import './PiNetworkDemo.css';

const PiNetworkDemoContent = () => {
    const {
        isPiConnected,
        piUser,
        premiumFeatures,
        analytics,
        loading,
        error,
        connectPiNetwork,
        disconnectPiNetwork,
        clearError
    } = usePiNetwork();

    const {
        hasAdvancedAnalysis,
        hasAdFree,
        hasPremiumLibrary,
        hasUnlimitedSongs,
        hasOfflineMode,
        unlockFeature,
        getPremiumStatus,
        shouldShowAds,
        getRemainingAnalysis,
        formatPiAmount
    } = usePremiumFeatures();

    const [demoAnalysis, setDemoAnalysis] = useState(null);
    const [unlocking, setUnlocking] = useState(null);

    const premiumStatus = getPremiumStatus();

    const handleConnect = async () => {
        try {
            await connectPiNetwork();
        } catch (err) {
            console.error('Connection failed:', err);
        }
    };

    const handleUnlockFeature = async (featureKey) => {
        if (unlocking) return;
        
        setUnlocking(featureKey);
        try {
            await unlockFeature(featureKey);
        } catch (err) {
            console.error('Unlock failed:', err);
        } finally {
            setUnlocking(null);
        }
    };

    const simulateAdvancedAnalysis = () => {
        if (!hasAdvancedAnalysis()) {
            setDemoAnalysis({
                type: 'basic',
                message: 'Unlock Advanced Analysis for detailed chord progressions!'
            });
            return;
        }

        setDemoAnalysis({
            type: 'advanced',
            chords: ['Am', 'F', 'C', 'G'],
            key: 'A minor',
            scale: 'Natural Minor Scale',
            progression: 'vi - IV - I - V',
            suggestions: [
                'Try replacing F with Dm for a more melancholic sound',
                'Add a Em chord before Am for smoother transitions',
                'Consider modulating to C major for the chorus'
            ],
            analysis: 'This progression follows a classic vi-IV-I-V pattern, very popular in indie and folk music. The Am to F movement creates a strong emotional pull.'
        });
    };

    const DEMO_FEATURES = {
        advancedAnalysis: {
            name: 'Advanced Song Analysis',
            icon: '🎼',
            price: 1.0,
            demo: () => simulateAdvancedAnalysis(),
            demoText: 'Try Analysis Demo'
        },
        adFree: {
            name: 'Ad-Free Experience',
            icon: '🚫',
            price: 0.5,
            demo: null,
            demoText: shouldShowAds() ? 'Ads Currently Shown' : 'No Ads!'
        },
        premiumLibrary: {
            name: 'Premium Song Library',
            icon: '🎵',
            price: 2.0,
            demo: null,
            demoText: hasPremiumLibrary() ? '1000+ Songs Available' : '100 Free Songs'
        },
        unlimitedSongs: {
            name: 'Unlimited Song Analysis',
            icon: '∞',
            price: 1.5,
            demo: null,
            demoText: hasUnlimitedSongs() ? 'Unlimited Analysis' : `${getRemainingAnalysis()} Remaining Today`
        },
        offlineMode: {
            name: 'Offline Mode',
            icon: '📱',
            price: 1.0,
            demo: null,
            demoText: hasOfflineMode() ? 'Download Available' : 'Online Only'
        }
    };

    return (
        <div className="pi-demo-container">
            <div className="demo-header">
                <h2>🥧 Pi Network Integration Demo</h2>
                <p>Experience the power of blockchain-powered premium features!</p>
            </div>

            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button onClick={clearError} className="close-btn">×</button>
                </div>
            )}

            {/* Connection Status */}
            <div className="connection-status">
                <div className="status-card">
                    <h3>Connection Status</h3>
                    {isPiConnected ? (
                        <div className="connected">
                            <div className="status-indicator connected"></div>
                            <div className="status-info">
                                <span className="status-text">✅ Connected as {piUser?.username}</span>
                                <button onClick={disconnectPiNetwork} className="disconnect-btn">
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="disconnected">
                            <div className="status-indicator disconnected"></div>
                            <div className="status-info">
                                <span className="status-text">⭕ Not Connected</span>
                                <button 
                                    onClick={handleConnect} 
                                    disabled={loading}
                                    className="connect-btn"
                                >
                                    {loading ? '🔄 Connecting...' : '🔗 Connect Pi Network'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Premium Status */}
                {isPiConnected && (
                    <div className="premium-status-card">
                        <h3>Premium Status</h3>
                        <div className="status-overview">
                            <div className="completion-circle">
                                <div className="circle-progress" style={{
                                    background: `conic-gradient(#4CAF50 0deg ${(premiumStatus.completionPercentage / 100) * 360}deg, #e0e0e0 ${(premiumStatus.completionPercentage / 100) * 360}deg 360deg)`
                                }}>
                                    <div className="circle-inner">
                                        <span>{premiumStatus.completionPercentage}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="status-details">
                                <p><strong>{premiumStatus.unlockedFeatures}</strong> of {premiumStatus.totalFeatures} features unlocked</p>
                                {analytics && (
                                    <p>Total spent: {formatPiAmount(analytics.totalSpent)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Feature Demo Grid */}
            <div className="features-demo-grid">
                {Object.entries(DEMO_FEATURES).map(([key, feature]) => (
                    <div key={key} className={`feature-demo-card ${premiumFeatures[key] ? 'unlocked' : 'locked'}`}>
                        <div className="feature-header">
                            <div className="feature-icon">{feature.icon}</div>
                            <div className="feature-status">
                                {premiumFeatures[key] ? (
                                    <span className="unlocked-badge">✅ Unlocked</span>
                                ) : (
                                    <span className="locked-badge">🔒 Locked</span>
                                )}
                            </div>
                        </div>
                        
                        <h3>{feature.name}</h3>
                        <div className="feature-price">{formatPiAmount(feature.price)}</div>
                        
                        <div className="demo-section">
                            <div className="demo-status">
                                <span>{feature.demoText}</span>
                            </div>
                            
                            {feature.demo && (
                                <button 
                                    onClick={feature.demo}
                                    className="demo-btn"
                                    disabled={!premiumFeatures[key]}
                                >
                                    Try Demo
                                </button>
                            )}
                        </div>

                        {!premiumFeatures[key] && isPiConnected && (
                            <button
                                onClick={() => handleUnlockFeature(key)}
                                disabled={unlocking === key || loading}
                                className="unlock-btn"
                            >
                                {unlocking === key ? '⏳ Unlocking...' : `🚀 Unlock for ${formatPiAmount(feature.price)}`}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Demo Analysis Results */}
            {demoAnalysis && (
                <div className="demo-analysis-modal" onClick={() => setDemoAnalysis(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Song Analysis Demo</h3>
                            <button onClick={() => setDemoAnalysis(null)} className="close-btn">×</button>
                        </div>
                        
                        <div className="analysis-content">
                            {demoAnalysis.type === 'basic' ? (
                                <div className="basic-analysis">
                                    <p>{demoAnalysis.message}</p>
                                    <button 
                                        onClick={() => handleUnlockFeature('advancedAnalysis')}
                                        className="upgrade-btn"
                                    >
                                        Unlock Advanced Analysis
                                    </button>
                                </div>
                            ) : (
                                <div className="advanced-analysis">
                                    <div className="analysis-section">
                                        <h4>🎵 Chord Progression</h4>
                                        <div className="chord-sequence">
                                            {demoAnalysis.chords.map((chord, index) => (
                                                <span key={index} className="chord">{chord}</span>
                                            ))}
                                        </div>
                                        <p><strong>Progression:</strong> {demoAnalysis.progression}</p>
                                    </div>
                                    
                                    <div className="analysis-section">
                                        <h4>🗝️ Key & Scale</h4>
                                        <p><strong>Key:</strong> {demoAnalysis.key}</p>
                                        <p><strong>Scale:</strong> {demoAnalysis.scale}</p>
                                    </div>
                                    
                                    <div className="analysis-section">
                                        <h4>💡 Suggestions</h4>
                                        <ul>
                                            {demoAnalysis.suggestions.map((suggestion, index) => (
                                                <li key={index}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="analysis-section">
                                        <h4>🎼 Analysis</h4>
                                        <p>{demoAnalysis.analysis}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            {!window.Pi && (
                <div className="instructions-card">
                    <h3>📱 How to Test Pi Network Integration</h3>
                    <ol>
                        <li>Download the Pi Network app from official sources</li>
                        <li>Open Pi Browser within the Pi Network app</li>
                        <li>Navigate to ChordyPi in Pi Browser</li>
                        <li>Connect your Pi Network account</li>
                        <li>Unlock premium features with Pi cryptocurrency!</li>
                    </ol>
                    <p><strong>Note:</strong> This demo works best in the Pi Browser environment.</p>
                </div>
            )}
        </div>
    );
};

const PiNetworkDemo = () => {
    return (
        <PiNetworkProvider>
            <PiNetworkDemoContent />
        </PiNetworkProvider>
    );
};

export default PiNetworkDemo;