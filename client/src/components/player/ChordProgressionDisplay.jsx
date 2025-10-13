import React, { useEffect, useState, useRef, useMemo } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import '../../styles/components/player.css';
import '../../styles/components/chord-progression-pro.css';
// REDESIGNED: Professional horizontal fretboards with demo-style layout v3.0 - CAGED + Dynamic Frets
const ChordProgressionDisplay = ({ currentChord, nextChord, realisticChords, currentChordIndex, currentTime, displayMode, seekTo }) => {
    const [displayedChords, setDisplayedChords] = useState([]);
    const timelineRef = useRef(null);
    
    // ALWAYS LOG - Basic debug for data reception
    console.log('🎸 ChordProgressionDisplay v3.0 RENDER - CAGED + DYNAMIC FRETS:', {
        currentChord,
        nextChord,
        realisticChordsCount: realisticChords?.length || 0,
        currentChordIndex,
        currentTime,
        displayMode,
        firstChord: realisticChords?.[0]?.chord,
        firstChordTime: realisticChords?.[0]?.time,
        version: 'v3.0-UPDATED'
    });
    // IMMEDIATE CHECK: Are we getting any chord data at all?
    if (!realisticChords || realisticChords.length === 0) {
        console.log('❌ NO CHORD DATA - ChordProgressionDisplay received empty or null realisticChords');
        return (
            <div className="professional-chord-learning-interface">
                <div className="main-chord-display">
                    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                        <h3>❌ No Chord Data Available</h3>
                        <p>The chord progression display is not receiving any chord data.</p>
                        <p>Please check that a song is loaded and analyzed properly.</p>
                    </div>
                </div>
            </div>
        );
    }
    // Debug logging to see actual chord data
    useEffect(() => {
        if (realisticChords && realisticChords.length > 0) {
            console.log('🔍 DEBUG: ChordProgressionDisplay received chord data:');
            console.log('  - Total chords:', realisticChords.length);
            console.log('  - Current time:', currentTime?.toFixed(1), 'seconds');
            console.log('  - Around 20-25 seconds:');
            const around20to25 = realisticChords.filter(c => c.time >= 18 && c.time <= 27);
            around20to25.forEach(c => {
                console.log(`    ${c.time.toFixed(1)}s: ${c.chord}`);
            });
            console.log('  - Full progression (first 15):');
            realisticChords.slice(0, 15).forEach((c, i) => {
                console.log(`    [${i}] ${c.time.toFixed(1)}s: ${c.chord}`);
            });
        }
    }, [realisticChords, currentTime]);
    // Auto-scroll timeline to current position - FIXED for long durations
    useEffect(() => {
        if (timelineRef.current && currentTime !== undefined) {
            const currentSecond = Math.floor(currentTime);
            
            // Try to find the current square by data-second attribute
            const currentSquare = timelineRef.current.querySelector(`[data-second="${currentSecond}"]`);
            
            if (currentSquare) {
                // Scroll the current square into view (centered)
                currentSquare.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            } else {
                // Fallback calculation if element not found
                const squareWidth = 89; // 85px width + 4px margin
                const barWidth = 8; // bar lines add extra width every 4 squares
                const barsBeforeCurrent = Math.floor(currentSecond / 4);
                const scrollPosition = (currentSecond * squareWidth) + (barsBeforeCurrent * barWidth) - (timelineRef.current.clientWidth / 2);
                
                timelineRef.current.scrollTo({
                    left: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                });
            }
        }
    }, [currentTime]);
    
    // Derive current and next chord from the data if not provided
    const getCurrentChord = () => {
        if (currentChord && currentChord !== 'Am') return currentChord; // Don't use fallback 'Am'
        if (!realisticChords || realisticChords.length === 0) return null;
        // Find chord based on current time using more precise logic
        const time = currentTime || 0;
        let foundChord = null;
        // SPECIAL CASE: If we're before the first chord, show "Intro" or first chord name
        if (time < realisticChords[0].time) {
            console.log(`🎵 Before first chord (${realisticChords[0].chord} at ${realisticChords[0].time}s) - showing intro`);
            return `→ ${realisticChords[0].chord}`; // Show "→ D7" for upcoming chord
        }
        // Find the active chord at current time
        for (let i = 0; i < realisticChords.length; i++) {
            const chord = realisticChords[i];
            const nextChord = realisticChords[i + 1];
            // Calculate when this chord ends
            const chordEndTime = nextChord ? nextChord.time : (chord.time + (chord.duration || 2));
            // Check if current time falls within this chord's duration
            if (time >= chord.time && time < chordEndTime) {
                foundChord = chord.chord;
                break;
            }
        }
        // If no chord found yet, find the last chord that started before current time
        if (!foundChord) {
            for (let i = realisticChords.length - 1; i >= 0; i--) {
                if (realisticChords[i].time <= time) {
                    foundChord = realisticChords[i].chord;
                    break;
                }
            }
        }
        // Debug logging for specific time ranges
        if (currentTime >= 0 && currentTime <= 10) {
            console.log(`🎵 getCurrentChord at ${currentTime?.toFixed(1)}s: found "${foundChord}"`);
            console.log('  - First 5 chords with durations:');
            realisticChords.slice(0, 5).forEach((c, i) => {
                const nextC = realisticChords[i + 1];
                const endTime = nextC ? nextC.time : (c.time + (c.duration || 2));
                const isMatch = currentTime >= c.time && currentTime < endTime;
                console.log(`    [${i}] ${c.time.toFixed(1)}s-${endTime.toFixed(1)}s: ${c.chord} ${isMatch ? '✓ ACTIVE' : '✗'}`);
            });
        }
        return foundChord;
    };
    const getNextChord = (currentChordName) => {
        if (nextChord) return nextChord;
        if (!realisticChords || realisticChords.length === 0) return null;
        
        // Find the current chord index first
        const time = currentTime || 0;
        let currentIndex = -1;
        
        for (let i = 0; i < realisticChords.length; i++) {
            const chord = realisticChords[i];
            const nextC = realisticChords[i + 1];
            const chordEndTime = nextC ? nextC.time : (chord.time + (chord.duration || 2));
            
            // Check if current time falls within this chord's duration
            if (time >= chord.time && time < chordEndTime) {
                currentIndex = i;
                break;
            }
        }
        
        // If we found the current chord, return the very next chord in the array
        if (currentIndex >= 0 && currentIndex < realisticChords.length - 1) {
            return realisticChords[currentIndex + 1].chord;
        }
        
        // Fallback: find first chord after current time
        for (let i = 0; i < realisticChords.length; i++) {
            if (realisticChords[i].time > time) {
                return realisticChords[i].chord;
            }
        }
        
        return null;
    };
    
    const getCurrentChordIndex = () => {
        if (currentChordIndex !== undefined && currentChordIndex !== null) return currentChordIndex;
        if (!realisticChords || realisticChords.length === 0) return 0;
        // Find current chord index based on time
        let index = 0;
        for (let i = 0; i < realisticChords.length; i++) {
            if (realisticChords[i].time <= (currentTime || 0)) {
                index = i;
            } else {
                break;
            }
        }
        return index;
    };
    
    // Calculate active values AFTER all functions are defined - USE MEMO TO PREVENT INFINITE RENDERS
    const activeCurrentChord = useMemo(() => getCurrentChord(), [currentTime, realisticChords, currentChord]);
    const activeNextChord = useMemo(() => getNextChord(activeCurrentChord), [currentTime, realisticChords, nextChord, activeCurrentChord]);
    const activeCurrentChordIndex = useMemo(() => getCurrentChordIndex(), [currentTime, realisticChords, currentChordIndex]);
    // Comprehensive chord fingering patterns - HORIZONTAL layout (string index 0=low E, 5=high E)
    const getChordFingerPattern = (chordName) => {
        if (!chordName) return null;
        const patterns = {
            // ============ MAJOR CHORDS ============
            // Open Major Chords (CAGED Position 1)
            // Pattern: { fingers: [[string, fret, fingerNum]], barres: [[fret, startStr, endStr]], muted: [stringIndexes], open: [stringIndexes] }
            // String indices: 0=Low E, 1=A, 2=D, 3=G, 4=B, 5=High E
            // Standard fingerings used
            'C': { fingers: [[4, 1, 1], [2, 2, 2], [1, 3, 3]], barres: [], muted: [0], open: [3, 5] },
            'D': { fingers: [[3, 2, 1], [4, 3, 3], [5, 2, 2]], barres: [], muted: [0, 1], open: [2] },
            'E': { fingers: [[3, 1, 1], [2, 2, 3], [1, 2, 2]], barres: [], muted: [], open: [0, 4, 5] },
            'G': { fingers: [[0, 3, 2], [1, 2, 1], [5, 3, 3]], barres: [], muted: [], open: [2, 3, 4] },
            'A': { fingers: [[2, 2, 1], [3, 2, 2], [4, 2, 3]], barres: [], muted: [0], open: [1, 5] },
            
            // ============ CAGED SYSTEM - ALTERNATIVE POSITIONS ============
            // C Major - All 5 CAGED Positions (from diagram)
            'C-open': { fingers: [[1, 3, 3], [2, 2, 1], [4, 1, 2]], barres: [], muted: [0], open: [3, 5] }, // Open C shape (x32010)
            'C-3fr': { fingers: [[1, 5, 2], [2, 5, 3], [3, 5, 4]], barres: [[3, 1, 4]], muted: [5], open: [] }, // A shape - barre frets 3-5
            'C-5fr': { fingers: [[0, 8, 4], [1, 7, 3], [4, 5, 1], [5, 5, 2]], barres: [], muted: [], open: [2, 3] }, // G shape - frets 5,7,8
            'C-8fr': { fingers: [[1, 10, 3], [2, 10, 4], [3, 9, 2]], barres: [[8, 0, 5]], muted: [], open: [] }, // E shape - barre at 8, fingers 9,10
            'C-10fr': { fingers: [[0, 10, 1], [1, 12, 4], [2, 12, 5]], barres: [], muted: [5, 4], open: [3] }, // D shape - frets 10,12
            
            // A Major - All 5 CAGED Positions (from diagram)
            'A-open': { fingers: [[2, 2, 1], [3, 2, 2], [4, 2, 3]], barres: [], muted: [5], open: [0] }, // Open A shape
            'A-2fr': { fingers: [[1, 4, 3], [2, 4, 4], [3, 4, 5]], barres: [[2, 0, 4]], muted: [5], open: [] }, // G shape - barre at 2, fingers at 4
            'A-5fr': { fingers: [[1, 7, 3], [2, 7, 4], [3, 6, 2]], barres: [[5, 0, 5]], muted: [], open: [] }, // E shape - barre at 5, fingers 6,7
            'A-7fr': { fingers: [[0, 7, 1], [1, 9, 3], [2, 9, 4]], barres: [], muted: [5, 4], open: [3] }, // D shape - frets 7,9
            'A-9fr': { fingers: [[1, 10, 2], [2, 12, 4], [3, 12, 5]], barres: [[9, 1, 4]], muted: [5], open: [] }, // C shape - barre at 9, fingers 10,12
            
            // G Major - All 5 CAGED Positions (from diagram)
            'G-open': { fingers: [[0, 3, 2], [4, 3, 3], [5, 2, 4]], barres: [], muted: [], open: [1, 2, 3] }, // Open G shape
            'G-3fr': { fingers: [[1, 5, 3], [2, 5, 4], [3, 4, 2]], barres: [[3, 0, 5]], muted: [], open: [] }, // E shape - barre at 3, fingers 4,5
            'G-5fr': { fingers: [[1, 7, 3], [2, 7, 4]], barres: [[5, 0, 4]], muted: [5], open: [] }, // D shape - barre at 5, fingers at 7
            'G-7fr': { fingers: [[1, 9, 3], [2, 10, 4], [3, 10, 5]], barres: [[7, 1, 4]], muted: [5], open: [] }, // C shape - barre at 7, fingers 9,10
            'G-10fr': { fingers: [[1, 12, 3], [2, 12, 4], [3, 12, 5]], barres: [[10, 0, 4]], muted: [5], open: [] }, // A shape - barre at 10, all at 12
            
            // E Major - All 5 CAGED Positions (from diagram)
            'E-open': { fingers: [[3, 2, 2], [4, 2, 3], [5, 1, 1]], barres: [], muted: [], open: [0, 1, 2] }, // Open E shape
            'E-2fr': { fingers: [[0, 2, 1], [1, 4, 3], [2, 4, 4]], barres: [], muted: [5, 4], open: [3] }, // D shape - frets 2,4
            'E-4fr': { fingers: [[1, 6, 3], [2, 6, 4]], barres: [[4, 0, 4]], muted: [5], open: [] }, // C shape - barre at 4, fingers at 6
            'E-7fr': { fingers: [[1, 9, 3], [2, 9, 4], [3, 9, 5]], barres: [[7, 0, 5]], muted: [], open: [] }, // A shape - barre at 7, all at 9
            'E-9fr': { fingers: [[1, 11, 3], [2, 11, 4], [3, 10, 2]], barres: [[9, 0, 5]], muted: [], open: [] }, // G shape - barre at 9, fingers 10,11
            
            // D Major - All 5 CAGED Positions (from diagram)
            'D-open': { fingers: [[2, 2, 1], [1, 3, 3], [0, 2, 2]], barres: [], muted: [5, 4], open: [3] }, // Open D shape
            'D-2fr': { fingers: [[1, 4, 3], [2, 4, 4]], barres: [[2, 0, 4]], muted: [5], open: [] }, // C shape - barre at 2, fingers at 4
            'D-5fr': { fingers: [[1, 7, 3], [2, 7, 4], [3, 7, 5]], barres: [[5, 0, 4]], muted: [5], open: [] }, // A shape - barre at 5, all at 7
            'D-7fr': { fingers: [[1, 9, 3], [2, 9, 4], [3, 8, 2]], barres: [[7, 0, 5]], muted: [], open: [] }, // G shape - barre at 7, fingers 8,9
            'D-10fr': { fingers: [[1, 12, 3], [2, 12, 4]], barres: [[10, 0, 5]], muted: [], open: [] }, // E shape - barre at 10, fingers at 12
            
            // Barre Major Chords (F-shape) - Full barre, no muted strings
            'F': { fingers: [[1, 3, 3], [2, 3, 4], [3, 2, 2]], barres: [[1, 0, 5]], muted: [], open: [] },
            'F#': { fingers: [[1, 4, 3], [2, 4, 4], [3, 3, 2]], barres: [[2, 0, 5]], muted: [], open: [] },
            'Gb': { fingers: [[1, 4, 3], [2, 4, 4], [3, 3, 2]], barres: [[2, 0, 5]], muted: [], open: [] },
            'G#': { fingers: [[1, 5, 3], [2, 5, 4], [3, 4, 2]], barres: [[4, 0, 5]], muted: [], open: [] },
            'Ab': { fingers: [[1, 5, 3], [2, 5, 4], [3, 4, 2]], barres: [[4, 0, 5]], muted: [], open: [] },
            'A#': { fingers: [[1, 2, 2], [2, 3, 3], [3, 3, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            'Bb': { fingers: [[1, 2, 2], [2, 3, 3], [3, 3, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            
            // Barre Major Chords (A-shape) - Mute low E string
            'B': { fingers: [[1, 4, 2], [2, 4, 3], [3, 3, 4]], barres: [[2, 0, 4]], muted: [5], open: [] },
            'C#': { fingers: [[1, 6, 2], [2, 6, 3], [3, 5, 4]], barres: [[4, 0, 4]], muted: [5], open: [] },
            'Db': { fingers: [[1, 6, 2], [2, 6, 3], [3, 5, 4]], barres: [[4, 0, 4]], muted: [5], open: [] },
            'D#': { fingers: [[1, 8, 2], [2, 8, 3], [3, 7, 4]], barres: [[6, 0, 4]], muted: [5], open: [] },
            'Eb': { fingers: [[1, 8, 2], [2, 8, 3], [3, 7, 4]], barres: [[6, 0, 4]], muted: [5], open: [] },
            
            // ============ MINOR CHORDS ============
            // Open Minor Chords
            'Am': { fingers: [[4, 1, 1], [3, 2, 3], [2, 2, 2]], barres: [], muted: [0], open: [1, 5] },
            'Em': { fingers: [[1, 2, 1], [2, 2, 2]], barres: [], muted: [], open: [0, 3, 4, 5] },
            'Dm': { fingers: [[5, 1, 1], [3, 2, 2], [4, 3, 3]], barres: [], muted: [0, 1], open: [2] },
            
            // Barre Minor Chords (Em-shape) - Full barre
            'Fm': { fingers: [[1, 3, 3], [2, 3, 4], [3, 2, 2]], barres: [[1, 0, 5]], muted: [], open: [] },
            'F#m': { fingers: [[1, 3, 2], [2, 4, 3], [3, 4, 4]], barres: [[2, 0, 5]], muted: [], open: [] },
            'Gbm': { fingers: [[1, 3, 2], [2, 4, 3], [3, 4, 4]], barres: [[2, 0, 5]], muted: [], open: [] },
            'Gm': { fingers: [[1, 4, 2], [2, 5, 3], [3, 5, 4]], barres: [[3, 0, 5]], muted: [], open: [] },
            'G#m': { fingers: [[1, 5, 2], [2, 6, 3], [3, 6, 4]], barres: [[4, 0, 5]], muted: [], open: [] },
            'Abm': { fingers: [[1, 5, 2], [2, 6, 3], [3, 6, 4]], barres: [[4, 0, 5]], muted: [], open: [] },
            'A#m': { fingers: [[1, 2, 2], [2, 3, 3], [3, 3, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            'Bbm': { fingers: [[1, 2, 2], [2, 3, 3], [3, 3, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            
            // Barre Minor Chords (Am-shape) - Mute low E
            'Bm': { fingers: [[1, 3, 2], [2, 4, 3], [3, 4, 4]], barres: [[2, 0, 4]], muted: [5], open: [] },
            'Cm': { fingers: [[1, 4, 2], [2, 5, 3], [3, 5, 4]], barres: [[3, 0, 4]], muted: [5], open: [] },
            'C#m': { fingers: [[1, 5, 2], [2, 6, 3], [3, 6, 4]], barres: [[4, 0, 4]], muted: [5], open: [] },
            'Dbm': { fingers: [[1, 5, 2], [2, 6, 3], [3, 6, 4]], barres: [[4, 0, 4]], muted: [5], open: [] },
            'D#m': { fingers: [[1, 7, 2], [2, 8, 3], [3, 8, 4]], barres: [[6, 0, 4]], muted: [5], open: [] },
            'Ebm': { fingers: [[1, 7, 2], [2, 8, 3], [3, 8, 4]], barres: [[6, 0, 4]], muted: [5], open: [] },
            
            // ============ DOMINANT 7TH CHORDS ============
            // Open 7th Chords
            'C7': { fingers: [[1, 3, 3], [2, 2, 1], [3, 3, 4], [4, 1, 2]], barres: [], muted: [0], open: [5] },
            'D7': { fingers: [[3, 2, 1], [5, 2, 2], [4, 1, 3]], barres: [], muted: [0, 1], open: [2] },
            'E7': { fingers: [[1, 2, 1], [3, 1, 2]], barres: [], muted: [], open: [0, 2, 4, 5] },
            'G7': { fingers: [[0, 3, 3], [5, 1, 1], [1, 2, 2]], barres: [], muted: [], open: [2, 3, 4] },
            'A7': { fingers: [[2, 2, 1], [4, 2, 2]], barres: [], muted: [0], open: [1, 3, 5] },
            'B7': { fingers: [[2, 1, 1], [3, 2, 2], [4, 2, 3], [5, 2, 4]], barres: [], muted: [0], open: [1] },
            
            // Barre 7th Chords (F-shape) - Full barre
            'F7': { fingers: [[1, 3, 3], [2, 3, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            'F#7': { fingers: [[1, 4, 3], [2, 4, 4]], barres: [[2, 0, 5]], muted: [], open: [] },
            'Gb7': { fingers: [[1, 4, 3], [2, 4, 4]], barres: [[2, 0, 5]], muted: [], open: [] },
            'G#7': { fingers: [[1, 5, 3], [2, 5, 4]], barres: [[4, 0, 5]], muted: [], open: [] },
            'Ab7': { fingers: [[1, 5, 3], [2, 5, 4]], barres: [[4, 0, 5]], muted: [], open: [] },
            'A#7': { fingers: [[1, 2, 2], [2, 3, 3]], barres: [[1, 0, 5]], muted: [], open: [] },
            'Bb7': { fingers: [[1, 2, 2], [2, 3, 3]], barres: [[1, 0, 5]], muted: [], open: [] },
            
            // Barre 7th Chords (A-shape) - Mute low E
            'C#7': { fingers: [[4, 6, 2], [3, 6, 3]], barres: [[4, 0, 4]], muted: [5], open: [] },
            'Db7': { fingers: [[4, 6, 2], [3, 6, 3]], barres: [[4, 0, 4]], muted: [5], open: [] },
            'D#7': { fingers: [[4, 8, 2], [3, 8, 3]], barres: [[6, 0, 4]], muted: [5], open: [] },
            'Eb7': { fingers: [[4, 8, 2], [3, 8, 3]], barres: [[6, 0, 4]], muted: [5], open: [] },
            
            // ============ MAJOR 7TH CHORDS ============
            'Cmaj7': { fingers: [[1, 3, 2], [2, 2, 1], [4, 1, 3]], barres: [], muted: [0], open: [3, 5] },
            'Dmaj7': { fingers: [[3, 2, 1], [5, 2, 2], [4, 2, 3]], barres: [], muted: [0, 1], open: [2] },
            'Emaj7': { fingers: [[3, 1, 1], [2, 1, 2]], barres: [], muted: [1], open: [0, 4, 5] },
            'Gmaj7': { fingers: [[0, 3, 3], [5, 2, 2], [1, 2, 1]], barres: [], muted: [], open: [2, 3, 4] },
            'Amaj7': { fingers: [[2, 2, 1], [3, 1, 2], [4, 2, 3]], barres: [], muted: [0], open: [1, 5] },
            'Fmaj7': { fingers: [[1, 3, 3], [2, 2, 2], [3, 1, 1]], barres: [[1, 0, 5]], muted: [], open: [] },
            'Bmaj7': { fingers: [[1, 4, 3], [2, 3, 2], [3, 3, 4]], barres: [[2, 0, 4]], muted: [5], open: [] },
            'F#maj7': { fingers: [[1, 4, 3], [2, 3, 2], [3, 3, 4]], barres: [[2, 0, 5]], muted: [], open: [] },
            'Gbmaj7': { fingers: [[1, 4, 3], [2, 3, 2], [3, 3, 4]], barres: [[2, 0, 5]], muted: [], open: [] },
            'C#maj7': { fingers: [[1, 5, 3], [2, 5, 2], [3, 5, 4]], barres: [[4, 0, 4]], muted: [5], open: [] },
            'Dbmaj7': { fingers: [[1, 5, 3], [2, 5, 2], [3, 5, 4]], barres: [[4, 0, 4]], muted: [5], open: [] },
            
            // ============ MINOR 7TH CHORDS ============
            'Am7': { fingers: [[4, 1, 1], [2, 2, 2]], barres: [], muted: [0], open: [1, 3, 5] },
            'Em7': { fingers: [[3, 2, 2]], barres: [], muted: [], open: [0, 1, 2, 4, 5] },
            'Dm7': { fingers: [[5, 1, 1], [4, 1, 2], [3, 2, 3]], barres: [], muted: [0, 1], open: [2] },
            'Bm7': { fingers: [[1, 3, 2], [2, 3, 3], [3, 3, 4]], barres: [[2, 0, 4]], muted: [5], open: [] },
            'Cm7': { fingers: [[1, 4, 2], [2, 4, 3], [3, 4, 4]], barres: [[3, 0, 4]], muted: [5], open: [] },
            'C#m7': { fingers: [[1, 5, 2], [2, 5, 3], [3, 5, 4]], barres: [[4, 0, 4]], muted: [5], open: [] },
            'Dbm7': { fingers: [[1, 5, 2], [2, 5, 3], [3, 5, 4]], barres: [[4, 0, 4]], muted: [5], open: [] },
            'D#m7': { fingers: [[1, 7, 2], [2, 7, 3], [3, 7, 4]], barres: [[6, 0, 4]], muted: [5], open: [] },
            'Ebm7': { fingers: [[1, 7, 2], [2, 7, 3], [3, 7, 4]], barres: [[6, 0, 4]], muted: [5], open: [] },
            'Fm7': { fingers: [[1, 2, 2], [2, 2, 3], [3, 2, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            'F#m7': { fingers: [[1, 3, 2], [2, 3, 3], [3, 3, 4]], barres: [[2, 0, 5]], muted: [], open: [] },
            'Gbm7': { fingers: [[1, 3, 2], [2, 3, 3], [3, 3, 4]], barres: [[2, 0, 5]], muted: [], open: [] },
            'Gm7': { fingers: [[1, 4, 2], [2, 4, 3], [3, 4, 4]], barres: [[3, 0, 5]], muted: [], open: [] },
            'G#m7': { fingers: [[1, 5, 2], [2, 5, 3], [3, 5, 4]], barres: [[4, 0, 5]], muted: [], open: [] },
            'Abm7': { fingers: [[1, 5, 2], [2, 5, 3], [3, 5, 4]], barres: [[4, 0, 5]], muted: [], open: [] },
            'A#m7': { fingers: [[1, 2, 2], [2, 2, 3], [3, 2, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            'Bbm7': { fingers: [[1, 2, 2], [2, 2, 3], [3, 2, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            
            // ============ SUSPENDED CHORDS ============
            'Dsus2': { fingers: [[5, 2, 1], [0, 3, 3]], barres: [], muted: [1], open: [2, 3, 4] },
            'Dsus4': { fingers: [[3, 2, 1], [5, 3, 3], [4, 3, 4]], barres: [], muted: [0, 1], open: [2] },
            'Asus2': { fingers: [[2, 2, 1], [4, 2, 2]], barres: [], muted: [0], open: [1, 3, 5] },
            'Asus4': { fingers: [[2, 2, 1], [3, 2, 2], [4, 3, 3]], barres: [], muted: [0], open: [1, 5] },
            'Esus4': { fingers: [[3, 2, 2], [2, 2, 3]], barres: [], muted: [], open: [0, 1, 4, 5] },
            'Gsus4': { fingers: [[0, 3, 3], [1, 3, 4], [5, 3, 1]], barres: [], muted: [], open: [2, 3, 4] },
            'Csus2': { fingers: [[1, 3, 3]], barres: [], muted: [0], open: [2, 3, 4, 5] },
            'Csus4': { fingers: [[4, 1, 1], [2, 3, 3], [1, 3, 4]], barres: [], muted: [0], open: [3, 5] },
            'Fsus2': { fingers: [[1, 2, 2], [2, 3, 3], [3, 3, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            'Fsus4': { fingers: [[1, 4, 4], [2, 3, 3]], barres: [[1, 0, 5]], muted: [], open: [] },
            
            // ============ ADD9 CHORDS ============
            'Cadd9': { fingers: [[1, 3, 3], [2, 2, 1], [4, 3, 4]], barres: [], muted: [0], open: [3, 5] },
            'Dadd9': { fingers: [[0, 2, 1], [1, 3, 3], [2, 2, 2]], barres: [], muted: [5, 4], open: [3] },
            'Gadd9': { fingers: [[0, 3, 2], [2, 2, 1], [4, 3, 4]], barres: [], muted: [], open: [1, 3, 5] },
            'Aadd9': { fingers: [[1, 2, 2], [2, 2, 1], [3, 2, 3], [4, 2, 4]], barres: [], muted: [5], open: [0] },
            'Eadd9': { fingers: [[1, 2, 2], [3, 1, 1], [4, 2, 3]], barres: [], muted: [], open: [0, 2, 5] },
            'Fadd9': { fingers: [[1, 2, 2], [2, 3, 3], [3, 3, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            
            // ============ 6TH CHORDS ============
            'C6': { fingers: [[1, 3, 3], [2, 2, 1], [3, 2, 2], [4, 1, 4]], barres: [], muted: [0], open: [5] },
            'A6': { fingers: [[2, 2, 1], [3, 2, 2], [4, 2, 3], [5, 2, 4]], barres: [], muted: [0], open: [1] },
            'D6': { fingers: [[1, 2, 1], [2, 2, 2], [0, 2, 3]], barres: [], muted: [5, 4], open: [3] },
            'E6': { fingers: [[3, 2, 2], [4, 2, 3], [5, 2, 4]], barres: [], muted: [], open: [0, 1, 2] },
            'G6': { fingers: [[0, 3, 3], [4, 2, 2], [5, 2, 4]], barres: [], muted: [], open: [1, 2, 3] },
            'F6': { fingers: [[1, 2, 2], [2, 3, 3], [3, 3, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            'Am6': { fingers: [[2, 2, 1], [3, 2, 2], [4, 2, 3]], barres: [], muted: [0], open: [1, 5] },
            'Em6': { fingers: [[3, 2, 2], [4, 2, 3], [5, 2, 4]], barres: [], muted: [], open: [0, 1, 2] },
            
            // ============ DIMINISHED CHORDS ============
            'Cdim': { fingers: [[1, 1, 1], [2, 2, 2], [3, 1, 3], [4, 2, 4]], barres: [], muted: [0, 5], open: [] },
            'Ddim': { fingers: [[1, 1, 1], [2, 3, 3], [3, 1, 2]], barres: [], muted: [5, 4], open: [3] },
            'Edim': { fingers: [[2, 2, 2], [3, 1, 1], [4, 2, 3]], barres: [], muted: [5], open: [0, 1] },
            'Fdim': { fingers: [[0, 1, 1], [1, 2, 2], [2, 3, 3]], barres: [], muted: [5, 4], open: [3] },
            'Gdim': { fingers: [[2, 3, 3], [3, 2, 2], [4, 3, 4]], barres: [], muted: [5], open: [0, 1] },
            'Adim': { fingers: [[1, 2, 2], [2, 1, 1], [3, 2, 3]], barres: [], muted: [5], open: [0, 4] },
            'Bdim': { fingers: [[0, 1, 1], [2, 2, 2], [3, 3, 3]], barres: [], muted: [5, 4], open: [1, 3] },
            
            // ============ AUGMENTED CHORDS ============
            'Caug': { fingers: [[1, 3, 3], [2, 2, 1], [3, 2, 2], [4, 1, 4]], barres: [], muted: [0], open: [5] },
            'Daug': { fingers: [[1, 3, 2], [2, 3, 3], [0, 2, 1]], barres: [], muted: [5, 4], open: [3] },
            'Eaug': { fingers: [[2, 1, 1], [3, 2, 3], [4, 1, 2]], barres: [], muted: [5], open: [0, 1] },
            'Gaug': { fingers: [[1, 1, 1], [2, 2, 2], [4, 3, 3]], barres: [], muted: [5], open: [0, 3] },
            'Aaug': { fingers: [[1, 2, 2], [2, 3, 3], [3, 2, 4]], barres: [], muted: [5], open: [0, 4] },
            'Faug': { fingers: [[1, 2, 2], [2, 3, 3], [4, 2, 4]], barres: [], muted: [5], open: [0, 3] },
            
            // ============ 9TH CHORDS ============
            'D9': { fingers: [[3, 2, 1], [4, 1, 2]], barres: [], muted: [0, 1], open: [2, 5] },
            'E9': { fingers: [[1, 2, 2], [3, 1, 1], [4, 2, 3]], barres: [], muted: [], open: [0, 2, 5] },
            'A9': { fingers: [[2, 2, 1], [3, 2, 2], [4, 2, 3]], barres: [], muted: [5], open: [0, 1] },
            'G9': { fingers: [[0, 3, 2], [2, 2, 1], [4, 3, 4]], barres: [], muted: [], open: [1, 3, 5] },
            'C9': { fingers: [[1, 3, 2], [2, 3, 3], [3, 2, 1]], barres: [], muted: [5], open: [4] },
            'F9': { fingers: [[1, 2, 2], [2, 3, 3], [3, 3, 4]], barres: [[1, 0, 5]], muted: [], open: [] },
            'B9': { fingers: [[1, 3, 2], [2, 2, 1], [3, 3, 3]], barres: [[2, 0, 4]], muted: [5], open: [] },
            
            // ============ POWER CHORDS (5) ============
            'C5': { fingers: [[0, 3, 1], [1, 5, 3]], barres: [], muted: [2, 3, 4, 5], open: [] },
            'D5': { fingers: [[3, 2, 1], [4, 2, 2]], barres: [], muted: [0, 1, 2, 5], open: [] },
            'E5': { fingers: [[4, 2, 1], [5, 2, 2]], barres: [], muted: [1, 2, 3], open: [0] },
            'F5': { fingers: [[0, 1, 1], [1, 3, 3]], barres: [], muted: [2, 3, 4, 5], open: [] },
            'G5': { fingers: [[0, 3, 1], [1, 5, 3], [2, 5, 4]], barres: [], muted: [3, 4, 5], open: [] },
            'A5': { fingers: [[3, 2, 1], [4, 2, 2], [5, 2, 3]], barres: [], muted: [1, 2], open: [0] },
            'B5': { fingers: [[4, 2, 1], [5, 4, 3]], barres: [], muted: [0, 1, 2, 3], open: [] },
        };
        
        // Try exact match first
        if (patterns[chordName]) return patterns[chordName];
        
        // Handle slash chords (e.g., G/B -> G, D/F# -> D)
        if (chordName.includes('/')) {
            const baseChord = chordName.split('/')[0];
            if (patterns[baseChord]) return patterns[baseChord];
        }
        
        // Try base chord (remove numbers and special characters except # and b)
        const baseChord = chordName.replace(/[0-9]/g, '').replace(/[^A-Ga-g#b]/g, '');
        if (patterns[baseChord]) return patterns[baseChord];
        
        // Try without 'maj' prefix (Cmaj7 -> C7)
        const withoutMaj = chordName.replace('maj', '');
        if (patterns[withoutMaj]) return patterns[withoutMaj];
        
        // Try without 'min' (Cmin -> Cm)
        const minToM = chordName.replace('min', 'm');
        if (patterns[minToM]) return patterns[minToM];
        
        // Try m7b5 (half-diminished) as m7
        if (chordName.includes('m7b5') || chordName.includes('ø')) {
            const halfDim = chordName.replace('m7b5', 'm7').replace('ø', 'm7');
            if (patterns[halfDim]) return patterns[halfDim];
        }
        
        // Try dim7 as dim
        if (chordName.includes('dim7')) {
            const dimChord = chordName.replace('dim7', 'dim');
            if (patterns[dimChord]) return patterns[dimChord];
        }
        
        // Extract just the root note (C, D, E, F, G, A, B with optional # or b)
        const rootMatch = chordName.match(/^([A-G][#b]?)/);
        if (rootMatch) {
            const root = rootMatch[1];
            // Check if it's minor (contains 'm' but not 'maj')
            if (chordName.includes('m') && !chordName.includes('maj')) {
                const rootMinor = root + 'm';
                if (patterns[rootMinor]) return patterns[rootMinor];
            }
            // Try just the root as major
            if (patterns[root]) return patterns[root];
        }
        
        // Default fallback to C major
        console.warn(`⚠️ Chord pattern not found for: ${chordName}, using C as fallback`);
        return patterns['C'];
    };
    // Render horizontal fretboard (demo style)
    const renderHorizontalFretboard = (chordName, size = 'normal') => {
        if (!chordName) return null;
        const pattern = getChordFingerPattern(chordName);
        if (!pattern) return null;
        const numStrings = 6;
        const numFrets = 5;
        const isLarge = size === 'large';
        
        // Calculate starting fret based on chord position (minimum fret in pattern)
        let startingFret = 1;
        if (pattern.barres && pattern.barres.length > 0) {
            // If there's a barre, start from that fret
            startingFret = pattern.barres[0][0];
        } else if (pattern.fingers && pattern.fingers.length > 0) {
            // Otherwise, find the minimum fret from finger positions (excluding open strings)
            const frets = pattern.fingers.map(f => f[1]).filter(f => f > 0);
            if (frets.length > 0) {
                startingFret = Math.max(1, Math.min(...frets));
            }
        }
        
        return (
            <div className={`demo-fretboard-container ${isLarge ? 'large' : ''}`}>
                <div className="demo-chord-label">{chordName}</div>
                <div className="demo-fretboard-visual">
                    <div className="demo-fretboard-strings" style={{ position: 'relative' }}>
                        {/* Render barre lines first (behind the dots) */}
                        {pattern.barres?.map((barreInfo, barreIdx) => {
                            const [barreFret, startStr, endStr] = barreInfo;
                            
                            // Only render barre if it's within the displayed fret range
                            if (barreFret < startingFret || barreFret >= startingFret + numFrets) {
                                return null;
                            }
                            
                            // Calculate position for vertical barre line
                            // Pattern uses 0=low E, 5=high E, but display is reversed (high E at top)
                            // So we need to convert pattern string indices to display positions
                            const stringSpacing = 65;
                            // Convert pattern indices to display positions
                            const startDisplayIdx = numStrings - 1 - startStr; // Pattern to display
                            const endDisplayIdx = numStrings - 1 - endStr;     // Pattern to display
                            const topPosition = Math.min(startDisplayIdx, endDisplayIdx) * stringSpacing - 10; // Start 10px above first string
                            const height = (Math.abs(endDisplayIdx - startDisplayIdx) * stringSpacing) + 70; // Extended height to cover dots properly
                            // Adjust position based on starting fret offset
                            const fretOffset = barreFret - startingFret;
                            const leftPosition = 30 + fretOffset * 70 + 35; // 30px label + fret spacing (70px) + center offset (35px) - shifted right to center over dots
                            
                            return (
                                <div
                                    key={`barre-${barreIdx}`}
                                    style={{
                                        position: 'absolute',
                                        left: `${leftPosition}px`,
                                        top: `${topPosition}px`,
                                        width: '50px',
                                        height: `${height}px`,
                                        background: 'linear-gradient(90deg, rgba(108, 92, 231, 0.95) 0%, rgba(108, 92, 231, 1) 50%, rgba(108, 92, 231, 0.95) 100%)',
                                        borderRadius: '25px',
                                        border: '3px solid rgba(255, 215, 0, 0.9)',
                                        boxShadow: `
                                            0 0 30px rgba(108, 92, 231, 0.9),
                                            0 0 15px rgba(255, 215, 0, 0.6),
                                            inset 0 2px 8px rgba(255, 255, 255, 0.3),
                                            inset 0 -2px 8px rgba(0, 0, 0, 0.3)
                                        `,
                                        zIndex: 10,
                                        pointerEvents: 'none',
                                        backdropFilter: 'blur(2px)'
                                    }}
                                />
                            );
                        })}
                        
                        {[...Array(numStrings)].map((_, stringIdx) => {
                            // String labels - High E first (standard guitar tab view)
                            const stringLabels = ['E', 'B', 'G', 'D', 'A', 'E']; // High E to Low E (visual top to bottom)
                            // Map display position to pattern index (patterns use 0=low E, 5=high E)
                            const patternStringIdx = numStrings - 1 - stringIdx;
                            const isMuted = pattern.muted?.includes(patternStringIdx);
                            const isOpen = pattern.open?.includes(patternStringIdx);
                            
                            return (
                                <div key={stringIdx} className="demo-fretboard-string">
                                    <span className="string-label" style={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        gap: '5px',
                                        minWidth: '45px',
                                        position: 'relative'
                                    }}>
                                        {stringLabels[stringIdx]}
                                        {isMuted && (
                                            <span style={{ 
                                                color: '#ff4444', 
                                                fontSize: '1.2rem',
                                                textShadow: '0 0 8px rgba(255, 68, 68, 0.8)',
                                                position: 'absolute',
                                                left: '22px'
                                            }}>✕</span>
                                        )}
                                        {isOpen && (
                                            <span style={{ 
                                                color: '#00ff00', 
                                                fontSize: '1rem',
                                                textShadow: '0 0 8px rgba(0, 255, 0, 0.8)',
                                                fontWeight: 'bold',
                                                position: 'absolute',
                                                left: '22px'
                                            }}>○</span>
                                        )}
                                    </span>
                                    {[...Array(numFrets)].map((_, fretIdx) => {
                                        // Calculate actual fret number based on starting fret
                                        const actualFret = startingFret + fretIdx;
                                        
                                        // Check if this position has a finger (use pattern string index)
                                        const hasFinger = pattern.fingers?.some(
                                            ([str, fret, finger]) => str === patternStringIdx && fret === actualFret
                                        );
                                        const fingerNum = pattern.fingers?.find(
                                            ([str, fret, finger]) => str === patternStringIdx && fret === actualFret
                                        )?.[2];
                                        // Check if this is part of a barre (use pattern string index)
                                        const isBarre = pattern.barres?.some(
                                            ([fret, startStr, endStr]) => 
                                                fret === actualFret && patternStringIdx >= startStr && patternStringIdx <= endStr
                                        );
                                        
                                        return (
                                            <div 
                                                key={fretIdx} 
                                                className={`demo-fret-position ${hasFinger || isBarre ? 'active' : ''} ${isBarre ? 'barre' : ''}`}
                                                style={{ zIndex: 2, position: 'relative' }}
                                            >
                                                {hasFinger && !isBarre && (
                                                    <span className="demo-finger-number">{fingerNum}</span>
                                                )}
                                                {isBarre && (
                                                    <span className="demo-finger-number" style={{ fontSize: '1.1rem' }}>1</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Fret Numbers - Below Fretboard (OUTSIDE demo-fretboard-visual) */}
                <div className="fret-numbers" style={{ marginTop: '30px', clear: 'both' }}>
                    <span className="string-label-spacer"></span>
                    {[...Array(numFrets)].map((_, fretIdx) => (
                        <span key={fretIdx} className="fret-number">Fr{startingFret + fretIdx}</span>
                    ))}
                </div>
            </div>
        );
    };
    // Get fret position information for display
    const getChordInfo = (chord) => {
        if (!chord) return { position: 'Open', difficulty: 'Easy', type: 'Major' };
        const chordMappings = {
            'C': { position: 'Fret 0-3', difficulty: 'Beginner', type: 'Major' },
            'G': { position: 'Fret 0-3', difficulty: 'Beginner', type: 'Major' },
            'D': { position: 'Fret 0-2', difficulty: 'Beginner', type: 'Major' },
            'A': { position: 'Fret 0-2', difficulty: 'Beginner', type: 'Major' },
            'E': { position: 'Fret 0-2', difficulty: 'Beginner', type: 'Major' },
            'F': { position: 'Fret 1-3', difficulty: 'Intermediate', type: 'Major' },
            'B': { position: 'Fret 2-4', difficulty: 'Intermediate', type: 'Major' },
            'Em': { position: 'Fret 0-2', difficulty: 'Beginner', type: 'Minor' },
            'Am': { position: 'Fret 0-2', difficulty: 'Beginner', type: 'Minor' },
            'Dm': { position: 'Fret 0-3', difficulty: 'Beginner', type: 'Minor' },
            'F#': { position: 'Fret 2-4', difficulty: 'Advanced', type: 'Major' },
            'F#m': { position: 'Fret 2-4', difficulty: 'Intermediate', type: 'Minor' },
            'Bm': { position: 'Fret 2-4', difficulty: 'Intermediate', type: 'Minor' },
            'C#': { position: 'Fret 4-6', difficulty: 'Advanced', type: 'Major' },
            'C#m': { position: 'Fret 4-6', difficulty: 'Intermediate', type: 'Minor' },
            'G#': { position: 'Fret 4-6', difficulty: 'Advanced', type: 'Major' },
            'A#': { position: 'Fret 6-8', difficulty: 'Intermediate', type: 'Major' },
            'Bb': { position: 'Fret 6-8', difficulty: 'Intermediate', type: 'Major' },
            'D#': { position: 'Fret 6-8', difficulty: 'Advanced', type: 'Major' },
            'Eb': { position: 'Fret 6-8', difficulty: 'Advanced', type: 'Major' }
        };
        const baseChord = chord.replace(/[0-9]/g, '').replace('maj', '').replace('min', 'm');
        return chordMappings[baseChord] || { position: 'Fret 0-2', difficulty: 'Unknown', type: 'Unknown' };
    };
    // Update displayed chords for the progression timeline
    useEffect(() => {
        if (realisticChords && realisticChords.length > 0) {
            setDisplayedChords(realisticChords);
        }
    }, [realisticChords, currentChordIndex]);
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // If displayMode is set to show only fretboard (for split layout), return just the fretboard
    if (displayMode === 'current-only' || displayMode === 'next-only') {
        const chordToDisplay = displayMode === 'current-only' ? activeCurrentChord : activeNextChord;
        return (
            <div style={{ transform: 'scale(0.9)' }}>
                {renderHorizontalFretboard(chordToDisplay, 'large')}
            </div>
        );
    }

    return (
        <div className="professional-chord-learning-interface" style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '20px'
        }}>
            <h3 style={{ color: '#f4f0f5ff', marginBottom: '20px', textAlign: 'center' }}>
                🎸 Guitar Chord Progression Timeline
            </h3>
            
            {/* Guitar Chord Progression Timeline (4/4 Time) - ENHANCED THEME WITH GROUPING */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.95), rgba(137, 155, 232, 0.85))',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '3px solid rgba(255, 215, 0, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.1)'
            }}>
                <h4 style={{ 
                    color: '#FFD700', 
                    marginBottom: '15px', 
                    fontSize: '18px', 
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    fontWeight: 'bold'
                }}>
                    🎼 Guitar Chord Progression (4/4 Time) - {realisticChords.length} changes
                </h4>
                
                <div ref={timelineRef} className="horizontal-chord-timeline" style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '0px',
                    padding: '15px 10px',
                    position: 'relative',
                    scrollBehavior: 'smooth',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    border: '2px solid rgba(255, 215, 0, 0.2)'
                }}>
                    {(() => {
                        if (!realisticChords || realisticChords.length === 0) return null;
                        
                        const lastChord = realisticChords[realisticChords.length - 1];
                        const totalSeconds = lastChord ? Math.ceil(lastChord.time + (lastChord.duration || 2)) : 60;
                        const chordBySecond = {};
                        
                        // Fill intro period (before first chord) with intro indicator
                        const firstChordTime = realisticChords[0]?.time || 1.0;
                        for (let sec = 0; sec < Math.floor(firstChordTime); sec++) {
                            chordBySecond[sec] = { chord: 'INTRO', time: sec, isIntro: true };
                        }
                        
                        // Fill actual chord periods with non-overlapping logic
                        realisticChords.forEach((chord, index) => {
                            const currentStartTime = Math.floor(chord.time);
                            const nextChordData = realisticChords[index + 1];
                            
                            let endTime;
                            if (nextChordData) {
                                const nextStartTime = Math.floor(nextChordData.time);
                                endTime = Math.max(currentStartTime + 1, nextStartTime);
                            } else {
                                endTime = currentStartTime + Math.max(1, Math.floor(chord.duration || 2));
                            }
                            
                            // Fill seconds, prevent overlaps
                            for (let sec = currentStartTime; sec < endTime; sec++) {
                                if (!chordBySecond[sec]) {
                                    chordBySecond[sec] = chord;
                                }
                            }
                        });
                        
                        // CHORD GROUPING: Show chord name only on first occurrence, empty boxes for repeats
                        const squares = [];
                        let lastChordName = null;
                        
                        for (let i = 0; i < totalSeconds; i++) {
                            const chord = chordBySecond[i];
                            const isCurrent = Math.floor(currentTime || 0) === i;
                            const chordName = chord?.isIntro ? '♪' : (chord?.chord || '');
                            
                            // Determine if we should show the chord name (first occurrence only)
                            const isFirstOccurrence = chordName && chordName !== lastChordName;
                            const displayText = isFirstOccurrence ? chordName : '';
                            
                            if (chordName && !chord?.isIntro) {
                                lastChordName = chordName;
                            }
                            
                            // Bar line every 4 squares - ENHANCED THEME
                            if (i > 0 && i % 4 === 0) {
                                squares.push(
                                    <div key={`bar-${i}`} className="bar-line" style={{
                                        width: '4px',
                                        height: '90px',
                                        background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.6), rgba(108, 92, 231, 0.8), rgba(255, 215, 0, 0.6))',
                                        marginRight: '4px',
                                        flexShrink: 0,
                                        borderRadius: '3px',
                                        boxShadow: '0 0 8px rgba(255, 215, 0, 0.5)'
                                    }} />
                                );
                            }
                            
                            squares.push(
                                <div
                                    key={`square-${i}`}
                                    data-second={i}
                                    data-current={isCurrent}
                                    style={{
                                        minWidth: '85px',
                                        width: '85px',
                                        height: '85px',
                                        textAlign: 'center',
                                        borderRadius: '12px',
                                        background: isCurrent 
                                            ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                                            : (chord 
                                                ? (chord.isIntro 
                                                    ? 'linear-gradient(135deg, rgba(108, 92, 231, 0.4), rgba(137, 155, 232, 0.4))' 
                                                    : 'linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(40, 40, 40, 0.9))')
                                                : 'rgba(13, 13, 13, 0.6)'),
                                        color: isCurrent ? '#1a1a1a' : '#FFD700',
                                        border: isCurrent 
                                            ? '3px solid #FFFFFF' 
                                            : (chord && !chord.isIntro 
                                                ? '2px solid rgba(108, 92, 231, 0.6)' 
                                                : '2px solid rgba(255, 215, 0, 0.3)'),
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: isCurrent ? '18px' : '15px',
                                        fontWeight: 'bold',
                                        flexShrink: 0,
                                        marginRight: '4px',
                                        boxShadow: isCurrent 
                                            ? '0 6px 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4)' 
                                            : '0 3px 8px rgba(0, 0, 0, 0.4)',
                                        transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                                        textShadow: isCurrent 
                                            ? '0 2px 4px rgba(0, 0, 0, 0.8)' 
                                            : '0 2px 4px rgba(0, 0, 0, 0.5)'
                                    }}
                                    onClick={() => {
                                        if (chord && !chord.isIntro && seekTo) {
                                            seekTo(chord.time);
                                        }
                                    }}
                                >
                                    <div className="square-chord">
                                        {displayText}
                                    </div>
                                </div>
                            );
                        }
                        return squares;
                    })()} 
                </div>
                
                <div style={{ 
                    fontSize: '14px', 
                    color: '#FFD700', 
                    marginTop: '15px', 
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    fontWeight: '500'
                }}>
                    💡 Click any chord to jump to that time • Vertical lines show 4/4 time signature
                </div>
            </div>
            
            {/* Current Chord Info - Compact Display - ENHANCED VISIBILITY */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 25px',
                background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(137, 155, 232, 0.15))',
                borderRadius: '12px',
                border: '2px solid rgba(108, 92, 231, 0.5)',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <span style={{ fontSize: '40px' }}>🎵</span>
                    <div>
                        <div style={{ 
                            fontSize: '14px', 
                            color: '#FFD700', 
                            marginBottom: '6px',
                            fontWeight: '600',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                            letterSpacing: '0.5px'
                        }}>NOW PLAYING</div>
                        <div style={{ 
                            fontSize: '32px', 
                            color: '#FFD700', 
                            fontWeight: 'bold',
                            textShadow: '0 3px 6px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.3)',
                            letterSpacing: '1px'
                        }}>
                            {activeCurrentChord || '---'}
                        </div>
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                            fontSize: '14px', 
                            color: '#fff', 
                            marginBottom: '6px',
                            fontWeight: '600',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                            letterSpacing: '0.5px',
                            opacity: 0.9
                        }}>NEXT CHORD</div>
                        <div style={{ 
                            fontSize: '28px', 
                            color: '#8B7EFF', 
                            fontWeight: 'bold',
                            textShadow: '0 3px 6px rgba(0, 0, 0, 0.7), 0 0 20px rgba(139, 126, 255, 0.3)',
                            letterSpacing: '1px'
                        }}>
                            {activeNextChord || '---'}
                        </div>
                    </div>
                    <span style={{ fontSize: '36px' }}>⏭️</span>
                </div>
            </div>

        </div>
    );
};

export default ChordProgressionDisplay;
