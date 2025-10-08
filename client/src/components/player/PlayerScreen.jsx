import React, { useContext, useEffect } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import ChordProgressionDisplay from './ChordProgressionDisplay';
import FretboardHighlight from './FretboardHighlight';
import SheetMusicScroll from './SheetMusicScroll';
import PlaybackControls from './PlaybackControls';
import '../../styles/components/player.css';

const PlayerScreen = () => {
    const { currentChord, isPlaying, duration, chords } = useContext(PlayerContext);

    useEffect(() => {
        // Logic to handle real-time updates for chords and playback
        const handlePlayback = () => {
            // Update the current chord based on playback time
        };

        if (isPlaying) {
            const interval = setInterval(handlePlayback, 1000); // Update every second
            return () => clearInterval(interval);
        }
    }, [isPlaying, chords]);

    return (
        <div className="player-screen">
            <h2>Now Playing</h2>
            <ChordProgressionDisplay chords={chords} />
            <FretboardHighlight currentChord={currentChord} />
            <SheetMusicScroll duration={duration} />
            <PlaybackControls />
        </div>
    );
};

export default PlayerScreen;