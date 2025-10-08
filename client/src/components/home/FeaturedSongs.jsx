import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getFeaturedSongs, analyzeSong, getFavorites, addToFavorites, removeFromFavorites } from '../../services/api';
import SongCard from '../common/SongCard';
import '../../styles/global.css';
import '../../styles/components/cards.css';

const FeaturedSongs = ({ onSongSelect, analyzing, analyzingChords }) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchFeaturedSongs = async () => {
            try {
                setLoading(true);
                const data = await getFeaturedSongs();
                if (data.status === 'success') {
                    setSongs(data.songs || []);
                }
            } catch (error) {
                console.error('Error fetching featured songs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedSongs();
        setFavorites(getFavorites());
    }, []);

    const handleToggleFavorite = (song) => {
        const currentFavorites = getFavorites();
        const isFav = currentFavorites.some(f => f.videoId === (song.videoId || song.id?.videoId || song.id));
        
        if (isFav) {
            const updated = removeFromFavorites(song.videoId || song.id?.videoId || song.id);
            setFavorites(updated);
        } else {
            const updated = addToFavorites(song);
            setFavorites(updated);
        }
    };

    // Extract YouTube video ID from URL
    const extractVideoId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    const parseDuration = (duration) => {
        if (typeof duration === 'string' && duration.includes(':')) {
            const parts = duration.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return typeof duration === 'number' ? duration : 0;
    };

    if (loading) {
        return (
            <div className="featured-songs-loading" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '60px 20px',
                color: '#fff'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="musical-spinner" style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '4px solid #FFD700',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 15px'
                    }}></div>
                    <p style={{ fontSize: '1.1rem', color: '#ccc' }}>Loading featured songs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="featured-songs" style={{
            padding: '20px 0'
        }}>
            <div className="featured-songs-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '25px',
                padding: '10px'
            }}>
                {songs.map((song) => {
                    const durationInSeconds = parseDuration(song.duration);
                    // Extract videoId from youtube_url if not present
                    const videoId = song.videoId || song.id?.videoId || extractVideoId(song.youtube_url) || song.id;
                    
                    // Create enhanced song object with proper videoId
                    const enhancedSong = {
                        ...song,
                        title: song.title || 'Unknown Title',
                        artist: song.channel || song.artist || 'Unknown Artist',
                        thumbnail: song.thumbnail || song.thumbnails?.default?.url || '',
                        duration: durationInSeconds,
                        videoId: videoId,
                        analyzed: false,
                        difficulty: 'medium',
                        chordCount: 0
                    };
                    
                    return (
                        <SongCard
                            key={videoId}
                            song={enhancedSong}
                            onAnalyze={() => !analyzingChords && onSongSelect(enhancedSong)}
                            onPlay={() => !analyzingChords && onSongSelect(enhancedSong)}
                            onFavorite={() => handleToggleFavorite(enhancedSong)}
                            isFavorite={favorites.some(f => f.videoId === videoId)}
                            showDifficulty={false}
                            showDuration={true}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default FeaturedSongs;