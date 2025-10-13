/**
 * HomePage Component - ChordyPi Main Landing Page
 * Last updated: October 9, 2025
 * Features: SongCard components for all sections (Recently Played, Favorites, Featured)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import BackgroundVideo from '../components/home/BackgroundVideo';
import SearchInterface from '../components/home/SearchInterface';
import FeaturedSongs from '../components/home/FeaturedSongs';
import FileUploader from '../components/FileUploader';
import SearchResultsPage from './SearchResultsPage';
import UserLibrary from '../components/library/UserLibrary';
import SongCard from '../components/common/SongCard';
import ChordyPiLogo from '../components/common/ChordyPiLogo';
import { useAuth } from '../hooks/useAuth';
import { analyzeSong, addToHistory, getFavorites, getHistory, addToFavorites, removeFromFavorites, analyzeUploadedAudio } from '../services/api';
import '../styles/global.css';
import '../styles/animations.css';
import '../styles/components/user-features.css';
import '../styles/components/homepage.css';

const HomePage = () => {
    const { user } = useAuth();
    const history = useHistory();
    const location = useLocation();
    
    // For Pi Network features, we'll check localStorage directly
    const [isPiUser, setIsPiUser] = useState(false);
    
    useEffect(() => {
        const piUser = localStorage.getItem('piNetworkUser');
        setIsPiUser(!!piUser);
    }, []);
    
    // State management
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showUserLibrary, setShowUserLibrary] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [analyzingChords, setAnalyzingChords] = useState(false);
    const [analyzingSongId, setAnalyzingSongId] = useState(null);
    const [analyzingSong, setAnalyzingSong] = useState(null);
    const [songTitle, setSongTitle] = useState('');
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [recentHistory, setRecentHistory] = useState([]);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Load user data when component mounts or user changes
    useEffect(() => {
        if (user) {
            const favs = getFavorites();
            const hist = getHistory();
            console.log('📚 Loading user data:', { favorites: favs.length, history: hist.length });
            setFavorites(favs);
            setRecentHistory(hist);
        } else {
            setFavorites([]);
            setRecentHistory([]);
        }
    }, [user]);

    // Scroll to top when homepage loads - AGGRESSIVE RESET
    useEffect(() => {
        // Multiple scroll reset methods
        const resetScroll = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            window.pageYOffset = 0;
            
            // Force reset after a short delay
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }, 50);
            
            // Another reset after longer delay
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        };
        
        resetScroll();
        
        // Also reset on window load
        window.addEventListener('load', resetScroll);
        
        return () => {
            window.removeEventListener('load', resetScroll);
        };
    }, []);

    // Manage body class for analyzing overlay
    useEffect(() => {
        if (analyzingChords) {
            document.body.classList.add('analyzing-active');
        } else {
            document.body.classList.remove('analyzing-active');
        }
        
        // Cleanup on unmount
        return () => {
            document.body.classList.remove('analyzing-active');
        };
    }, [analyzingChords]);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        setShowSearchResults(true);
        setError('');
    };

    const handleSongSelect = async (song) => {
        console.log('🎵 handleSongSelect called with song:', song);
        
        // Navigate to analyzing page which will show overlay and perform analysis
        history.push('/analyzing', { song });
    };

        const handleFileUpload = async (formData, fileName) => {
        console.log('📁 handleFileUpload called with fileName:', fileName);
        
        try {
            // Get the File object from FormData to create a blob URL
            const audioFile = formData.get('audio');
            if (!audioFile) {
                setError('No audio file found');
                return;
            }
            
            // Create a blob URL for audio playback
            const audioBlobUrl = URL.createObjectURL(audioFile);
            console.log('🎵 Created blob URL for audio:', audioBlobUrl);
            
            // Analyze the file immediately in HomePage
            console.log('🎵 Starting file upload analysis...');
            const data = await analyzeUploadedAudio(formData, fileName);
            
            console.log('📦 File upload analysis complete:', data);
            
            if (data.status === 'success' && data.analysis?.chords?.length > 0) {
                // Prepare song object with analyzed chords (same pattern as YouTube songs)
                const song = {
                    title: fileName.replace(/\.(mp3|wav|m4a)$/i, ''),
                    artist: 'Uploaded File',
                    source: 'upload',
                    fileName: fileName,
                    audioUrl: audioBlobUrl, // Blob URL for audio playback
                    chords: data.analysis.chords,
                    duration: data.analysis.duration,
                    analysis_type: data.analysis.analysis_type || 'ai_analysis',
                    key: data.analysis.key,
                    bpm: data.analysis.bpm,
                    time_signature: data.analysis.time_signature,
                    accuracy: data.analysis.accuracy,
                    analysis_metadata: data.analysis.analysis_metadata,
                    thumbnail: null, // No thumbnail for uploaded files
                    youtubeUrl: null // No YouTube URL for uploaded files
                };
                
                // Navigate to AnalyzingPage which will show unified overlay then go to PlayerPage
                // Same navigation pattern as featured songs and YouTube search
                history.push('/analyzing', { song });
                
            } else {
                console.error('❌ No chord analysis available from uploaded file');
                setError('Could not analyze the uploaded file. Please try a different file.');
                // Clean up blob URL if analysis failed
                URL.revokeObjectURL(audioBlobUrl);
                setAnalyzingChords(false);
            }
            
        } catch (err) {
            console.error('💥 File upload analysis failed:', err);
            setError(err.message || 'Failed to analyze file. Please try again.');
            setAnalyzingChords(false);
        }
    };

    const handleBackToSearch = () => {
        setShowSearchResults(false);
        setError('');
        setSongTitle('');
    };

    const handlePremiumFeatureRequest = () => {
        if (!user) {
            history.push('/signin');
        } else if (!isPiUser) {
            setShowPremiumModal(true);
        }
    };

    const handleToggleFavorite = (song) => {
        const currentFavorites = getFavorites();
        const isFav = currentFavorites.some(f => f.videoId === song.videoId);
        
        if (isFav) {
            const updated = removeFromFavorites(song.videoId);
            setFavorites(updated);
        } else {
            const updated = addToFavorites(song);
            setFavorites(updated);
        }
    };

    // Handler for Quick Start featured songs
    const handleAnalyzeSong = (videoId, title, artist) => {
        const song = {
            videoId,
            title,
            artist,
            thumbnail: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
            url: `https://www.youtube.com/watch?v=${videoId}`
        };
        handleSongSelect(song);
    };

    // Show UserLibrary when requested
    if (showUserLibrary) {
        // Hide sign out button when library is showing
        const signOutBtn = document.querySelector('.top-sign-out-button');
        if (signOutBtn) signOutBtn.style.display = 'none';
        
        return (
            <div className="home-page">
                <UserLibrary />
                <div className="back-to-home">
                    <button onClick={() => {
                        setShowUserLibrary(false);
                        // Show sign out button again when going back
                        const btn = document.querySelector('.top-sign-out-button');
                        if (btn) btn.style.display = 'block';
                    }} className="back-button">
                        ← Back to Home
                    </button>
                </div>
            </div>
        );
    } else {
        // Make sure sign out button is visible on home page
        const signOutBtn = document.querySelector('.top-sign-out-button');
        if (signOutBtn) signOutBtn.style.display = 'block';
    }

    // Show SearchResultsPage when searching
    if (showSearchResults) {
        // Hide sign out button when showing search results
        const signOutBtn = document.querySelector('.top-sign-out-button');
        if (signOutBtn) signOutBtn.style.display = 'none';
        
        return (
            <SearchResultsPage 
                searchQuery={searchQuery}
                onSongSelect={handleSongSelect}
                onBack={() => {
                    handleBackToSearch();
                    // Show sign out button again when going back
                    const btn = document.querySelector('.top-sign-out-button');
                    if (btn) btn.style.display = 'block';
                }}
                analyzingChords={analyzingChords}
                analyzingSong={analyzingSong}
            />
        );
    }

    // Full-screen analyzing overlay removed to keep users on homepage
    // Individual card analyzing overlays provide better UX

    // Show main HomePage
    return (
        <div className="home-page">
            
            {/* 🏆 HACKATHON JUDGE BANNER */}
            <div className="hackathon-banner" style={{
                background: 'linear-gradient(135deg, #FFD700, #6c5ce7)',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#1a1a1a' }}>
                    🏆 Pi Network Hackathon 2025 - ChordyPi
                </h3>
                <button 
                    onClick={() => history.push('/demo-judge')}
                    style={{
                        background: '#1a1a1a',
                        color: '#FFD700',
                        border: 'none',
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                    }}
                >
                    ⚡ Quick Demo for Judges (30 seconds) →
                </button>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#1a1a1a' }}>
                    See AI chord detection + Pi Network payments in action!
                </p>
            </div>
            
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    {/* Top: Logo Section - Full Width */}
                    <div className="hero-text">
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            marginBottom: '20px' 
                        }}>
                            <ChordyPiLogo 
                                size="large" 
                                showTagline={true}
                                lightText={true}
                            />
                        </div>
                    </div>
                    
                    {/* Bottom: Two-column layout for user boxes */}
                    {user && (
                        <div className="hero-boxes-container">
                            {/* Left Box: User Welcome */}
                            <div className="hero-box user-welcome">
                                <div className="welcome-message">
                                    <span className="greeting">Welcome back, {user.username}!</span>
                                    {isPiUser && <span className="pi-status">🌟 Pi Network Pioneer</span>}
                                </div>
                                <div className="user-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{favorites.length}</span>
                                        <span className="stat-label">Favorites</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{recentHistory.length}</span>
                                        <span className="stat-label">Songs Played</span>
                                    </div>
                                    {isPiUser && (
                                        <div className="stat-item premium">
                                            <span className="stat-number">∞</span>
                                            <span className="stat-label">Premium Access</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Right Box: Featured Songs */}
                            <div className="hero-box hero-featured-preview">
                                <h3 className="preview-title">🎸 Quick Start</h3>
                                <div className="preview-songs">
                                    <div className="preview-song-card" onClick={() => handleAnalyzeSong('9bZkp7q19f0', 'Gangnam Style', 'PSY')}>
                                        <div className="preview-thumbnail">
                                            <img src="https://i.ytimg.com/vi/9bZkp7q19f0/default.jpg" alt="Gangnam Style" />
                                            <div className="play-overlay">▶</div>
                                        </div>
                                        <div className="preview-info">
                                            <p className="preview-song-title">Gangnam Style</p>
                                            <p className="preview-artist">PSY</p>
                                        </div>
                                    </div>
                                    <div className="preview-song-card" onClick={() => handleAnalyzeSong('kJQP7kiw5Fk', 'Despacito', 'Luis Fonsi')}>
                                        <div className="preview-thumbnail">
                                            <img src="https://i.ytimg.com/vi/kJQP7kiw5Fk/default.jpg" alt="Despacito" />
                                            <div className="play-overlay">▶</div>
                                        </div>
                                        <div className="preview-info">
                                            <p className="preview-song-title">Despacito</p>
                                            <p className="preview-artist">Luis Fonsi</p>
                                        </div>
                                    </div>
                                    <div className="preview-song-card" onClick={() => handleAnalyzeSong('CevxZvSJLk8', 'Shape of You', 'Ed Sheeran')}>
                                        <div className="preview-thumbnail">
                                            <img src="https://i.ytimg.com/vi/CevxZvSJLk8/default.jpg" alt="Shape of You" />
                                            <div className="play-overlay">▶</div>
                                        </div>
                                        <div className="preview-info">
                                            <p className="preview-song-title">Shape of You</p>
                                            <p className="preview-artist">Ed Sheeran</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Non-user invitation */}
                    {!user && (
                        <div className="auth-invitation">
                            <p className="auth-message">Join thousands of musicians improving their skills</p>
                            <div className="auth-links">
                                <Link to="/signup" className="auth-link signup-link">
                                    🚀 Get Started Free
                                </Link>
                                <Link to="/signin" className="auth-link signin-link">
                                    🔑 Sign In
                                </Link>
                            </div>
                            <p className="pi-invitation">
                                💎 Pi Network users get premium features!{' '}
                                <Link to="/signup?method=pi" className="pi-link">Connect with Pi</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Feature Highlights for Non-Users */}
            {!user && (
                <div className="feature-highlights">
                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Real-time Analysis</h3>
                            <p>Get instant chord progressions from any YouTube song</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎸</div>
                            <h3>Interactive Fretboard</h3>
                            <p>See exactly where to place your fingers</p>
                        </div>
                        <div className="feature-card premium">
                            <div className="feature-icon">⚡</div>
                            <h3>Premium Features</h3>
                            <p>Advanced analysis, custom speeds, and more with Pi Network</p>
                            <button className="premium-cta" onClick={handlePremiumFeatureRequest}>
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Quick Stats Banner */}
            <div className="stats-banner">
                <div className="stats-container">
                    <div className="stat-box">
                        <div className="stat-icon">🎵</div>
                        <div className="stat-info">
                            <span className="stat-value">10M+</span>
                            <span className="stat-description">Songs Analyzed</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-icon">🎸</div>
                        <div className="stat-info">
                            <span className="stat-value">500K+</span>
                            <span className="stat-description">Musicians</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-info">
                            <span className="stat-value">98%</span>
                            <span className="stat-description">Accuracy</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Search Interface */}
            <div className="search-section">
                <SearchInterface onSearch={handleSearch} />
                
                {/* File Upload - Right below search, same pattern as featured songs */}
                <FileUploader 
                    onUpload={handleFileUpload}
                    onError={(msg) => setError(msg)}
                />
            </div>
            
            {/* Testimonials Section */}
            <div className="testimonials-section">
                <h2 className="testimonials-title">What Musicians Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"Finally learned my favorite songs! The chord analysis is spot on."</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">🎸</div>
                                <div className="author-info">
                                    <span className="author-name">Sarah M.</span>
                                    <span className="author-role">Guitar Player</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"The real-time analysis changed how I practice. Amazing tool!"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">🎹</div>
                                <div className="author-info">
                                    <span className="author-name">Mike D.</span>
                                    <span className="author-role">Pianist</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"Perfect for beginners and pros alike. Highly recommend!"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">🥁</div>
                                <div className="author-info">
                                    <span className="author-name">Alex K.</span>
                                    <span className="author-role">Music Teacher</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* User Library Quick Access */}
            {user && (recentHistory.length > 0 || favorites.length > 0) && (
                <div className="user-library-preview" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '20px',
                    padding: '35px',
                    margin: '50px 0',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <div className="library-header" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '30px',
                        flexWrap: 'wrap',
                        gap: '15px'
                    }}>
                        <h2 style={{
                            color: '#fff',
                            fontSize: '2rem',
                            fontWeight: '700',
                            margin: '0'
                        }}>📚 Your Music Library</h2>
                        <button 
                            onClick={() => setShowUserLibrary(true)} 
                            className="view-all-button"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '1rem',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            View All →
                        </button>
                    </div>
                    
                    <div className="library-tabs" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '35px'
                    }}>
                        {recentHistory.length > 0 && (
                            <div className="library-section">
                                <h3 style={{
                                    color: '#fff',
                                    fontSize: '1.3rem',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>🕒 Recently Played</h3>
                                <div className="song-preview-list" style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr',
                                    gap: '15px'
                                }}>
                                    {recentHistory.slice(0, 4).map((song, index) => {
                                        const parseDuration = (duration) => {
                                            if (typeof duration === 'string' && duration.includes(':')) {
                                                const parts = duration.split(':');
                                                return parseInt(parts[0]) * 60 + parseInt(parts[1]);
                                            }
                                            return typeof duration === 'number' ? duration : 0;
                                        };
                                        
                                        return (
                                            <SongCard
                                                key={song.videoId || index}
                                                song={{
                                                    ...song,
                                                    title: song.title || 'Unknown Title',
                                                    artist: song.channel || song.artist || 'Unknown Artist',
                                                    thumbnail: song.thumbnail || song.thumbnails?.default?.url || '',
                                                    duration: parseDuration(song.duration),
                                                    videoId: song.videoId || song.id?.videoId || song.id,
                                                    analyzed: false,
                                                    difficulty: 'medium',
                                                    chordCount: 0
                                                }}
                                                onAnalyze={() => !analyzingChords && handleSongSelect(song)}
                                                onPlay={() => !analyzingChords && handleSongSelect(song)}
                                                onFavorite={() => handleToggleFavorite(song)}
                                                isFavorite={favorites.some(f => f.videoId === (song.videoId || song.id?.videoId || song.id))}
                                                showDifficulty={false}
                                                showDuration={true}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        
                        {favorites.length > 0 && (
                            <div className="library-section">
                                <h3 style={{
                                    color: '#fff',
                                    fontSize: '1.3rem',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>❤️ Your Favorites</h3>
                                <div className="song-preview-list" style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr',
                                    gap: '15px'
                                }}>
                                    {favorites.slice(0, 4).map((song, index) => {
                                        const parseDuration = (duration) => {
                                            if (typeof duration === 'string' && duration.includes(':')) {
                                                const parts = duration.split(':');
                                                return parseInt(parts[0]) * 60 + parseInt(parts[1]);
                                            }
                                            return typeof duration === 'number' ? duration : 0;
                                        };
                                        
                                        return (
                                            <SongCard
                                                key={song.videoId || index}
                                                song={{
                                                    ...song,
                                                    title: song.title || 'Unknown Title',
                                                    artist: song.channel || song.artist || 'Unknown Artist',
                                                    thumbnail: song.thumbnail || song.thumbnails?.default?.url || '',
                                                    duration: parseDuration(song.duration),
                                                    videoId: song.videoId || song.id?.videoId || song.id,
                                                    analyzed: false,
                                                    difficulty: 'medium',
                                                    chordCount: 0
                                                }}
                                                onAnalyze={() => !analyzingChords && handleSongSelect(song)}
                                                onPlay={() => !analyzingChords && handleSongSelect(song)}
                                                onFavorite={() => handleToggleFavorite(song)}
                                                isFavorite={true}
                                                showDifficulty={false}
                                                showDuration={true}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Featured Songs */}
            <div className="featured-section">
                <div className="section-header">
                    <h2>🎵 Featured Songs</h2>
                    <p>Popular songs to practice your skills</p>
                </div>
                <FeaturedSongs onSongSelect={handleSongSelect} analyzing={analyzingSongId} analyzingChords={analyzingChords} />
            </div>
            
            {/* Premium Modal */}
            {showPremiumModal && !isPiUser && (
                <div className="premium-modal-overlay" onClick={() => setShowPremiumModal(false)}>
                    <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close"
                            onClick={() => setShowPremiumModal(false)}
                        >
                            ✕
                        </button>
                        <div className="modal-content">
                            <h2>🌟 Unlock Premium Features</h2>
                            <p>Connect with Pi Network to access advanced features:</p>
                            <ul className="premium-features">
                                <li>🎯 Advanced chord analysis</li>
                                <li>🎸 Custom playback speeds</li>
                                <li>💾 Unlimited song library</li>
                                <li>🔧 Advanced fretboard tools</li>
                                <li>📱 Priority support</li>
                            </ul>
                            <div className="modal-actions">
                                <Link 
                                    to="/signup?method=pi" 
                                    className="pi-connect-button"
                                    onClick={() => setShowPremiumModal(false)}
                                >
                                    Connect with Pi Network
                                </Link>
                                <button 
                                    className="maybe-later-button"
                                    onClick={() => setShowPremiumModal(false)}
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;