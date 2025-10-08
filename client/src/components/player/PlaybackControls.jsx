import React from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import '../../styles/components/player.css';

const PlaybackControls = () => {
    const { isPlaying, togglePlay, currentTime, duration, seek } = usePlayer();

    const handlePlayPause = () => {
        togglePlay();
    };

    const handleSeek = (event) => {
        const newTime = event.target.value;
        seek(newTime);
    };

    return (
        <div className="playback-controls">
            <button onClick={handlePlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="seek-bar"
            />
            <span>{Math.floor(currentTime)} / {Math.floor(duration)} seconds</span>
        </div>
    );
};

export default PlaybackControls;