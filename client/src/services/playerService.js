import { useState, useEffect } from 'react';
import { fetchAudio, fetchChords } from './api';

const usePlayer = (url) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [chords, setChords] = useState([]);
    const [audio, setAudio] = useState(null);

    useEffect(() => {
        if (url) {
            const audioElement = new Audio(url);
            setAudio(audioElement);

            audioElement.addEventListener('loadedmetadata', () => {
                setDuration(audioElement.duration);
            });

            audioElement.addEventListener('timeupdate', () => {
                setCurrentTime(audioElement.currentTime);
            });

            return () => {
                audioElement.pause();
                audioElement.src = '';
                setAudio(null);
            };
        }
    }, [url]);

    const play = () => {
        if (audio) {
            audio.play();
            setIsPlaying(true);
        }
    };

    const pause = () => {
        if (audio) {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const fetchAndSetChords = async () => {
        if (url) {
            const chordData = await fetchChords(url);
            setChords(chordData.chords);
        }
    };

    useEffect(() => {
        fetchAndSetChords();
    }, [url]);

    return {
        isPlaying,
        currentTime,
        duration,
        chords,
        play,
        pause,
    };
};

export default usePlayer;