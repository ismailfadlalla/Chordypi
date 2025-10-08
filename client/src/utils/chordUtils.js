// This file contains utility functions for handling chord-related operations.

export const getChordProgression = (chords) => {
    return chords.map(chord => chord.chord).join(' - ');
};

export const getChordDuration = (chord, nextChord) => {
    return nextChord.time - chord.time;
};

export const isChordInProgression = (chord, progression) => {
    return progression.includes(chord);
};

export const getHighlightedChords = (currentTime, chords) => {
    return chords.filter(chord => currentTime >= chord.time && currentTime < (chord.time + chord.duration));
};

export const formatChordDisplay = (chord) => {
    return chord.charAt(0).toUpperCase() + chord.slice(1).toLowerCase();
};