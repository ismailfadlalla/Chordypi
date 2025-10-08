// This file contains utility functions for handling time-related operations.

export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export const getCurrentTime = (audioElement) => {
    return audioElement.currentTime;
};

export const getDuration = (audioElement) => {
    return audioElement.duration;
};

export const isAudioPlaying = (audioElement) => {
    return !audioElement.paused;
};