import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getFavorites, addToFavorites, removeFromFavorites, getHistory, addToHistory } from '../../services/api';
import SongCard from '../common/SongCard';
import '../../styles/components/search-results.css';

const UserLibrary = () => {
    const [activeTab, setActiveTab] = useState('recent');
    const [recentSongs, setRecentSongs] = useState([]);
    const [savedSongs, setSavedSongs] = useState([]);
    const [favoriteSongs, setFavoriteSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState(getFavorites());
    const history = useHistory();

    const apiUrl = process.env.REACT_APP_API_URL || 'https://chordypi.onrender.com/api';

    useEffect(() => {
        fetchLibraryData();
    }, [activeTab]);

    useEffect(() => {
        // Update local favorites when they change
        setFavorites(getFavorites());
    }, []);

    const fetchLibraryData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'recent') {
                // Use localStorage history for recent songs
                const historyData = getHistory();
                setRecentSongs(historyData || []);
            } else if (activeTab === 'favorites') {
                // Use localStorage favorites
                const favoritesData = getFavorites();
                setFavoriteSongs(favoritesData || []);
            } else {
                // Fetch saved songs from API
                const response = await fetch(`${apiUrl}/library/saved?user_id=1`);
                const data = await response.json();
                if (data.status === 'success') {
                    setSavedSongs(data.songs || []);
                }
            }
        } catch (error) {
            console.error('Error fetching library data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSongClick = (song) => {
        // Add to history when clicked
        addToHistory(song);
        
        // Navigate to analyzing page with song data
        history.push('/analyzing', {
            song: {
                videoId: song.videoId,
                title: song.title,
                artist: song.artist || song.channel,
                thumbnail: song.thumbnail,
                url: song.url || `https://www.youtube.com/watch?v=${song.videoId}`
            }
        });
    };

    const handleToggleFavorite = (videoId) => {
        const currentFavorites = getFavorites();
        const isCurrentlyFavorite = currentFavorites.some(fav => fav.videoId === videoId);
        
        if (isCurrentlyFavorite) {
            const updated = removeFromFavorites(videoId);
            setFavorites(updated);
        } else {
            const song = getCurrentSongs().find(s => s.videoId === videoId);
            if (song) {
                const updated = addToFavorites(song);
                setFavorites(updated);
            }
        }
        
        // Refresh data if we're on favorites tab
        if (activeTab === 'favorites') {
            fetchLibraryData();
        }
    };

    const removeSong = async (song) => {
        try {
            const response = await fetch(`${apiUrl}/library/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 1,
                    song_id: song.id
                })
            });

            if (response.ok) {
                fetchLibraryData(); // Refresh the data
            }
        } catch (error) {
            console.error('Error removing song:', error);
        }
    };

    const getCurrentSongs = () => {
        switch (activeTab) {
            case 'recent':
                return recentSongs;
            case 'saved':
                return savedSongs;
            case 'favorites':
                return favoriteSongs;
            default:
                return recentSongs;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="search-results-page user-library-page" style={{
            maxWidth: '100%',
            width: '100%',
            margin: '0',
            padding: '20px',
            boxSizing: 'border-box',
            overflowX: 'hidden'
        }}>
            <div className="search-header" style={{
                textAlign: 'center',
                marginBottom: '30px'
            }}>
                <h2 className="results-title">My Music Library</h2>
                <p className="search-query">Your personal collection</p>
            </div>

            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                {[
                    { key: 'recent', label: 'Recently Searched', icon: '🕒' },
                    { key: 'saved', label: 'Saved Songs', icon: '💾' },
                    { key: 'favorites', label: 'Favorites', icon: '❤️' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            background: activeTab === tab.key 
                                ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' 
                                : 'rgba(255, 255, 255, 0.1)',
                            color: activeTab === tab.key ? '#000' : '#fff',
                            cursor: 'pointer',
                            borderRadius: '25px',
                            fontSize: '16px',
                            fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner">🎵</div>
                    <p className="loading-message">Loading your music library...</p>
                </div>
            ) : (
                <div className="library-content">
                    {getCurrentSongs().length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#fff'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎵</div>
                            <h3 style={{ marginBottom: '15px' }}>No songs in your {activeTab} list yet</h3>
                            <p style={{ color: '#ccc' }}>Start searching for songs to build your library!</p>
                        </div>
                    ) : (
                        <div className="results-grid">
                            {getCurrentSongs().map((song, index) => {
                                const isFavorite = favorites.some(fav => fav.videoId === song.videoId);
                                
                                return (
                                    <SongCard
                                        key={song.videoId || song.id || index}
                                        song={song}
                                        isFavorite={isFavorite}
                                        onFavorite={() => handleToggleFavorite(song.videoId)}
                                        onAnalyze={() => handleSongClick(song)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserLibrary;