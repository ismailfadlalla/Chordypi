import React, { useState, useEffect } from 'react';
import { searchYouTubeVideos, addToFavorites, removeFromFavorites, getFavorites, addToHistory } from '../services/api';
import SongCard from '../components/common/SongCard';
import '../styles/components/cards.css';
import '../styles/components/search-results.css';

const SearchResultsPage = ({ searchQuery, onSongSelect, onBack, analyzingChords, analyzingSong }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    // Searching overlay effect - shows while loading search results
    useEffect(() => {
        if (!loading) return;

        console.log('🔍 Creating searching overlay');
        
        // Apply purple gradient to body
        const originalBackground = document.body.style.background;
        const originalOverflow = document.body.style.overflow;
        
        document.body.style.cssText += `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            background-attachment: fixed !important;
            overflow: hidden !important;
            min-height: 100vh !important;
        `;
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'searching-overlay';
        overlay.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 500px !important;
            max-width: 90vw !important;
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 24px !important;
            z-index: 2147483647 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 48px 40px !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
            backdrop-filter: blur(10px) !important;
        `;
        
        overlay.innerHTML = `
            <!-- Guitar Icon - PROMINENT & ANIMATED at TOP -->
            <div style="
                font-size: 96px;
                margin-bottom: 20px;
                animation: bounce 1.5s ease-in-out infinite, rotate360 12s linear infinite;
                filter: drop-shadow(0 8px 20px rgba(102, 126, 234, 0.5)) drop-shadow(0 0 30px rgba(118, 75, 162, 0.4));
            ">🎸</div>
            
            <!-- Search Icon with ENHANCED Spinning Rainbow Border -->
            <div style="
                position: relative;
                width: 140px;
                height: 140px;
                margin-bottom: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: float 3s ease-in-out infinite;
            ">
                <!-- Outer spinning rainbow gradient border (VERY PROMINENT) -->
                <div style="
                    position: absolute;
                    inset: -6px;
                    background: conic-gradient(from 0deg, 
                        #667eea 0%, 
                        #764ba2 25%, 
                        #f59e0b 50%, 
                        #10b981 75%, 
                        #667eea 100%
                    );
                    border-radius: 50%;
                    animation: rotate 3s linear infinite;
                    filter: blur(2px);
                "></div>
                
                <!-- White inner border for contrast -->
                <div style="
                    position: absolute;
                    inset: -2px;
                    background: white;
                    border-radius: 50%;
                "></div>
                
                <!-- Search Icon -->
                <div style="
                    position: relative;
                    font-size: 80px;
                    z-index: 1;
                    animation: pulse 2s ease-in-out infinite;
                ">🔍</div>
            </div>
            
            <div style="font-size: 36px; font-weight: 700; color: #667eea; margin-bottom: 12px; text-align: center;">SEARCHING</div>
            <div style="font-size: 20px; color: #666; margin-bottom: 32px; text-align: center; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${searchQuery}</div>
            
            <!-- Progress Bar Container -->
            <div style="
                width: 100%;
                max-width: 400px;
                height: 12px;
                background: linear-gradient(90deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
                border-radius: 6px;
                overflow: hidden;
                position: relative;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
            ">
                <!-- Animated shimmer background -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 200%;
                    height: 100%;
                    background: linear-gradient(90deg, 
                        transparent, 
                        rgba(255, 255, 255, 0.3), 
                        transparent
                    );
                    animation: shimmer 2s infinite;
                "></div>
                <!-- Progress fill -->
                <div id="search-progress-fill" style="
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #ec4899 100%);
                    background-size: 200% 100%;
                    transition: width 0.3s ease;
                    border-radius: 6px;
                    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
                    animation: gradientShift 2s ease infinite;
                    position: relative;
                    overflow: hidden;
                ">
                    <!-- Glowing effect on progress bar -->
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 50%;
                        background: linear-gradient(180deg, rgba(255,255,255,0.4), transparent);
                    "></div>
                </div>
            </div>
            
            <!-- ENHANCED Sparkle particles with Emoji Icons -->
            <div style="
                position: absolute;
                top: 15%;
                left: 10%;
                font-size: 24px;
                animation: sparkleFloat 3s ease-in-out infinite;
                filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.8)) drop-shadow(0 0 20px rgba(102, 126, 234, 0.5));
            ">✨</div>
            <div style="
                position: absolute;
                top: 25%;
                right: 12%;
                font-size: 26px;
                animation: sparkleFloat 2.5s ease-in-out infinite 0.5s;
                filter: drop-shadow(0 0 10px rgba(118, 75, 162, 0.8)) drop-shadow(0 0 20px rgba(118, 75, 162, 0.5));
            ">⭐</div>
            <div style="
                position: absolute;
                bottom: 20%;
                left: 15%;
                font-size: 28px;
                animation: sparkleFloat 3.5s ease-in-out infinite 1s;
                filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.8)) drop-shadow(0 0 20px rgba(245, 158, 11, 0.5));
            ">💫</div>
            <div style="
                position: absolute;
                top: 40%;
                right: 8%;
                font-size: 24px;
                animation: sparkleFloat 2.8s ease-in-out infinite 1.5s;
                filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.5));
            ">🌟</div>
            <div style="
                position: absolute;
                bottom: 35%;
                right: 18%;
                font-size: 26px;
                animation: sparkleFloat 3.2s ease-in-out infinite 2s;
                filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.8)) drop-shadow(0 0 20px rgba(99, 102, 241, 0.5));
            ">⚡</div>
            <div style="
                position: absolute;
                top: 60%;
                left: 12%;
                font-size: 25px;
                animation: sparkleFloat 2.7s ease-in-out infinite 2.5s;
                filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.5));
            ">💎</div>
        `;
        
        // Add enhanced animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { 
                    transform: scale(1); 
                    opacity: 1;
                }
                50% { 
                    transform: scale(1.1);
                    opacity: 0.9;
                }
            }
            
            @keyframes bounce {
                0%, 100% { 
                    transform: translateY(0) rotate(0deg); 
                }
                50% { 
                    transform: translateY(-15px) rotate(5deg); 
                }
            }
            
            @keyframes float {
                0%, 100% { 
                    transform: translateY(0px); 
                }
                50% { 
                    transform: translateY(-10px); 
                }
            }
            
            @keyframes rotate {
                from { 
                    transform: rotate(0deg); 
                }
                to { 
                    transform: rotate(360deg); 
                }
            }
            
            @keyframes rotate360 {
                from { 
                    transform: rotate(0deg); 
                }
                to { 
                    transform: rotate(360deg); 
                }
            }
            
            @keyframes shimmer {
                0% {
                    left: -100%;
                }
                100% {
                    left: 100%;
                }
            }
            
            @keyframes gradientShift {
                0%, 100% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
            }
            
            @keyframes sparkleFloat {
                0%, 100% {
                    transform: translateY(0px) scale(1) rotate(0deg);
                    opacity: 0.85;
                }
                25% {
                    transform: translateY(-15px) scale(1.15) rotate(90deg);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-8px) scale(1.2) rotate(180deg);
                    opacity: 0.9;
                }
                75% {
                    transform: translateY(-12px) scale(1.1) rotate(270deg);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(overlay);
        console.log('✅ Searching overlay created');

        // Animate progress bar
        let progress = 0;
        const progressInterval = setInterval(() => {
            const bar = document.getElementById('search-progress-fill');
            if (bar && progress < 90) {
                progress += Math.random() * 15;
                bar.style.width = `${Math.min(progress, 90)}%`;
            }
        }, 200);
        
        // Cleanup
        return () => {
            console.log('🧹 Cleanup - removing searching overlay');
            clearInterval(progressInterval);
            const box = document.getElementById('searching-overlay');
            if (box) box.remove();
            if (style.parentNode) style.parentNode.removeChild(style);
            document.body.style.background = originalBackground;
            document.body.style.overflow = originalOverflow;
        };
    }, [loading, searchQuery]);

    // Load favorites on mount
    useEffect(() => {
        const currentFavorites = getFavorites();
        setFavorites(currentFavorites);
    }, []);

    // Reset search state when query changes
    useEffect(() => {
        setHasSearched(false);
        setError('');
        setSongs([]);
    }, [searchQuery]);

    // Search when query changes and hasn't been searched yet
    useEffect(() => {
        const performSearch = async () => {
            if (!searchQuery || hasSearched) return;
            
            console.log('🔍 Starting search for:', searchQuery);
            setHasSearched(true);
            setLoading(true);
            setError('');
            setSongs([]);
            
            try {
                const results = await searchYouTubeVideos(searchQuery);
                console.log('✅ Search completed, got', results?.length || 0, 'results');
                console.log('📊 First result:', results[0]); // Debug: Check data structure
                
                if (results && results.length > 0) {
                    setSongs(results);
                } else {
                    setError('No songs found');
                }
            } catch (err) {
                console.error('❌ Search error:', err);
                setError('Search failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [searchQuery, hasSearched]);

    const handleToggleFavorite = (videoId) => {
        const currentFavorites = getFavorites();
        const isCurrentlyFavorite = currentFavorites.some(fav => fav.videoId === videoId);
        
        if (isCurrentlyFavorite) {
            const updated = removeFromFavorites(videoId);
            setFavorites(updated);
        } else {
            const song = songs.find(s => s.videoId === videoId);
            if (song) {
                const updated = addToFavorites(song);
                setFavorites(updated);
            }
        }
    };

    const handleAnalyzeSong = (song) => {
        console.log('🎵 Analyzing song from search results:', song);
        
        // Ensure we have a proper YouTube URL
        const videoId = song.videoId || song.id?.videoId || song.id;
        const youtubeUrl = song.url || song.youtubeUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : null);
        
        // Create a complete song object with all required fields
        const completeSong = {
            ...song,
            videoId: videoId,
            url: youtubeUrl,
            youtubeUrl: youtubeUrl,
            title: song.title || 'Unknown Title',
            artist: song.channel || song.artist || 'Unknown Artist',
            thumbnail: song.thumbnail || song.thumbnails?.default?.url || ''
        };
        
        console.log('📤 Complete song object:', completeSong);
        
        addToHistory(completeSong);
        onSongSelect(completeSong);
    };

    const handleRetry = () => {
        setHasSearched(false);
        setError('');
        setSongs([]);
    };

    // Don't render old loading UI - new overlay handles it via useEffect
    if (loading) {
        return null;
    }

    return (
        <>
            <div className="search-results-page results-page" style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px',
                position: 'relative',
                zIndex: 1
            }}>
                <div className="search-header" style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    padding: '25px',
                    marginBottom: '30px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}>
                <button onClick={onBack} className="back-btn" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '15px',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}>
                    ← Back to Search
                </button>
                <div className="search-info">
                    <h2 className="results-title" style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#2d3748',
                        margin: '0 0 8px 0'
                    }}>Search Results</h2>
                    <p className="search-query" style={{
                        fontSize: '18px',
                        color: '#718096',
                        margin: '0 0 15px 0'
                    }}>for: "{searchQuery}"</p>
                    <div className="results-count" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        gap: '8px'
                    }}>
                        <span className="count-number" style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#2d3748'
                        }}>{songs.length}</span>
                        <span className="count-text" style={{
                            fontSize: '14px',
                            color: '#2d3748',
                            fontWeight: '600'
                        }}>song{songs.length !== 1 ? 's' : ''} found</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <div className="error-content">
                        <h3>Oops! Something went wrong</h3>
                        <p>{error}</p>
                        <button onClick={handleRetry} className="retry-btn">
                            🔄 Try Again
                        </button>
                    </div>
                </div>
            )}

            <div className="results-grid">
                {songs.map((song, index) => {
                    const isFavorite = favorites.some(fav => fav.videoId === song.videoId);
                    
                    // Parse duration to seconds if it's a string (e.g., "4:18" -> 258)
                    let durationInSeconds = 0;
                    if (typeof song.duration === 'string' && song.duration.includes(':')) {
                        const parts = song.duration.split(':');
                        durationInSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                    } else if (typeof song.duration === 'number') {
                        durationInSeconds = song.duration;
                    }
                    
                    return (
                        <SongCard
                            key={song.videoId || index}
                            song={{
                                ...song,
                                title: song.title || 'Unknown Title',
                                artist: song.channel || song.artist || 'Unknown Artist',
                                thumbnail: song.thumbnail || song.thumbnails?.default?.url || '',
                                duration: durationInSeconds,
                                videoId: song.videoId || song.id?.videoId || song.id,
                                analyzed: false,
                                difficulty: 'medium',
                                chordCount: 0
                            }}
                            onAnalyze={handleAnalyzeSong}
                            onPlay={handleAnalyzeSong}
                            onFavorite={() => handleToggleFavorite(song.videoId || song.id?.videoId || song.id)}
                            isFavorite={isFavorite}
                            showDifficulty={false}
                            showDuration={true}
                        />
                    );
                })}
            </div>

            {songs.length === 0 && !loading && !error && (
                <div className="no-results">
                    <p>No songs found</p>
                </div>
            )}
            </div>
        </>
    );
};

export default SearchResultsPage;
