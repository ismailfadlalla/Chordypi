/**
 * 🎵 SongCard Component - Unified Song Display
 * Beautiful glassmorphism cards for search results and featured songs
 * Last Updated: October 2, 2025 - 06:40 AM
 * Used in: SearchResultsPage, HomePage (Recently Played, Favorites, Featured)
 */

import React from 'react';
import '../../styles/design-tokens.css';
import '../../styles/components/cards.css';

const SongCard = ({ 
    song, 
    onAnalyze, 
    onPlay,
    onFavorite,
    isFavorite = false,
    showDifficulty = true,
    showDuration = true,
    compact = false 
}) => {
    // Extract song data
    const {
        title = 'Unknown Title',
        artist = 'Unknown Artist',
        thumbnail = null,
        duration = 0,
        difficulty = 'medium', // easy, medium, hard
        analyzed = false,
        chordCount = 0,
        videoId = null
    } = song || {};

    // Format duration (seconds to mm:ss)
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get difficulty color
    const getDifficultyColor = () => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'var(--accent-green)';
            case 'hard':
                return 'var(--accent-red)';
            default:
                return 'var(--accent-gold)';
        }
    };

    return (
        <div className={`song-card glass ${compact ? 'song-card-compact' : ''}`}>
            {/* Thumbnail */}
            <div className="song-card-thumbnail">
                {thumbnail ? (
                    <img src={thumbnail} alt={title} />
                ) : (
                    <div className="song-card-thumbnail-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <path 
                                d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" 
                                fill="currentColor" 
                                opacity="0.3"
                            />
                        </svg>
                    </div>
                )}
                
                {/* Duration Badge */}
                {showDuration && duration > 0 && (
                    <div className="song-card-duration">
                        {formatDuration(duration)}
                    </div>
                )}

                {/* Favorite Button */}
                {onFavorite && (
                    <button
                        className="song-card-favorite-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFavorite(song);
                        }}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: isFavorite 
                                ? 'rgba(255, 215, 0, 0.95)' 
                                : 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(10px)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '18px',
                            zIndex: 2,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                        }}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                )}

                {/* AI Analyzed Badge */}
                {analyzed && (
                    <div className="song-card-ai-badge">
                        <span className="ai-badge-icon">🤖</span>
                        <span>Analyzed</span>
                    </div>
                )}

                {/* Play Overlay */}
                <div className="song-card-overlay">
                    <button 
                        className="btn btn-icon btn-lg play-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlay?.(song);
                        }}
                        aria-label="Play song"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="song-card-content">
                {/* Title & Artist */}
                <div className="song-card-info">
                    <h3 className="song-card-title" title={title} style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#2d3748',
                        margin: '0 0 6px 0',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {title}
                    </h3>
                    <p className="song-card-artist" title={artist} style={{
                        fontSize: '14px',
                        color: '#718096',
                        margin: '0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {artist}
                    </p>
                </div>

                {/* Metadata */}
                <div className="song-card-metadata">
                    {/* Difficulty Badge */}
                    {showDifficulty && (
                        <div 
                            className="difficulty-badge"
                            style={{ '--difficulty-color': getDifficultyColor() }}
                        >
                            <span className="difficulty-dot"></span>
                            <span className="difficulty-text">
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </span>
                        </div>
                    )}

                    {/* Chord Count */}
                    {analyzed && chordCount > 0 && (
                        <div className="chord-count-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path 
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" 
                                    fill="currentColor"
                                    opacity="0.5"
                                />
                                <path 
                                    d="M12 6v6l4 2" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span>{chordCount} chords</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button 
                    className="btn btn-primary btn-md btn-pill song-card-action"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAnalyze?.(song);
                    }}
                >
                    {analyzed ? (
                        <>
                            <span>View Analysis</span>
                            <span>→</span>
                        </>
                    ) : (
                        <>
                            <span>Analyze with AI</span>
                            <span className="analyze-icon">⚡</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SongCard;
