import React, { createContext, useContext, useState, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentChord, setCurrentChord] = useState(null);
    const [chordProgression, setChordProgression] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);
    const stop = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const updateCurrentChord = (chord) => {
        setCurrentChord(chord);
    };

    const updateCurrentTime = (time) => {
        setCurrentTime(time);
    };

    useEffect(() => {
        // Logic to handle playback and update current chord based on time
        const interval = setInterval(() => {
            if (isPlaying) {
                setCurrentTime((prevTime) => prevTime + 1); // Increment time
                // Logic to determine current chord based on currentTime
                // This is a placeholder for actual chord detection logic
                const chord = chordProgression.find(c => c.time <= currentTime && (c.time + c.duration) > currentTime);
                if (chord) {
                    setCurrentChord(chord.chord);
                }
            }
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [isPlaying, currentTime, chordProgression]);

    return (
        <PlayerContext.Provider value={{
            isPlaying,
            currentChord,
            chordProgression,
            currentTime,
            play,
            pause,
            stop,
            updateCurrentChord,
            updateCurrentTime,
            setChordProgression
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    return useContext(PlayerContext);
};

export { PlayerContext };