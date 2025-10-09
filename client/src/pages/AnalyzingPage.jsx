/**
 * 🎵 AnalyzingPage - Full-screen page for song analysis
 * Shows beautiful overlay while analyzing, then navigates to player
 */

import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { analyzeSong, analyzeUploadedAudio, addToHistory } from '../services/api';
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
        console.log('🚨 ANALYZING PAGE MOUNTED!');
        console.log('Song:', song?.title);
        console.log('Song source:', song?.source);
        console.log('Song fileData:', song?.fileData);
        console.log('Song fileName:', song?.fileName);
        console.log('Has fileData?', !!song?.fileData);
        console.log('Full song object:', song);
    }, []);

    useEffect(() => {
        // If no song data, go back to home
        if (!song) {
            console.error('❌ No song data provided to AnalyzingPage');
            history.push('/');
            return;
        }

        const analyzeSongAndNavigate = async () => {
            console.log('🎵 AnalyzingPage: Starting analysis for:', song.title);
            
            const startTime = Date.now();
            const minimumDisplayTime = 5000; // Show overlay for at least 5 seconds

            try {
                let data;
                
                // Check if this is a file upload or YouTube song
                if (song.source === 'upload' && song.fileData) {
                    console.log('📁 File upload detected, analyzing uploaded file...');
                    console.log('📁 File name:', song.fileName);
                    
                    // Use the FormData directly from HomePage
                    data = await analyzeUploadedAudio(song.fileData, song.fileName);
                } else {
                    console.log('🎬 YouTube song detected, analyzing from URL...');
                    data = await analyzeSong(song);
                }
                
                console.log('📦 AnalyzingPage: API response received:', data);

                if (data.status === 'success' && data.analysis?.chords?.length > 0) {
                    console.log('✅ Analysis complete:', data.analysis.chords.length, 'chords');
                    
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

                    console.log(`⏳ Elapsed: ${elapsedTime}ms, Remaining: ${remainingTime}ms`);

                    // Wait for remaining time if needed
                    if (remainingTime > 0) {
                        await new Promise(resolve => setTimeout(resolve, remainingTime));
                    }

                    // Navigate to player page
                    console.log('🚀 Navigating to player page with data');
                    history.replace('/player', songData);

                } else {
                    console.error('❌ No chord analysis available');
                    const friendlyError = {
                        title: '🎵 Analysis In Progress',
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
                console.error('💥 Analysis failed:', err);
                
                // User-friendly error messages
                const errorMessages = {
                    'Network Error': {
                        title: '🌐 Connection Issue',
                        message: 'Please check your internet connection',
                        action: 'Retrying...'
                    },
                    'Video not found': {
                        title: '📹 Video Not Available',
                        message: 'This video might be private or removed',
                        action: 'Try searching for another version'
                    },
                    default: {
                        title: '⚡ Processing...',
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

    console.log('🎬 AnalyzingPage rendering - Progress:', Math.round(progress), '%');

    // Animate progress bar - memoized to prevent re-renders
    useEffect(() => {
        console.log('📊 Starting progress animation');
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 300);
        return () => {
            console.log('🛑 Stopping progress animation');
            clearInterval(interval);
        };
    }, []); // Empty dependency array - set up ONCE

    // FORCE body background during overlay display - ONLY ONCE
    useEffect(() => {
        console.log('🎨 Setting up body background - ONE TIME ONLY');
        
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
                console.log(`🗑️ Removed debug element: ${id}`);
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
        
        console.log('✅ Applied body background:', document.body.style.background);
        
        // Cleanup - restore original styles
        return () => {
            console.log('🧹 Cleaning up body background');
            document.body.style.background = originalBackground;
            document.body.style.overflow = originalOverflow;
        };
    }, []); // Empty dependency array - run ONCE

    if (!song) {
        console.log('❌ No song - showing fallback');
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999
            }}>
                <h1 style={{ color: 'white', fontSize: '24px' }}>No song data...</h1>
            </div>
        );
    }

    // Create stunning, eye-catching analyzing overlay
    useEffect(() => {
        console.log('🎨 Creating enhanced analyzing overlay');
        
        // Remove any existing overlay
        const existing = document.getElementById('analyzing-overlay');
        if (existing) existing.remove();
        
        // Get song thumbnail or use placeholder
        const thumbnail = song?.thumbnail || `https://img.youtube.com/vi/${song?.videoId}/mqdefault.jpg`;
        
        // Create overlay container with beautiful styling
        const overlay = document.createElement('div');
        overlay.id = 'analyzing-overlay';
        overlay.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 600px !important;
            max-width: 90vw !important;
            background: rgba(255, 255, 255, 0.98) !important;
            border-radius: 32px !important;
            z-index: 2147483647 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 60px 50px !important;
            box-shadow: 
                0 30px 90px rgba(108, 92, 231, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.8) inset,
                0 0 100px rgba(168, 85, 247, 0.3) !important;
            backdrop-filter: blur(20px) !important;
            animation: fadeInScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        `;
        
        overlay.innerHTML = `
            <!-- Guitar Icon - PROMINENT & ANIMATED at TOP -->
            <div style="
                font-size: 96px;
                margin-bottom: 20px;
                animation: bounce 1.5s ease-in-out infinite, rotate360 12s linear infinite;
                filter: drop-shadow(0 8px 20px rgba(108, 92, 231, 0.5)) drop-shadow(0 0 30px rgba(168, 85, 247, 0.4));
            ">🎸</div>
            
            <!-- Song Thumbnail with ENHANCED Spinning Rainbow Border -->
            <div style="
                position: relative;
                width: 140px;
                height: 140px;
                margin-bottom: 28px;
                border-radius: 20px;
                overflow: visible;
                animation: float 3s ease-in-out infinite;
            ">
                <!-- Outer spinning rainbow gradient border (VERY PROMINENT) -->
                <div style="
                    position: absolute;
                    top: -6px;
                    left: -6px;
                    right: -6px;
                    bottom: -6px;
                    background: conic-gradient(from 0deg, 
                        #a855f7 0%, 
                        #ec4899 25%, 
                        #f59e0b 50%, 
                        #10b981 75%, 
                        #6366f1 100%
                    );
                    border-radius: 24px;
                    animation: rotate 3s linear infinite;
                    filter: blur(2px);
                "></div>
                
                <!-- White inner border for contrast -->
                <div style="
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: white;
                    border-radius: 22px;
                "></div>
                
                <!-- Image container -->
                <div style="
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(108, 92, 231, 0.5);
                ">
                    <img 
                        src="${thumbnail}" 
                        alt="${song?.title || 'Song'}"
                        style="
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        "
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22%3E%3Crect fill=%22%236c5ce7%22 width=%22140%22 height=%22140%22/%3E%3Ctext x=%2270%22 y=%2280%22 font-size=%2260%22 text-anchor=%22middle%22%3E🎵%3C/text%3E%3C/svg%3E'"
                    />
                </div>
            </div>
            
            <!-- Animated Icon (keeping for backwards compatibility, hidden) -->
            <div style="
                font-size: 0px;
                margin-bottom: 0px;
                animation: bounce 1.5s ease-in-out infinite;
                filter: drop-shadow(0 5px 15px rgba(108, 92, 231, 0.3));
            ">�</div>
            
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
            ">ANALYZING</div>
            
            <!-- Song Title -->
            <div style="
                font-size: 20px;
                color: #4a5568;
                margin-bottom: 12px;
                text-align: center;
                max-width: 450px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 600;
            ">${song?.title || 'Song'}</div>
            
            <!-- Artist -->
            <div style="
                font-size: 16px;
                color: #718096;
                margin-bottom: 36px;
                text-align: center;
                font-weight: 500;
            ">${song?.artist || song?.channel || 'Unknown Artist'}</div>
            
            <!-- Progress Steps -->
            <div style="
                display: flex;
                gap: 12px;
                margin-bottom: 28px;
                align-items: center;
            ">
                <div class="step-dot" style="
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6c5ce7, #a855f7);
                    animation: pulse-dot 1.5s ease-in-out infinite;
                    box-shadow: 0 0 20px rgba(108, 92, 231, 0.6);
                "></div>
                <div class="step-dot" style="
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6c5ce7, #a855f7);
                    animation: pulse-dot 1.5s ease-in-out infinite 0.3s;
                    box-shadow: 0 0 20px rgba(108, 92, 231, 0.6);
                "></div>
                <div class="step-dot" style="
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6c5ce7, #a855f7);
                    animation: pulse-dot 1.5s ease-in-out infinite 0.6s;
                    box-shadow: 0 0 20px rgba(108, 92, 231, 0.6);
                "></div>
            </div>
            
            <!-- Progress Bar Container -->
            <div style="
                width: 100%;
                max-width: 400px;
                height: 12px;
                background: linear-gradient(90deg, rgba(108, 92, 231, 0.1), rgba(168, 85, 247, 0.1));
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
                <div id="progress-fill" style="
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #6c5ce7 0%, #a855f7 50%, #ec4899 100%);
                    background-size: 200% 100%;
                    transition: width 0.3s ease;
                    border-radius: 6px;
                    box-shadow: 0 0 20px rgba(108, 92, 231, 0.5);
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
            
            <!-- Status Message -->
            <div id="status-message" style="
                margin-top: 24px;
                font-size: 15px;
                color: #6c5ce7;
                font-weight: 600;
                animation: fadeInOut 2s ease-in-out infinite;
            ">Detecting chord progressions with AI...</div>
            
            <!-- ENHANCED Sparkle particles with Emoji Icons -->
            <div style="
                position: absolute;
                top: 15%;
                left: 10%;
                font-size: 24px;
                animation: sparkleFloat 3s ease-in-out infinite;
                filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 20px rgba(251, 191, 36, 0.5));
            ">✨</div>
            <div style="
                position: absolute;
                top: 25%;
                right: 12%;
                font-size: 26px;
                animation: sparkleFloat 2.5s ease-in-out infinite 0.5s;
                filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.5));
            ">⭐</div>
            <div style="
                position: absolute;
                bottom: 20%;
                left: 15%;
                font-size: 28px;
                animation: sparkleFloat 3.5s ease-in-out infinite 1s;
                filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));
            ">💫</div>
            <div style="
                position: absolute;
                top: 40%;
                right: 8%;
                font-size: 24px;
                animation: sparkleFloat 2.8s ease-in-out infinite 1.5s;
                filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.8)) drop-shadow(0 0 20px rgba(245, 158, 11, 0.5));
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
                filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.5));
            ">💎</div>
        `;
        
        // Add enhanced animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInScale {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
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
            
            @keyframes pulse-dot {
                0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.5);
                    opacity: 0.7;
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
            
            @keyframes fadeInOut {
                0%, 100% {
                    opacity: 0.7;
                }
                50% {
                    opacity: 1;
                }
            }
            
            @keyframes sparkle {
                0%, 100% {
                    opacity: 0;
                    transform: scale(0);
                }
                50% {
                    opacity: 1;
                    transform: scale(1);
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
        console.log('✅ Enhanced analyzing overlay created');
        
        // Animate progress bar
        let progress = 0;
        const progressInterval = setInterval(() => {
            const bar = document.getElementById('progress-fill');
            if (bar && progress < 90) {
                progress += Math.random() * 8;
                bar.style.width = `${Math.min(progress, 90)}%`;
            }
        }, 200);
        
        // Update status messages
        const messages = [
            'Detecting chord progressions with AI...',
            'Analyzing musical patterns...',
            'Finding guitar fingerings...',
            'Processing harmonies...',
            'Almost there...'
        ];
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            const statusEl = document.getElementById('status-message');
            if (statusEl) {
                messageIndex = (messageIndex + 1) % messages.length;
                statusEl.textContent = messages[messageIndex];
            }
        }, 2000);
        
        // Cleanup
        return () => {
            console.log('🧹 Cleanup - removing analyzing overlay');
            clearInterval(progressInterval);
            clearInterval(messageInterval);
            const box = document.getElementById('analyzing-overlay');
            if (box) box.remove();
            if (style.parentNode) style.parentNode.removeChild(style);
        };
    }, [song]);

    // Return null - DOM manipulation handles the overlay rendering
    return null;
};

export default AnalyzingPage;
