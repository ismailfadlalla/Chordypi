import { useState, useEffect, useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { playerService } from '../services/playerService';

const usePlayer = () => {
    const { setCurrentChord, setIsPlaying, setPlaybackTime } = useContext(PlayerContext);
    const [audio, setAudio] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (audio) {
            audio.addEventListener('loadedmetadata', () => {
                setDuration(audio.duration);
                setIsLoaded(true);
            });

            audio.addEventListener('timeupdate', () => {
                setPlaybackTime(audio.currentTime);
                // Logic to update current chord based on playback time can be added here
            });

            audio.addEventListener('ended', () => {
                setIsPlaying(false);
            });

            return () => {
                audio.pause();
                audio.removeEventListener('loadedmetadata', null);
                audio.removeEventListener('timeupdate', null);
                audio.removeEventListener('ended', null);
            };
        }
    }, [audio]);

    const playAudio = (url) => {
        const newAudio = new Audio(url);
        setAudio(newAudio);
        newAudio.play();
        setIsPlaying(true);
    };

    const pauseAudio = () => {
        if (audio) {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const stopAudio = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
        }
    };

    return {
        isLoaded,
        duration,
        playAudio,
        pauseAudio,
        stopAudio,
    };
};

export default usePlayer;
export { usePlayer };