/**
 * 🏆 ChordQualityBadge Component
 * Shows users the source and quality of chord detection
 */

import React from 'react';
import './ChordQualityBadge.css';

const ChordQualityBadge = ({ 
    source = 'ai', 
    confidence = 85,
    compact = false 
}) => {
    const getBadgeInfo = () => {
        switch (source?.toLowerCase()) {
            case 'database':
            case 'verified':
                return {
                    icon: '✓',
                    label: 'Verified Chords',
                    color: '#10b981', // green
                    bgColor: 'rgba(16, 185, 129, 0.1)',
                    description: 'Professionally verified chord progression'
                };
            
            case 'ai':
            case 'librosa':
            case 'audio_analysis':
                return {
                    icon: '🤖',
                    label: `AI Detected (${confidence}%)`,
                    color: '#6366f1', // indigo
                    bgColor: 'rgba(99, 102, 241, 0.1)',
                    description: 'AI-powered audio analysis using Librosa'
                };
            
            case 'pattern':
            case 'estimated':
            case 'mock_progression':
                return {
                    icon: '≈',
                    label: 'Estimated',
                    color: '#f59e0b', // amber
                    bgColor: 'rgba(245, 158, 11, 0.1)',
                    description: 'Music theory-based chord estimation'
                };
            
            default:
                return {
                    icon: '🎵',
                    label: 'Analyzed',
                    color: '#8b5cf6', // purple
                    bgColor: 'rgba(139, 92, 246, 0.1)',
                    description: 'Chord progression detected'
                };
        }
    };

    const badgeInfo = getBadgeInfo();

    if (compact) {
        return (
            <span 
                className="chord-quality-badge compact"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: badgeInfo.color,
                    backgroundColor: badgeInfo.bgColor,
                    border: `1px solid ${badgeInfo.color}40`,
                    whiteSpace: 'nowrap'
                }}
                title={badgeInfo.description}
            >
                <span>{badgeInfo.icon}</span>
                <span>{source === 'ai' ? `${confidence}%` : badgeInfo.label.split(' ')[0]}</span>
            </span>
        );
    }

    return (
        <div 
            className="chord-quality-badge"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '16px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: badgeInfo.color,
                backgroundColor: badgeInfo.bgColor,
                border: `1.5px solid ${badgeInfo.color}60`,
                boxShadow: `0 2px 8px ${badgeInfo.color}20`,
                transition: 'all 0.3s ease'
            }}
            title={badgeInfo.description}
        >
            <span style={{ fontSize: '1.2em' }}>{badgeInfo.icon}</span>
            <span>{badgeInfo.label}</span>
        </div>
    );
};

export default ChordQualityBadge;
