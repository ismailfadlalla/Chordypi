import React, { useEffect, useRef } from 'react';
import '../../styles/components/player.css';

const SheetMusicScroll = ({ chords, currentTime, currentChordIndex }) => {
    const sheetRef = useRef(null);

    useEffect(() => {
        if (sheetRef.current && currentChordIndex >= 0) {
            // Auto-scroll to keep current chord visible
            const container = sheetRef.current;
            const currentChordElement = container.querySelector(`[data-chord-index="${currentChordIndex}"]`);
            
            if (currentChordElement) {
                const containerRect = container.getBoundingClientRect();
                const chordRect = currentChordElement.getBoundingClientRect();
                const scrollLeft = container.scrollLeft;
                
                const chordRelativeLeft = chordRect.left - containerRect.left + scrollLeft;
                const containerWidth = containerRect.width;
                
                const viewStart = scrollLeft;
                const viewEnd = scrollLeft + containerWidth;
                
                if (chordRelativeLeft < viewStart + 50 || chordRelativeLeft > viewEnd - 150) {
                    const targetScrollLeft = chordRelativeLeft - (containerWidth * 0.2);
                    
                    container.scrollTo({
                        left: Math.max(0, targetScrollLeft),
                        behavior: 'smooth'
                    });
                }
            }
        }
    }, [currentChordIndex]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderSheetMusic = () => {
        if (!chords || chords.length === 0) {
            return (
                <div className="no-chords-message">
                    <h3>🎵 No Chord Progression Available</h3>
                    <p>Analyze a song to see its chord progression here!</p>
                </div>
            );
        }

        return (
            <div className="sheet-music-progression">
                {chords.map((chord, index) => {
                    const isActive = index === currentChordIndex;
                    const isPlayed = currentTime > chord.time + (chord.duration || 4);
                    const isUpcoming = !isActive && !isPlayed;
                    
                    return (
                        <div 
                            key={index}
                            data-chord-index={index}
                            className={`sheet-chord-item ${isActive ? 'active' : ''} ${isPlayed ? 'played' : ''} ${isUpcoming ? 'upcoming' : ''}`}
                        >
                            <div className="chord-measure-number">{index + 1}</div>
                            <div className="chord-name-sheet">{chord.chord}</div>
                            <div className="chord-timing-sheet">
                                <span className="chord-start-time">{formatTime(chord.time)}</span>
                                <span className="chord-duration-sheet">{(chord.duration || 4).toFixed(1)}s</span>
                            </div>
                            {chord.roman_numeral && (
                                <div className="roman-numeral">{chord.roman_numeral}</div>
                            )}
                            {chord.function && (
                                <div className="chord-function">{chord.function}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="sheet-music-scroll" ref={sheetRef}>
            <div className="sheet-music-header">
                <h3>🎼 Chord Progression Sheet ({chords?.length || 0} chords)</h3>
                <div className="sheet-info">
                    <span>Current: {formatTime(currentTime)}</span>
                    <span>•</span>
                    <span>Active: {currentChordIndex >= 0 ? `Chord ${currentChordIndex + 1}` : 'None'}</span>
                </div>
            </div>
            <div className="sheet-music-content">
                {renderSheetMusic()}
            </div>
        </div>
    );
};

export default SheetMusicScroll;