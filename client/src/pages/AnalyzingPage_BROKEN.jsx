/**
 * ðŸŽµ AnalyzingPage - Full-screen progress page for song analysis
 * Shows beautiful overlay while analyzing, then navigates to player
 */

import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { analyzeSong, addToHistory } f            <!-- Guitar Icon - PROMINENT & ANIMATED at TOP -->
            <div style="
                font-size: 96px;
                margin-bottom: 20px;
                animation: bounce 1.5s ease-in-out infinite, rotate360 4s linear infinite;
                filter: drop-shadow(0 8px 25px rgba(108, 92, 231, 0.6));
                position: relative;
                z-index: 10;
            ">ðŸŽ¸</div>
            
            <!-- Song Thumbnail with SPINNING RAINBOW GRADIENT BORDER -->
            <div style="
                position: relative;
                width: 140px;
                height: 140px;
                margin-bottom: 28px;
                animation: float 3s ease-in-out infinite;
            ">
                <!-- Outer spinning rainbow gradient border (VERY PROMINENT) -->
                <div style="
                    position: absolute;
                    top: -6px;
                    left: -6px;
                    right: -6px;
                    bottom: -6px;
                    background: conic-gradient(
                        from 0deg,
                        #6c5ce7 0deg,
                        #a855f7 90deg,
                        #ec4899 180deg,
                        #fbbf24 270deg,
                        #6c5ce7 360deg
                    );
                    border-radius: 24px;
                    animation: rotateBorder 3s linear infinite;
                    box-shadow: 0 0 30px rgba(108, 92, 231, 0.8);
                "></div>
                
                <!-- Inner white border for contrast -->
                <div style="
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: white;
                    border-radius: 22px;
                    z-index: 1;
                "></div>
                
                <!-- Thumbnail image -->
                <div style="
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 15px 50px rgba(108, 92, 231, 0.4);
                    z-index: 2;
                ">
                    <img 
                        src="${thumbnail}" 
                        alt="${song?.title || 'Song'}"
                        style="
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        "
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22%3E%3Crect fill=%22%236c5ce7%22 width=%22140%22 height=%22140%22/%3E%3Ctext x=%2270%22 y=%2285%22 font-size=%2260%22 text-anchor=%22middle%22%3EðŸŽµ%3C/text%3E%3C/svg%3E'"
                    />
                </div>
            </div>
            
            <!-- Status Text -->
            <div style="
                font-size: 42px;
                font-weight: 800;
                background: linear-gradient(135deg, #6c5ce7 0%, #a855f7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 16px;
                text-align: center;
                letter-spacing: -0.5px;
            ">ANALYZING</div>';
import { useAuth } from '../hooks/useAuth';
import '../styles/components/analyzing-page.css';

const AnalyzingPage = () => {
    const history = useHistory();
    const location = useLocation();
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);

    // Get song data from location state
    const song = location.state?.song;

    // DEBUG - Log only once per mount
    useEffect(() => {
        console.log('ðŸš¨ ANALYZING PAGE MOUNTED!');
        console.log('Song:', song?.title);
    }, []);

    useEffect(() => {
        // If no song data, go back to home
        if (!song) {
            console.error('âŒ No song data provided to AnalyzingPage');
            history.push('/');
            return;
        }

        const analyzeSongAndNavigate = async () => {
            console.log('ðŸŽµ AnalyzingPage: Starting analysis for:', song.title);
            
            const startTime = Date.now();
            const minimumDisplayTime = 5000; // Show overlay for at least 5 seconds

            try {
                // Analyze the song
                const data = await analyzeSong(song);
                console.log('ðŸ“¦ AnalyzingPage: API response received:', data);

                if (data.status === 'success' && data.analysis?.chords?.length > 0) {
                    console.log('âœ… Analysis complete:', data.analysis.chords.length, 'chords');
                    
                    const songVideoId = song.videoId || song.id?.videoId || song.id;
                    
                    // Prepare song data for player
                    const songData = {
                        ...song,
                        chords: data.analysis.chords,
                        duration: data.analysis.duration,
                        analysis_type: data.analysis.analysis_type || 'mock_progression',
                        title: song.title,
                        key: data.analysis.key,
                        bpm: data.analysis.bpm,
                        time_signature: data.analysis.time_signature,
                        source: data.analysis.source,
                        accuracy: data.analysis.accuracy,
                        analysis_metadata: data.analysis.analysis_metadata,
                        youtubeUrl: song.url || `https://www.youtube.com/watch?v=${songVideoId}`
                    };

                    // Add to history if user is logged in
                    if (user) {
                        addToHistory(songData);
                    }

                    // Calculate remaining display time
                    const elapsedTime = Date.now() - startTime;
                    const remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);

                    console.log(`â³ Elapsed: ${elapsedTime}ms, Remaining: ${remainingTime}ms`);

                    // Wait for remaining time if needed
                    if (remainingTime > 0) {
                        await new Promise(resolve => setTimeout(resolve, remainingTime));
                    }

                    // Navigate to player page
                    console.log('ðŸš€ Navigating to player page with data');
                    history.replace('/player', songData);

                } else {
                    console.error('âŒ No chord analysis available');
                    const friendlyError = {
                        title: 'ðŸŽµ Analysis In Progress',
                        message: "Our AI is still learning this song! We'll use estimated chords for now.",
                        action: 'Using music theory patterns...'
                    };
                    setError(friendlyError.message);
                    
                    // Still navigate but with fallback chords
                    setTimeout(() => {
                        history.replace('/player', {
                            ...song,
                            chords: [], // Will trigger fallback
                            analysis_type: 'pattern_based'
                        });
                    }, 1500);
                }

            } catch (err) {
                console.error('ðŸ’¥ Analysis failed:', err);
                
                // User-friendly error messages
                const errorMessages = {
                    'Network Error': {
                        title: 'ðŸŒ Connection Issue',
                        message: 'Please check your internet connection',
                        action: 'Retrying...'
                    },
                    'Video not found': {
                        title: 'ðŸ“¹ Video Not Available',
                        message: 'This video might be private or removed',
                        action: 'Try searching for another version'
                    },
                    default: {
                        title: 'âš¡ Processing...',
                        message: "We're analyzing this song! Using estimated chords for now.",
                        action: 'Preparing player...'
                    }
                };
                
                const errorType = err.message?.includes('Network') ? 'Network Error' :
                                err.message?.includes('not found') ? 'Video not found' : 'default';
                const errorInfo = errorMessages[errorType];
                
                setError(errorInfo.message);
                
                // Navigate with fallback instead of going back
                setTimeout(() => {
                    history.replace('/player', {
                        ...song,
                        chords: [],
                        analysis_type: 'estimated',
                        error: errorInfo.message
                    });
                }, 1500);
            }
        };

        analyzeSongAndNavigate();
    }, [song, history, user]);

    console.log('ðŸŽ¬ AnalyzingPage rendering - Progress:', Math.round(progress), '%');

    // Animate progress bar - memoized to prevent re-renders
    useEffect(() => {
        console.log('ðŸ“Š Starting progress animation');
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 300);
        return () => {
            console.log('ðŸ›‘ Stopping progress animation');
            clearInterval(interval);
        };
    }, []); // Empty dependency array - set up ONCE

    // FORCE body background during overlay display - ONLY ONCE
    useEffect(() => {
        console.log('ðŸŽ¨ Setting up body background - ONE TIME ONLY');
        
        // CLEANUP ANY LEFTOVER DEBUG ELEMENTS FIRST
        const debugElements = [
            'force-overlay-test',
            'analyzing-test-box', 
            'analyzing-debug-box'
        ];
        debugElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.remove();
                console.log(`ðŸ—‘ï¸ Removed debug element: ${id}`);
            }
        });
        
        // Store original body style
        const originalBackground = document.body.style.background;
        const originalOverflow = document.body.style.overflow;
        
        // Apply purple gradient to body - using cssText for maximum compatibility
        document.body.style.cssText += `
            background: linear-gradient(135deg, #6c5ce7 0%, #a855f7 100%) !important;
            background-attachment: fixed !important;
            overflow: hidden !important;
            min-height: 100vh !important;
        `;
        
        console.log('âœ… Applied body background:', document.body.style.background);
        
        // Cleanup - restore original styles
        return () => {
            console.log('ðŸ§¹ Cleaning up body background');
            document.body.style.background = originalBackground;
            document.body.style.overflow = originalOverflow;
        };
    }, []); // Empty dependency array - run ONCE

    if (!song) {
        console.log('âŒ No song - showing fallback');
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
