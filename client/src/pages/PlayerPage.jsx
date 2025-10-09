import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ChordProgressionDisplay from '../components/player/ChordProgressionDisplay';
import ChordQualityBadge from '../components/common/ChordQualityBadge';
import AudioVisualizer from '../components/player/AudioVisualizer';
import '../styles/components/player.css';

const PlayerPage = () => {
    const location = useLocation();
    const history = useHistory();
    const songData = location.state;
    
    // Only log once on mount, not on every render
    useEffect(() => {
        console.log('🎸 Enhanced PlayerPage loaded with location.state:', songData);
        console.log('🔍 Location object:', location);
        console.log('🔍 Location.pathname:', location.pathname);
        console.log('🔍 Location.search:', location.search);
    }, []); // Empty dependency array - only run once
    
    // Require song data
    if (!songData) {
        return (
            <div className="player-page" style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', overflow: 'hidden' }}>
                <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
                    <button 
                        onClick={() => history.push('/')}
                        style={{ 
                            marginBottom: '20px', 
                            padding: '10px 20px', 
                            backgroundColor: '#61dafb', 
                            border: 'none', 
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        ← Back to Home
                    </button>
                    <h1>No song data available</h1>
                    <div style={{ 
                        padding: '20px', 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        borderRadius: '10px',
                        marginTop: '20px',
                        textAlign: 'left'
                    }}>
                        <h3>🎵 How to use the Player:</h3>
                        <ol style={{ fontSize: '16px', lineHeight: '1.6' }}>
                            <li>Go to the <strong>Home page</strong></li>
                            <li>Click on a <strong>Featured Song</strong> (like "Hotel California")</li>
                            <li>Wait for <strong>chord analysis</strong> to complete</li>
                            <li>Player will load with <strong>YouTube video + chord progression</strong></li>
                        </ol>
                        <p style={{ marginTop: '20px', fontSize: '14px', opacity: '0.8' }}>
                            💡 The player needs analyzed song data to display chord progressions and sync with video playback.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // State management
    const [currentChordIndex, setCurrentChordIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(songData?.duration || 0);
    const [youTubePlayer, setYouTubePlayer] = useState(null);
    const [apiReady, setApiReady] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const intervalRef = useRef(null);
    const playerRef = useRef(null);
    const timelineRef = useRef(null);
    const audioRef = useRef(null); // For uploaded audio files
    const [audioReady, setAudioReady] = useState(false);

    // Check if this is an uploaded audio file
    const isUploadedFile = songData?.source === 'upload' && songData?.fileName;
    
    console.log('🎵 Player mode:', isUploadedFile ? 'UPLOADED FILE' : 'YOUTUBE VIDEO');
    console.log('🎵 Song data:', { source: songData?.source, fileName: songData?.fileName });

    // Extract YouTube video ID
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const originalVideoId = getYouTubeVideoId(songData?.youtubeUrl || songData?.url);

    // YouTube API setup - Load immediately and create player when ready
    useEffect(() => {
        console.log('🎬 Setting up YouTube API...', { originalVideoId, apiReady: window.YT?.Player ? 'ready' : 'not ready' });
        
        if (!window.YT) {
            console.log('📥 Loading YouTube API script...');
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            window.onYouTubeIframeAPIReady = () => {
                console.log('🎬 YouTube API Ready callback fired');
                setApiReady(true);
            };
        } else if (window.YT?.Player) {
            console.log('🎬 YouTube API already available');
            setApiReady(true);
        }
    }, []);

    // Create player when API is ready and we have a video ID
    useEffect(() => {
        if (apiReady && originalVideoId && playerRef.current && !youTubePlayer) {
            console.log('🔧 Creating YouTube player for video:', originalVideoId);
            initializeYouTubePlayer();
        }
    }, [apiReady, originalVideoId, youTubePlayer, initializeYouTubePlayer]);

    // Initialize YouTube player - wrapped in useCallback to prevent recreating on every render
    const initializeYouTubePlayer = useCallback(() => {
        if (!originalVideoId || !playerRef.current || !window.YT?.Player) {
            console.log('🚫 Cannot initialize player:', {
                originalVideoId: !!originalVideoId,
                playerRefCurrent: !!playerRef.current,
                YTPlayer: !!window.YT?.Player,
                youTubePlayer: !!youTubePlayer
            });
            return;
        }
        
        if (youTubePlayer) {
            console.log('⚠️ Player already exists, skipping initialization');
            return;
        }
        
        console.log('🔧 Creating YouTube player for video:', originalVideoId);
        
        try {
            const player = new window.YT.Player(playerRef.current, {
                height: '400',
                width: '100%',
                videoId: originalVideoId,
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                    onError: onPlayerError
                },
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                    enablejsapi: 1,
                    origin: window.location.origin
                }
            });
            
            console.log('✅ YouTube player created successfully');
        } catch (error) {
            console.error('❌ Failed to create YouTube player:', error);
        }
    }, [originalVideoId, youTubePlayer]);

    // YouTube player ready callback
    const onPlayerReady = (event) => {
        console.log('🎬 YouTube player ready');
        const player = event.target;
        setYouTubePlayer(player);
        setPlayerReady(true);
        
        const actualDuration = player.getDuration();
        setDuration(actualDuration);
        console.log('⏱️ Video duration:', actualDuration, 'seconds');
        
        // Start time tracking when player is ready
        startTimeTracking(player);
    };

    // YouTube player state change callback
    const onPlayerStateChange = (event) => {
        console.log('🎬 Player state changed:', event.data);
        
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            startTimeTracking(event.target);
            console.log('▶️ Video playing - started chord tracking');
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            stopTimeTracking();
            console.log('⏸️ Video paused - stopped chord tracking');
        } else if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            stopTimeTracking();
            console.log('🔚 Video ended');
        } else if (event.data === window.YT.PlayerState.BUFFERING) {
            // Don't stop tracking during buffering, just log it
            console.log('⏳ Video buffering...');
        } else if (event.data === window.YT.PlayerState.CUED) {
            // Video is loaded and ready to play
            console.log('🎯 Video cued and ready');
        }
    };

    // YouTube player error callback
    const onPlayerError = (event) => {
        const errorMessages = {
            2: 'Invalid video ID or unavailable video',
            5: 'HTML5 player error',
            100: 'Video not found or private',
            101: 'Video owner does not allow embedding',
            150: 'Video owner does not allow embedding in this domain'
        };
        
        // Only log detailed error info for non-150 errors since 150 often works anyway
        if (event.data !== 150) {
            const errorMsg = errorMessages[event.data] || `Unknown error (${event.data})`;
            console.error('❌ YouTube player error:', event.data, '-', errorMsg);
            console.log('🎬 Current video ID:', originalVideoId);
            console.log('🎵 Song:', songData?.title || 'Unknown');
            console.log('🔗 URL:', songData?.url || 'Unknown');
        } else {
            // Error 150 is often a false positive - video usually plays anyway
            console.log('⚠️ YouTube embedding warning (video may still work):', event.data);
        }
        
        // Removed fallback logic - let the original video play
        console.log('🎵 Continuing with original video');
    };

    // Real-time tracking connected to YouTube player - ENHANCED - wrapped in useCallback
    const startTimeTracking = useCallback((player = youTubePlayer) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        if (!player) {
            console.warn('⚠️ No YouTube player available for time tracking');
            return;
        }
        
        let lastTime = -1;
        let stuckAtZeroCount = 0;
        
        intervalRef.current = setInterval(() => {
            try {
                const time = player.getCurrentTime();
                if (time !== undefined && !isNaN(time)) {
                    // Check if we're stuck at 0 for too long (video not actually playing)
                    if (time === 0 && lastTime === 0) {
                        stuckAtZeroCount++;
                        // If stuck at 0 for more than 2 seconds (20 intervals), stop tracking
                        if (stuckAtZeroCount > 20) {
                            console.warn('⚠️ Video stuck at 0s, stopping tracking until play');
                            stopTimeTracking();
                            return;
                        }
                    } else {
                        stuckAtZeroCount = 0; // Reset counter if time progresses
                    }
                    
                    // Check for time jumps (user seeking) - reset chord index if jumped more than 2 seconds
                    if (lastTime > 0 && Math.abs(time - lastTime) > 2) {
                        console.log(`🔄 Time jump detected: ${lastTime.toFixed(1)}s → ${time.toFixed(1)}s`);
                        // Force chord update for new position
                        updateCurrentChord(time, true);
                    } else {
                        updateCurrentChord(time);
                    }
                    
                    setCurrentTime(time);
                    
                    // Enhanced debug logging every 5 seconds (and only when time progresses)
                    if (Math.floor(time) % 5 === 0 && Math.floor(time) !== Math.floor(lastTime) && time > 0) {
                        const currentChord = realisticChords[currentChordIndex];
                        console.log(`⏰ Time: ${time.toFixed(1)}s | Current chord: ${currentChord?.chord || 'None'} | Index: ${currentChordIndex}`);
                    }
                    
                    lastTime = time;
                }
            } catch (error) {
                console.warn('Error getting YouTube player time:', error);
            }
        }, 100); // Update every 100ms for more precise tracking (was 250ms)
        
        console.log('⏰ Started enhanced real-time tracking (100ms intervals)');
    }, [youTubePlayer, realisticChords, currentChordIndex, updateCurrentChord]);

    const stopTimeTracking = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log('⏰ Stopped time tracking');
        }
    };

    // Setup audio player for uploaded files
    useEffect(() => {
        if (!isUploadedFile || !songData?.audioUrl) return;

        console.log('🎵 Setting up audio player for uploaded file:', songData.fileName);
        
        // Audio element event handlers
        const handleAudioPlay = () => {
            console.log('▶️ Audio started playing');
            setIsPlaying(true);
            setPlayerReady(true);
            setAudioReady(true);
            
            // Start tracking audio time for chord sync
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                if (audioRef.current) {
                    const time = audioRef.current.currentTime;
                    setCurrentTime(time);
                    updateCurrentChord(time);
                }
            }, 100); // Update every 100ms for smooth progression
        };

        const handleAudioPause = () => {
            console.log('⏸️ Audio paused');
            setIsPlaying(false);
            stopTimeTracking();
        };

        const handleAudioEnded = () => {
            console.log('🔚 Audio ended');
            setIsPlaying(false);
            setCurrentTime(0);
            stopTimeTracking();
        };

        const handleAudioTimeUpdate = () => {
            if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime);
            }
        };

        const handleAudioLoadedMetadata = () => {
            if (audioRef.current) {
                setDuration(audioRef.current.duration);
                setAudioReady(true);
                console.log('✅ Audio metadata loaded, duration:', audioRef.current.duration);
            }
        };

        const handleAudioError = (e) => {
            console.error('❌ Audio playback error:', e);
            setError('Failed to load audio file');
        };

        // Attach event listeners
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('play', handleAudioPlay);
            audio.addEventListener('pause', handleAudioPause);
            audio.addEventListener('ended', handleAudioEnded);
            audio.addEventListener('timeupdate', handleAudioTimeUpdate);
            audio.addEventListener('loadedmetadata', handleAudioLoadedMetadata);
            audio.addEventListener('error', handleAudioError);
        }

        // Cleanup
        return () => {
            if (audio) {
                audio.removeEventListener('play', handleAudioPlay);
                audio.removeEventListener('pause', handleAudioPause);
                audio.removeEventListener('ended', handleAudioEnded);
                audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleAudioLoadedMetadata);
                audio.removeEventListener('error', handleAudioError);
            }
            stopTimeTracking();
            // Revoke blob URL when component unmounts
            if (songData?.audioUrl) {
                URL.revokeObjectURL(songData.audioUrl);
            }
        };
    }, [isUploadedFile, songData?.audioUrl, songData?.fileName, updateCurrentChord]);
    
    // Process chord data - COMPLETELY PRESERVE ALL DETECTED CHORDS - Zero filtering
    const realisticChords = useMemo(() => {
        if (!songData?.chords || songData.chords.length === 0) return [];
        
        console.log('🎯 RAW CHORD DATA ANALYSIS:');
        console.log('🎯 Original count:', songData.chords.length);
        console.log('🎯 First 10 chords sample:', songData.chords.slice(0, 10));
        console.log('🎯 Last 5 chords sample:', songData.chords.slice(-5));
        console.log('🎯 Sample chord object structure:', songData.chords[0]);
        
        // Check for different chord name properties
        const chordNames = songData.chords.slice(0, 20).map(chord => ({
            chord: chord.chord,
            name: chord.name,
            symbol: chord.symbol,
            root: chord.root,
            quality: chord.quality,
            time: chord.time,
            start: chord.start,
            timestamp: chord.timestamp
        }));
        console.log('🎯 Chord name properties analysis:', chordNames);
        
        // ZERO FILTERING - preserve every single chord detection
        const processedChords = songData.chords
            .map((chord, index) => {
                // Try multiple property names for chord identification
                const chordName = chord.chord || chord.name || chord.symbol || 
                                chord.root || `Chord_${index}`;
                
                // Try multiple property names for timing
                let chordTime = chord.time !== undefined ? chord.time : 
                                 (chord.start !== undefined ? chord.start : 
                                 (chord.timestamp !== undefined ? chord.timestamp : index * 1.0));
                
                // IMPORTANT: If first chord starts at 0.0s, shift it to 1.0s for proper intro
                if (index === 0 && chordTime < 1.0) {
                    console.log(`🎯 First chord at ${chordTime}s shifted to 1.0s for intro period`);
                    chordTime = 1.0;
                }
                
                const chordDuration = chord.duration || chord.length || 1.0;
                
                return {
                    chord: chordName,
                    time: chordTime,
                    duration: chordDuration,
                    confidence: chord.confidence || 1.0,
                    function: chord.function || 'Unknown',
                    is_diatonic: chord.is_diatonic || false,
                    originalIndex: index,
                    originalData: chord // Keep original data for debugging
                };
            })
            .sort((a, b) => a.time - b.time);
        
        console.log('🎯 ZERO-FILTERED chord count:', processedChords.length);
        console.log('🎯 First 20 processed chords:', processedChords.slice(0, 20));
        
        // Analyze chord variety
        const uniqueChords = [...new Set(processedChords.map(c => c.chord))];
        console.log('🎯 Unique chords detected:', uniqueChords);
        console.log('🎯 Total unique chord count:', uniqueChords.length);
        
        // Check timing distribution
        const timings = processedChords.slice(0, 20).map(c => ({ chord: c.chord, time: c.time }));
        console.log('🎯 First 20 chord timings:', timings);
        
        return processedChords;
    }, [songData?.chords, songData?.duration]);

    // Handle play button click - Works for both YouTube and uploaded audio
    const handlePlayClick = () => {
        console.log('🎬 Play button clicked!', { 
            isUploadedFile,
            playerReady, 
            youTubePlayer: !!youTubePlayer,
            audioRef: !!audioRef.current,
            apiReady,
            originalVideoId,
            playerRefCurrent: !!playerRef.current
        });
        
        // Handle uploaded audio files
        if (isUploadedFile && audioRef.current) {
            try {
                if (isPlaying) {
                    audioRef.current.pause();
                    console.log('⏸️ Pausing audio file');
                } else {
                    audioRef.current.play();
                    console.log('▶️ Playing audio file');
                }
                return;
            } catch (error) {
                console.error('❌ Error controlling audio player:', error);
                alert('Failed to play audio file. Please try again.');
                return;
            }
        }
        
        // Handle YouTube videos
        if (!originalVideoId) {
            alert('No video URL found for this song.');
            return;
        }

        // Try to play even if playerReady is false - sometimes it works
        if (youTubePlayer) {
            try {
                if (isPlaying) {
                    youTubePlayer.pauseVideo();
                    console.log('⏸️ Pausing video via API');
                } else {
                    youTubePlayer.playVideo();
                    console.log('▶️ Playing video via API');
                }
            } catch (error) {
                console.error('❌ Error controlling YouTube player:', error);
                // Try to reinitialize player if it failed
                if (apiReady && originalVideoId && playerRef.current) {
                    console.log('🔄 Attempting to reinitialize YouTube player...');
                    initializeYouTubePlayer();
                }
            }
        } else {
            console.warn('⚠️ YouTube player not available, current state:', {
                playerReady,
                youTubePlayer: !!youTubePlayer,
                apiReady,
                originalVideoId
            });
            
            // Try to initialize player if not done yet
            if (apiReady && originalVideoId && playerRef.current) {
                console.log('🔄 Initializing YouTube player from play button click...');
                initializeYouTubePlayer();
            }
        }
    };

    // PRECISE chord synchronization with playback - respect original timing
    const updateCurrentChord = useCallback((time, forceUpdate = false) => {
        if (realisticChords.length === 0) return;
        
        let newChordIndex = -1;
        
        // Find the active chord with precise timing - no buffering, trust the analysis
        for (let i = 0; i < realisticChords.length; i++) {
            const chord = realisticChords[i];
            const nextChord = realisticChords[i + 1];
            
            const chordStartTime = chord.time;
            const chordEndTime = nextChord ? nextChord.time : (chord.time + chord.duration);
            
            // Precise matching - if the analysis says C plays from 1s to 7s, respect that exactly
            if (time >= chordStartTime && time < chordEndTime) {
                newChordIndex = i;
                break;
            }
        }
        
        // Handle last chord precisely
        if (newChordIndex === -1) {
            const lastChord = realisticChords[realisticChords.length - 1];
            if (time >= lastChord.time && time < (lastChord.time + lastChord.duration)) {
                newChordIndex = realisticChords.length - 1;
            }
        }
        
        // Update when chord changes or forced
        if (newChordIndex !== currentChordIndex || forceUpdate) {
            setCurrentChordIndex(newChordIndex);
            if (newChordIndex !== -1 && time > 0) {
                const currentChord = realisticChords[newChordIndex];
                const expectedEnd = (realisticChords[newChordIndex + 1]?.time || (currentChord.time + currentChord.duration));
                // Only log on actual chord changes, not every 100ms update
                if (newChordIndex !== currentChordIndex) {
                    console.log(`🎵 Chord changed: ${currentChord?.chord} at ${time.toFixed(1)}s (from ${currentChord?.time.toFixed(1)}s to ${expectedEnd.toFixed(1)}s)`);
                }
            }
        }
    }, [realisticChords, currentChordIndex]);

    // Seek to specific time in video
    const seekTo = useCallback((time) => {
        if (youTubePlayer && youTubePlayer.seekTo && typeof time === 'number' && !isNaN(time)) {
            try {
                youTubePlayer.seekTo(time, true);
                setCurrentTime(time);
                updateCurrentChord(time, true); // Force update chord after seeking
                console.log('🎯 Seeking to:', time.toFixed(1), 'seconds');
            } catch (error) {
                console.warn('Error seeking in YouTube player:', error);
            }
        } else {
            console.warn('⚠️ Cannot seek: YouTube player not ready');
        }
    }, [youTubePlayer, updateCurrentChord]);

    // Handle seek from ChordProgressionDisplay component
    const handleSeek = useCallback((time) => {
        seekTo(time);
    }, [seekTo]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Auto-scroll timeline to keep current chord visible - IMPROVED
    useEffect(() => {
        if (timelineRef.current && currentTime !== undefined) {
            const currentSecond = Math.floor(currentTime);
            
            // Try to find the current square element by data attribute
            const currentSquare = timelineRef.current.querySelector(`[data-second="${currentSecond}"]`);
            
            if (currentSquare) {
                // Use scrollIntoView for reliable centering - keeps highlight always visible
                currentSquare.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            } else {
                // Fallback to manual calculation if data attribute not found
                const squareWidth = 83; // 80px width + 3px margin
                const barWidth = 6; // bar lines add extra width
                const barsBeforeCurrent = Math.floor(currentSecond / 4);
                const scrollPosition = (currentSecond * squareWidth) + (barsBeforeCurrent * barWidth) - (timelineRef.current.clientWidth / 2);
                
                timelineRef.current.scrollTo({
                    left: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                });
            }
        }
    }, [currentTime]);

    // Format time helper
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Get unique chords
    const getUniqueChords = useCallback(() => {
        if (!realisticChords || realisticChords.length === 0) return [];
        
        // Count occurrences of each chord
        const chordCounts = {};
        realisticChords.forEach(item => {
            const chordName = item.chord;
            if (chordName && chordName !== 'Unknown') {
                chordCounts[chordName] = (chordCounts[chordName] || 0) + 1;
            }
        });
        
        // Convert to array of objects with chord name and count
        return Object.entries(chordCounts).map(([chord, count]) => ({
            chord,
            count
        }));
    }, [realisticChords]);

    // Get current and next chord - Default to first chords when not playing
    const currentChord = useMemo(() => {
        if (currentChordIndex >= 0 && realisticChords[currentChordIndex]) {
            return realisticChords[currentChordIndex].chord;
        }
        // Default to first chord if not playing yet
        if (realisticChords && realisticChords.length > 0 && realisticChords[0]?.chord) {
            return realisticChords[0].chord;
        }
        return null;
    }, [realisticChords, currentChordIndex]);
    
    const nextChord = useMemo(() => {
        if (currentChordIndex >= 0 && realisticChords[currentChordIndex + 1]) {
            return realisticChords[currentChordIndex + 1].chord;
        }
        // Default to second chord if not playing yet
        if (realisticChords && realisticChords.length > 1 && realisticChords[1]?.chord) {
            return realisticChords[1].chord;
        }
        return null;
    }, [realisticChords, currentChordIndex]);

    const songKey = useMemo(() => songData?.key || 'C Major', [songData?.key]);

    return (
        <div className="player-page" style={{ 
            minHeight: '80vh', 
            backgroundColor: '#1a1a1a', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            
            {/* Main Container - Proper containment */}
            <div style={{
                flex: 1,
                maxWidth: '1800px',
                margin: '0 auto',
                padding: '20px',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}>
                {/* Back Button and Song Info */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    padding: '15px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white'
                }}>
                    <button 
                        onClick={() => history.push('/')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#61dafb',
                            color: 'black',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        ← Back to Search
                    </button>
                    
                    <div style={{ textAlign: 'center', flex: 1, margin: '0 20px' }}>
                        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
                            {songData?.song_name || songData?.title || 'Unknown Song'}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '5px 0' }}>
                            <p style={{ margin: 0, opacity: 0.8 }}>
                                Key: {songKey} • {getUniqueChords().length} unique chords
                            </p>
                            <ChordQualityBadge 
                                source={songData?.analysis_type || songData?.source || 'pattern'} 
                                confidence={songData?.confidence}
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handlePlayClick}
                        style={{
                            padding: '15px 25px',
                            fontSize: '18px',
                            backgroundColor: isPlaying ? '#ff4444' : '#44ff44',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            minWidth: '120px'
                        }}
                    >
                        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                    </button>
                </div>

                {/* Two-Column Layout: Video Player + Unique Chords Dashboard */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 1024 ? '2fr 1fr' : '1fr',
                    gap: '20px',
                    marginBottom: '20px'
                }}>
                    {/* LEFT COLUMN: YouTube Video Player OR Audio Visualizer Section */}
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        padding: '20px'
                    }}>
                        <h3 style={{ color: 'white', marginBottom: '15px', textAlign: 'center' }}>
                            {isUploadedFile ? '� Audio Player' : '�🎥 Video Player'}
                        </h3>
                        
                        {isUploadedFile ? (
                            // Audio player with visualizer for uploaded files
                            <div>
                                <p style={{ color: audioReady ? '#90EE90' : '#FFD700', marginBottom: '10px', textAlign: 'center' }}>
                                    {audioReady ? '✅' : '🔄'} {songData.title} 
                                    {audioReady ? ' (Ready)' : ' (Loading...)'}
                                </p>
                                
                                {/* Hidden audio element */}
                                <audio
                                    ref={audioRef}
                                    src={songData.audioUrl}
                                    preload="metadata"
                                    style={{ display: 'none' }}
                                />
                                
                                {/* Audio visualizer */}
                                <AudioVisualizer 
                                    audioRef={audioRef}
                                    isPlaying={isPlaying}
                                    title={songData.title}
                                    artist={songData.artist || 'Uploaded File'}
                                />
                                
                                <div style={{ marginTop: '10px', fontSize: '14px', color: 'white', opacity: 0.8, textAlign: 'center' }}>
                                    <p>🎵 Chord progression synced with audio playback</p>
                                    <p>⏰ Real-time tracking: {isPlaying ? 'Active' : 'Paused'}</p>
                                    <p>🎸 AI Accuracy: {songData.accuracy || '90-95'}%</p>
                                </div>
                            </div>
                        ) : originalVideoId ? (
                            // YouTube video player
                            <div>
                                <p style={{ color: playerReady ? '#90EE90' : '#FFD700', marginBottom: '10px', textAlign: 'center' }}>
                                    {playerReady ? '✅' : '🔄'} {songData.title} 
                                    {playerReady ? ' (Ready)' : ' (Loading...)'}
                                </p>
                                <div 
                                    ref={playerRef}
                                    style={{
                                        width: '100%',
                                        height: '450px',
                                        borderRadius: '10px',
                                        backgroundColor: '#000'
                                    }}
                                ></div>
                                <div style={{ marginTop: '10px', fontSize: '14px', color: 'white', opacity: 0.8, textAlign: 'center' }}>
                                    <p>🎵 Chord progression synced with video playback</p>
                                    <p>⏰ Real-time tracking: {isPlaying ? 'Active' : 'Paused'}</p>
                                </div>
                            </div>
                        ) : (
                            // Fallback when no video available
                            <div style={{
                                width: '100%',
                                height: '450px',
                                backgroundColor: '#000',
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '18px'
                            }}>
                                <p>🎬 Video ready to play</p>
                                <p style={{ fontSize: '14px', opacity: 0.7 }}>
                                    Ready: {originalVideoId ? `Video ${originalVideoId}` : 'No video found'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Unique Chords Practice Dashboard */}
                    <div style={{
                        backgroundColor: 'rgba(108, 92, 231, 0.15)',
                        border: '2px solid rgba(108, 92, 231, 0.4)',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'fit-content'
                    }}>
                        <h3 style={{ 
                            color: '#FFD700', 
                            marginBottom: '10px', 
                            textAlign: 'center',
                            fontSize: '18px',
                            fontWeight: '700',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                            🎸 Song Chords ({getUniqueChords().length} unique)
                        </h3>
                        
                        <p style={{ 
                            color: '#fff', 
                            fontSize: '13px', 
                            textAlign: 'center', 
                            marginBottom: '15px',
                            opacity: 0.9
                        }}>
                            Practice difficult chords before playing
                        </p>

                        {/* Unique Chords List with Frequency Bars */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            maxHeight: '350px',
                            marginBottom: '15px'
                        }}>
                            {getUniqueChords()
                                .sort((a, b) => b.count - a.count) // Sort by frequency (most common first)
                                .map((chordData, index) => {
                                    const maxCount = Math.max(...getUniqueChords().map(c => c.count));
                                    const percentage = (chordData.count / maxCount) * 100;
                                    
                                    return (
                                        <div 
                                            key={index}
                                            style={{
                                                marginBottom: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                                                e.currentTarget.style.transform = 'translateX(5px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                            onClick={() => {
                                                // TODO Phase 2: Open practice mode for this chord
                                                alert(`🎸 Practice mode for ${chordData.chord} coming in Phase 2!\n\nThis chord appears ${chordData.count} times in the song.`);
                                            }}
                                        >
                                            {/* Frequency Bar Background (Equalizer Style) */}
                                            <div style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                height: '100%',
                                                width: `${percentage}%`,
                                                background: `linear-gradient(90deg, rgba(255, 215, 0, 0.6), rgba(255, 140, 0, 0.4), rgba(108, 92, 231, 0.3))`,
                                                borderRadius: '8px',
                                                zIndex: 0,
                                                transition: 'width 0.3s ease',
                                                boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                                            }}></div>

                                            {/* Chord Info (Above frequency bar) */}
                                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ 
                                                        fontSize: '18px', 
                                                        fontWeight: '700',
                                                        color: '#FFD700',
                                                        textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                                                    }}>
                                                        {chordData.chord}
                                                    </span>
                                                    <span style={{ 
                                                        fontSize: '12px', 
                                                        color: '#fff',
                                                        opacity: 0.8,
                                                        backgroundColor: 'rgba(108, 92, 231, 0.5)',
                                                        padding: '2px 8px',
                                                        borderRadius: '10px'
                                                    }}>
                                                        {chordData.count}x
                                                    </span>
                                                </div>
                                                
                                                {/* Mini equalizer visualization */}
                                                <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end' }}>
                                                    {[...Array(3)].map((_, i) => (
                                                        <div 
                                                            key={i}
                                                            style={{
                                                                width: '4px',
                                                                height: `${8 + (chordData.count % 3) * (i + 1) * 3}px`,
                                                                backgroundColor: '#6c5ce7',
                                                                borderRadius: '2px',
                                                                opacity: 0.6
                                                            }}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    // TODO Phase 2: Open practice mode for all unique chords
                                    alert(`🎯 Practice All Chords mode coming in Phase 2!\n\nYou'll be able to practice all ${getUniqueChords().length} unique chords with isolated audio segments.`);
                                }}
                                style={{
                                    padding: '12px 20px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    backgroundColor: '#6c5ce7',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#5848c7';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(108, 92, 231, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#6c5ce7';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                🎓 Practice All Chords
                            </button>

                            <button
                                onClick={() => {
                                    // Skip practice and play the song directly
                                    if (youTubePlayer && playerReady) {
                                        if (isPlaying) {
                                            youTubePlayer.pauseVideo();
                                        } else {
                                            youTubePlayer.playVideo();
                                        }
                                    }
                                }}
                                style={{
                                    padding: '12px 20px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    color: '#FFD700',
                                    border: '2px solid rgba(255, 215, 0, 0.3)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.6)';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                ⏭️ Skip & Play Song
                            </button>
                        </div>
                    </div>
                </div>

                {/* Professional Guitar Learning Interface with Chord Progression */}
                <ChordProgressionDisplay
                    realisticChords={realisticChords}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                    currentChord={currentChord}
                    currentChordIndex={currentChordIndex}
                    seekTo={seekTo}
                />

                {/* FRETBOARD SECTION - Bottom of Layout */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '15px',
                    padding: '25px',
                    marginTop: '20px'
                }}>
                    <h3 style={{ 
                        color: 'white', 
                        marginBottom: '20px', 
                        textAlign: 'center',
                        fontSize: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        🎸 Guitar Fretboard
                    </h3>
                    
                    {/* Split Layout: NOW PLAYING (Left) + UP NEXT (Right) */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
                        gap: '30px'
                    }}>
                        {/* LEFT: NOW PLAYING Fretboard */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(255, 243, 176, 0.1), rgba(255, 224, 130, 0.05))',
                            border: '2px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: '12px',
                            padding: '20px'
                        }}>
                            <div style={{
                                color: '#FFD700',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                marginBottom: '15px',
                                textAlign: 'center'
                            }}>● NOW PLAYING</div>
                            <ChordProgressionDisplay
                                realisticChords={realisticChords}
                                currentTime={currentTime}
                                onSeek={handleSeek}
                                currentChord={currentChord || realisticChords[0]?.chord}
                                currentChordIndex={currentChordIndex}
                                displayMode="current-only"
                            />
                        </div>

                        {/* RIGHT: UP NEXT Fretboard */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(137, 155, 232, 0.1))',
                            border: '2px solid rgba(108, 92, 231, 0.3)',
                            borderRadius: '12px',
                            padding: '20px'
                        }}>
                            <div style={{
                                color: '#6c5ce7',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                marginBottom: '15px',
                                textAlign: 'center'
                            }}>○ UP NEXT</div>
                            <ChordProgressionDisplay
                                realisticChords={realisticChords}
                                currentTime={currentTime}
                                onSeek={handleSeek}
                                currentChord={nextChord || realisticChords[1]?.chord}
                                currentChordIndex={currentChordIndex + 1}
                                displayMode="next-only"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;