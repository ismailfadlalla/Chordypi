import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/fretboard.css';

const FretboardHighlight = ({ currentChord }) => {
    // Chord finger positions database (standard tuning EADGBE)
    const chordPositions = {
        'C': [
            { string: 1, fret: 1, finger: 1 }, // B string, 1st fret, index finger
            { string: 2, fret: 0, finger: 0 }, // G string, open
            { string: 3, fret: 0, finger: 0 }, // D string, open
            { string: 4, fret: 2, finger: 2 }, // A string, 2nd fret, middle finger
            { string: 5, fret: 3, finger: 3 }, // E string, 3rd fret, ring finger
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'G': [
            { string: 1, fret: 3, finger: 3 }, // B string, 3rd fret, ring finger
            { string: 2, fret: 0, finger: 0 }, // G string, open
            { string: 3, fret: 0, finger: 0 }, // D string, open
            { string: 4, fret: 0, finger: 0 }, // A string, open
            { string: 5, fret: 2, finger: 1 }, // E string, 2nd fret, index finger
            { string: 6, fret: 3, finger: 2 } // Low E string, 3rd fret, middle finger
        ],
        'D': [
            { string: 1, fret: 2, finger: 1 }, // B string, 2nd fret, index finger
            { string: 2, fret: 3, finger: 3 }, // G string, 3rd fret, ring finger
            { string: 3, fret: 2, finger: 2 }, // D string, 2nd fret, middle finger
            { string: 4, fret: 0, finger: 0 }, // A string, open
            { string: 5, fret: 'x', finger: 'x' }, // E string, muted
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'A': [
            { string: 1, fret: 0, finger: 0 }, // B string, open
            { string: 2, fret: 2, finger: 2 }, // G string, 2nd fret, middle finger
            { string: 3, fret: 2, finger: 3 }, // D string, 2nd fret, ring finger
            { string: 4, fret: 2, finger: 4 }, // A string, 2nd fret, pinky
            { string: 5, fret: 0, finger: 0 }, // E string, open
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'E': [
            { string: 1, fret: 0, finger: 0 }, // B string, open
            { string: 2, fret: 0, finger: 0 }, // G string, open
            { string: 3, fret: 1, finger: 1 }, // D string, 1st fret, index finger
            { string: 4, fret: 2, finger: 3 }, // A string, 2nd fret, ring finger
            { string: 5, fret: 2, finger: 2 }, // E string, 2nd fret, middle finger
            { string: 6, fret: 0, finger: 0 } // Low E string, open
        ],
        'F': [
            { string: 1, fret: 1, finger: 1, barre: true }, // High E string, 1st fret, barre
            { string: 2, fret: 1, finger: 1, barre: true }, // B string, 1st fret, barre
            { string: 3, fret: 2, finger: 2 }, // G string, 2nd fret, middle finger
            { string: 4, fret: 3, finger: 4 }, // D string, 3rd fret, pinky
            { string: 5, fret: 3, finger: 3 }, // A string, 3rd fret, ring finger
            { string: 6, fret: 1, finger: 1, barre: true } // Low E string, 1st fret, barre
        ],
        'B': [
            { string: 1, fret: 2, finger: 1 }, // B string, 2nd fret, barre
            { string: 2, fret: 4, finger: 3 }, // G string, 4th fret, ring finger
            { string: 3, fret: 4, finger: 4 }, // D string, 4th fret, pinky
            { string: 4, fret: 4, finger: 2 }, // A string, 4th fret, middle finger
            { string: 5, fret: 2, finger: 1 }, // E string, 2nd fret, barre
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'Em': [
            { string: 1, fret: 0, finger: 0 }, // B string, open
            { string: 2, fret: 0, finger: 0 }, // G string, open
            { string: 3, fret: 0, finger: 0 }, // D string, open
            { string: 4, fret: 2, finger: 2 }, // A string, 2nd fret, middle finger
            { string: 5, fret: 2, finger: 3 }, // E string, 2nd fret, ring finger
            { string: 6, fret: 0, finger: 0 } // Low E string, open
        ],
        'Am': [
            { string: 1, fret: 1, finger: 1 }, // B string, 1st fret, index finger
            { string: 2, fret: 0, finger: 0 }, // G string, open
            { string: 3, fret: 2, finger: 3 }, // D string, 2nd fret, ring finger
            { string: 4, fret: 2, finger: 2 }, // A string, 2nd fret, middle finger
            { string: 5, fret: 0, finger: 0 }, // E string, open
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'Dm': [
            { string: 1, fret: 1, finger: 1 }, // B string, 1st fret, index finger
            { string: 2, fret: 2, finger: 2 }, // G string, 2nd fret, middle finger
            { string: 3, fret: 3, finger: 4 }, // D string, 3rd fret, pinky
            { string: 4, fret: 0, finger: 0 }, // A string, open
            { string: 5, fret: 'x', finger: 'x' }, // E string, muted
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'B7': [
            { string: 1, fret: 0, finger: 0 }, // B string, open
            { string: 2, fret: 2, finger: 2 }, // G string, 2nd fret, middle finger
            { string: 3, fret: 1, finger: 1 }, // D string, 1st fret, index finger
            { string: 4, fret: 2, finger: 3 }, // A string, 2nd fret, ring finger
            { string: 5, fret: 2, finger: 4 }, // E string, 2nd fret, pinky
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'A7': [
            { string: 1, fret: 0, finger: 0 }, // B string, open
            { string: 2, fret: 2, finger: 2 }, // G string, 2nd fret, middle finger
            { string: 3, fret: 0, finger: 0 }, // D string, open
            { string: 4, fret: 2, finger: 3 }, // A string, 2nd fret, ring finger
            { string: 5, fret: 0, finger: 0 }, // E string, open
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'D7': [
            { string: 1, fret: 1, finger: 1 }, // B string, 1st fret, index finger
            { string: 2, fret: 2, finger: 2 }, // G string, 2nd fret, middle finger
            { string: 3, fret: 2, finger: 3 }, // D string, 2nd fret, ring finger
            { string: 4, fret: 0, finger: 0 }, // A string, open
            { string: 5, fret: 'x', finger: 'x' }, // E string, muted
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'E7': [
            { string: 1, fret: 0, finger: 0 }, // B string, open
            { string: 2, fret: 0, finger: 0 }, // G string, open
            { string: 3, fret: 1, finger: 1 }, // D string, 1st fret, index finger
            { string: 4, fret: 0, finger: 0 }, // A string, open
            { string: 5, fret: 2, finger: 2 }, // E string, 2nd fret, middle finger
            { string: 6, fret: 0, finger: 0 } // Low E string, open
        ],
        'G7': [
            { string: 1, fret: 1, finger: 1 }, // B string, 1st fret, index finger
            { string: 2, fret: 0, finger: 0 }, // G string, open
            { string: 3, fret: 0, finger: 0 }, // D string, open
            { string: 4, fret: 0, finger: 0 }, // A string, open
            { string: 5, fret: 2, finger: 2 }, // E string, 2nd fret, middle finger
            { string: 6, fret: 3, finger: 3 } // Low E string, 3rd fret, ring finger
        ],
        'C7': [
            { string: 1, fret: 1, finger: 1 }, // B string, 1st fret, index finger
            { string: 2, fret: 3, finger: 3 }, // G string, 3rd fret, ring finger
            { string: 3, fret: 2, finger: 2 }, // D string, 2nd fret, middle finger
            { string: 4, fret: 3, finger: 4 }, // A string, 3rd fret, pinky
            { string: 5, fret: 'x', finger: 'x' }, // E string, muted
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        // Sharp and flat chords
        'D#': [ // D# major (same as Eb major)
            { string: 1, fret: 3, finger: 2 }, // B string, 3rd fret, middle finger
            { string: 2, fret: 4, finger: 3 }, // G string, 4th fret, ring finger
            { string: 3, fret: 1, finger: 1 }, // D string, 1st fret, index finger
            { string: 4, fret: 'x', finger: 'x' }, // A string, muted
            { string: 5, fret: 'x', finger: 'x' }, // E string, muted
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'Eb': [ // Eb major (same as D# major)
            { string: 1, fret: 3, finger: 2 }, // B string, 3rd fret, middle finger
            { string: 2, fret: 4, finger: 3 }, // G string, 4th fret, ring finger
            { string: 3, fret: 1, finger: 1 }, // D string, 1st fret, index finger
            { string: 4, fret: 'x', finger: 'x' }, // A string, muted
            { string: 5, fret: 'x', finger: 'x' }, // E string, muted
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'D#m': [ // D# minor (same as Eb minor)
            { string: 1, fret: 2, finger: 1 }, // B string, 2nd fret, index finger
            { string: 2, fret: 4, finger: 4 }, // G string, 4th fret, pinky
            { string: 3, fret: 4, finger: 3 }, // D string, 4th fret, ring finger
            { string: 4, fret: 1, finger: 1 }, // A string, 1st fret, index finger (barre)
            { string: 5, fret: 'x', finger: 'x' }, // E string, muted
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'F#': [ // F# major
            { string: 1, fret: 2, finger: 1 }, // B string, 2nd fret, barre
            { string: 2, fret: 2, finger: 1 }, // G string, 2nd fret, barre
            { string: 3, fret: 3, finger: 2 }, // D string, 3rd fret, middle finger
            { string: 4, fret: 4, finger: 4 }, // A string, 4th fret, pinky
            { string: 5, fret: 4, finger: 3 }, // E string, 4th fret, ring finger
            { string: 6, fret: 2, finger: 1 } // Low E string, 2nd fret, barre
        ],
        'G#': [ // G# major
            { string: 1, fret: 4, finger: 1 }, // B string, 4th fret, barre
            { string: 2, fret: 4, finger: 1 }, // G string, 4th fret, barre
            { string: 3, fret: 5, finger: 2 }, // D string, 5th fret, middle finger
            { string: 4, fret: 6, finger: 4 }, // A string, 6th fret, pinky
            { string: 5, fret: 6, finger: 3 }, // E string, 6th fret, ring finger
            { string: 6, fret: 4, finger: 1 } // Low E string, 4th fret, barre
        ],
        'A#': [ // A# major (same as Bb major)
            { string: 1, fret: 1, finger: 1 }, // B string, 1st fret, barre
            { string: 2, fret: 3, finger: 3 }, // G string, 3rd fret, ring finger
            { string: 3, fret: 3, finger: 4 }, // D string, 3rd fret, pinky
            { string: 4, fret: 3, finger: 2 }, // A string, 3rd fret, middle finger
            { string: 5, fret: 1, finger: 1 }, // E string, 1st fret, barre
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'Bb': [ // Bb major (same as A# major)
            { string: 1, fret: 1, finger: 1 }, // B string, 1st fret, barre
            { string: 2, fret: 3, finger: 3 }, // G string, 3rd fret, ring finger
            { string: 3, fret: 3, finger: 4 }, // D string, 3rd fret, pinky
            { string: 4, fret: 3, finger: 2 }, // A string, 3rd fret, middle finger
            { string: 5, fret: 1, finger: 1 }, // E string, 1st fret, barre
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        'C#': [ // C# major
            { string: 1, fret: 4, finger: 1 }, // B string, 4th fret, barre
            { string: 2, fret: 6, finger: 3 }, // G string, 6th fret, ring finger
            { string: 3, fret: 6, finger: 4 }, // D string, 6th fret, pinky
            { string: 4, fret: 6, finger: 2 }, // A string, 6th fret, middle finger
            { string: 5, fret: 4, finger: 1 }, // E string, 4th fret, barre
            { string: 6, fret: 'x', finger: 'x' } // Low E string, muted
        ],
        // Add some barre chord variations
        'G_barre': [
            { string: 1, fret: 3, finger: 1 }, // B string, 3rd fret, barre
            { string: 2, fret: 3, finger: 1 }, // G string, 3rd fret, barre
            { string: 3, fret: 4, finger: 2 }, // D string, 4th fret, middle finger
            { string: 4, fret: 5, finger: 4 }, // A string, 5th fret, pinky
            { string: 5, fret: 5, finger: 3 }, // E string, 5th fret, ring finger
            { string: 6, fret: 3, finger: 1 } // Low E string, 3rd fret, barre
        ],
        // Barre chords
        'G_barre': [ // G major barre chord at 3rd fret
            { string: 1, fret: 3, finger: 1 }, // B string, 3rd fret, barre
            { string: 2, fret: 3, finger: 1 }, // G string, 3rd fret, barre
            { string: 3, fret: 4, finger: 2 }, // D string, 4th fret, middle finger
            { string: 4, fret: 5, finger: 4 }, // A string, 5th fret, pinky
            { string: 5, fret: 5, finger: 3 }, // E string, 5th fret, ring finger
            { string: 6, fret: 3, finger: 1 } // Low E string, 3rd fret, barre
        ],
        'A_barre': [ // A major barre chord at 5th fret
            { string: 1, fret: 5, finger: 1 }, // B string, 5th fret, barre
            { string: 2, fret: 6, finger: 2 }, // G string, 6th fret, middle finger
            { string: 3, fret: 7, finger: 4 }, // D string, 7th fret, pinky
            { string: 4, fret: 7, finger: 3 }, // A string, 7th fret, ring finger
            { string: 5, fret: 5, finger: 1 }, // E string, 5th fret, barre
            { string: 6, fret: 5, finger: 1 } // Low E string, 5th fret, barre
        ],
        'D_barre': [ // D major barre chord at 10th fret
            { string: 1, fret: 10, finger: 1 }, // B string, 10th fret, barre
            { string: 2, fret: 11, finger: 2 }, // G string, 11th fret, middle finger
            { string: 3, fret: 12, finger: 4 }, // D string, 12th fret, pinky
            { string: 4, fret: 12, finger: 3 }, // A string, 12th fret, ring finger
            { string: 5, fret: 10, finger: 1 }, // E string, 10th fret, barre
            { string: 6, fret: 10, finger: 1 } // Low E string, 10th fret, barre
        ],
        
        // Additional common chord variations and 7th chords
        'Em7': [
            { string: 6, fret: 0, finger: 0 },
            { string: 5, fret: 2, finger: 2 },
            { string: 4, fret: 0, finger: 0 },
            { string: 3, fret: 0, finger: 0 },
            { string: 2, fret: 0, finger: 0 },
            { string: 1, fret: 0, finger: 0 }
        ],
        'Dm7': [
            { string: 6, fret: 'x', finger: 'x' },
            { string: 5, fret: 'x', finger: 'x' },
            { string: 4, fret: 0, finger: 0 },
            { string: 3, fret: 2, finger: 2 },
            { string: 2, fret: 1, finger: 1 },
            { string: 1, fret: 1, finger: 1 }
        ],
        'Am7': [
            { string: 6, fret: 'x', finger: 'x' },
            { string: 5, fret: 0, finger: 0 },
            { string: 4, fret: 2, finger: 2 },
            { string: 3, fret: 0, finger: 0 },
            { string: 2, fret: 1, finger: 1 },
            { string: 1, fret: 0, finger: 0 }
        ],
        'Cmaj7': [
            { string: 6, fret: 'x', finger: 'x' },
            { string: 5, fret: 3, finger: 3 },
            { string: 4, fret: 2, finger: 2 },
            { string: 3, fret: 0, finger: 0 },
            { string: 2, fret: 0, finger: 0 },
            { string: 1, fret: 0, finger: 0 }
        ],
        'Gmaj7': [
            { string: 6, fret: 3, finger: 3 },
            { string: 5, fret: 2, finger: 2 },
            { string: 4, fret: 0, finger: 0 },
            { string: 3, fret: 0, finger: 0 },
            { string: 2, fret: 0, finger: 0 },
            { string: 1, fret: 2, finger: 1 }
        ],
        'Fmaj7': [
            { string: 6, fret: 1, finger: 1 },
            { string: 5, fret: 3, finger: 3 },
            { string: 4, fret: 3, finger: 4 },
            { string: 3, fret: 2, finger: 2 },
            { string: 2, fret: 1, finger: 1 },
            { string: 1, fret: 1, finger: 1 }
        ],
        'D7': [
            { string: 6, fret: 'x', finger: 'x' },
            { string: 5, fret: 'x', finger: 'x' },
            { string: 4, fret: 0, finger: 0 },
            { string: 3, fret: 2, finger: 2 },
            { string: 2, fret: 1, finger: 1 },
            { string: 1, fret: 2, finger: 3 }
        ],
        'E7': [
            { string: 6, fret: 0, finger: 0 },
            { string: 5, fret: 2, finger: 2 },
            { string: 4, fret: 2, finger: 1 },
            { string: 3, fret: 1, finger: 1 },
            { string: 2, fret: 0, finger: 0 },
            { string: 1, fret: 0, finger: 0 }
        ],
        'A7': [
            { string: 6, fret: 'x', finger: 'x' },
            { string: 5, fret: 0, finger: 0 },
            { string: 4, fret: 2, finger: 2 },
            { string: 3, fret: 0, finger: 0 },
            { string: 2, fret: 2, finger: 3 },
            { string: 1, fret: 0, finger: 0 }
        ],
        'G7': [
            { string: 6, fret: 3, finger: 3 },
            { string: 5, fret: 2, finger: 2 },
            { string: 4, fret: 0, finger: 0 },
            { string: 3, fret: 0, finger: 0 },
            { string: 2, fret: 0, finger: 0 },
            { string: 1, fret: 1, finger: 1 }
        ],
        'C7': [
            { string: 6, fret: 'x', finger: 'x' },
            { string: 5, fret: 3, finger: 3 },
            { string: 4, fret: 2, finger: 2 },
            { string: 3, fret: 3, finger: 4 },
            { string: 2, fret: 1, finger: 1 },
            { string: 1, fret: 0, finger: 0 }
        ],
        // Power chords for rock songs
        'E5': [
            { string: 6, fret: 0, finger: 0 },
            { string: 5, fret: 2, finger: 2 },
            { string: 4, fret: 2, finger: 3 },
            { string: 3, fret: 'x', finger: 'x' },
            { string: 2, fret: 'x', finger: 'x' },
            { string: 1, fret: 'x', finger: 'x' }
        ],
        'A5': [
            { string: 6, fret: 'x', finger: 'x' },
            { string: 5, fret: 0, finger: 0 },
            { string: 4, fret: 2, finger: 2 },
            { string: 3, fret: 2, finger: 3 },
            { string: 2, fret: 'x', finger: 'x' },
            { string: 1, fret: 'x', finger: 'x' }
        ],
        'D5': [
            { string: 6, fret: 'x', finger: 'x' },
            { string: 5, fret: 'x', finger: 'x' },
            { string: 4, fret: 0, finger: 0 },
            { string: 3, fret: 2, finger: 2 },
            { string: 2, fret: 3, finger: 3 },
            { string: 1, fret: 'x', finger: 'x' }
        ],
        'G5': [
            { string: 6, fret: 3, finger: 1 },
            { string: 5, fret: 5, finger: 3 },
            { string: 4, fret: 5, finger: 4 },
            { string: 3, fret: 'x', finger: 'x' },
            { string: 2, fret: 'x', finger: 'x' },
            { string: 1, fret: 'x', finger: 'x' }
        ],
        
        // Additional Barre Chords - E Shape (6th string root)
        'F_barre': [ // F major barre chord at 1st fret
            { string: 1, fret: 1, finger: 1, barre: true },
            { string: 2, fret: 1, finger: 1, barre: true },
            { string: 3, fret: 2, finger: 2 },
            { string: 4, fret: 3, finger: 4 },
            { string: 5, fret: 3, finger: 3 },
            { string: 6, fret: 1, finger: 1, barre: true }
        ],
        'G_barre': [ // G major barre chord at 3rd fret (E shape)
            { string: 1, fret: 3, finger: 1, barre: true },
            { string: 2, fret: 3, finger: 1, barre: true },
            { string: 3, fret: 4, finger: 2 },
            { string: 4, fret: 5, finger: 4 },
            { string: 5, fret: 5, finger: 3 },
            { string: 6, fret: 3, finger: 1, barre: true }
        ],
        'A_barre': [ // A major barre chord at 5th fret (E shape)
            { string: 1, fret: 5, finger: 1, barre: true },
            { string: 2, fret: 5, finger: 1, barre: true },
            { string: 3, fret: 6, finger: 2 },
            { string: 4, fret: 7, finger: 4 },
            { string: 5, fret: 7, finger: 3 },
            { string: 6, fret: 5, finger: 1, barre: true }
        ],
        'B_barre': [ // B major barre chord at 7th fret (E shape)
            { string: 1, fret: 7, finger: 1, barre: true },
            { string: 2, fret: 7, finger: 1, barre: true },
            { string: 3, fret: 8, finger: 2 },
            { string: 4, fret: 9, finger: 4 },
            { string: 5, fret: 9, finger: 3 },
            { string: 6, fret: 7, finger: 1, barre: true }
        ],
        
        // Barre Chords - A Shape (5th string root)
        'C_barre_A': [ // C major barre chord at 3rd fret (A shape)
            { string: 1, fret: 5, finger: 4 },
            { string: 2, fret: 5, finger: 3 },
            { string: 3, fret: 5, finger: 2 },
            { string: 4, fret: 5, finger: 2 },
            { string: 5, fret: 3, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        'D_barre_A': [ // D major barre chord at 5th fret (A shape)
            { string: 1, fret: 7, finger: 4 },
            { string: 2, fret: 7, finger: 3 },
            { string: 3, fret: 7, finger: 2 },
            { string: 4, fret: 7, finger: 2 },
            { string: 5, fret: 5, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        'E_barre_A': [ // E major barre chord at 7th fret (A shape)
            { string: 1, fret: 9, finger: 4 },
            { string: 2, fret: 9, finger: 3 },
            { string: 3, fret: 9, finger: 2 },
            { string: 4, fret: 9, finger: 2 },
            { string: 5, fret: 7, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        
        // Minor Barre Chords - E Shape
        'Fm_barre': [ // F minor barre chord at 1st fret
            { string: 1, fret: 1, finger: 1, barre: true },
            { string: 2, fret: 1, finger: 1, barre: true },
            { string: 3, fret: 1, finger: 1, barre: true },
            { string: 4, fret: 3, finger: 4 },
            { string: 5, fret: 3, finger: 3 },
            { string: 6, fret: 1, finger: 1, barre: true }
        ],
        'Gm_barre': [ // G minor barre chord at 3rd fret
            { string: 1, fret: 3, finger: 1, barre: true },
            { string: 2, fret: 3, finger: 1, barre: true },
            { string: 3, fret: 3, finger: 1, barre: true },
            { string: 4, fret: 5, finger: 4 },
            { string: 5, fret: 5, finger: 3 },
            { string: 6, fret: 3, finger: 1, barre: true }
        ],
        'Am_barre': [ // A minor barre chord at 5th fret
            { string: 1, fret: 5, finger: 1, barre: true },
            { string: 2, fret: 5, finger: 1, barre: true },
            { string: 3, fret: 5, finger: 1, barre: true },
            { string: 4, fret: 7, finger: 4 },
            { string: 5, fret: 7, finger: 3 },
            { string: 6, fret: 5, finger: 1, barre: true }
        ],
        'Bm_barre': [ // B minor barre chord at 7th fret
            { string: 1, fret: 7, finger: 1, barre: true },
            { string: 2, fret: 7, finger: 1, barre: true },
            { string: 3, fret: 7, finger: 1, barre: true },
            { string: 4, fret: 9, finger: 4 },
            { string: 5, fret: 9, finger: 3 },
            { string: 6, fret: 7, finger: 1, barre: true }
        ],
        
        // Minor Barre Chords - A Shape
        'Cm_barre_A': [ // C minor barre chord at 3rd fret (A shape)
            { string: 1, fret: 4, finger: 3 },
            { string: 2, fret: 4, finger: 2 },
            { string: 3, fret: 5, finger: 4 },
            { string: 4, fret: 5, finger: 4 },
            { string: 5, fret: 3, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        'Dm_barre_A': [ // D minor barre chord at 5th fret (A shape)
            { string: 1, fret: 6, finger: 3 },
            { string: 2, fret: 6, finger: 2 },
            { string: 3, fret: 7, finger: 4 },
            { string: 4, fret: 7, finger: 4 },
            { string: 5, fret: 5, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        
        // 7th Barre Chords
        'F7_barre': [ // F7 barre chord at 1st fret
            { string: 1, fret: 1, finger: 1, barre: true },
            { string: 2, fret: 1, finger: 1, barre: true },
            { string: 3, fret: 2, finger: 2 },
            { string: 4, fret: 1, finger: 1, barre: true },
            { string: 5, fret: 3, finger: 3 },
            { string: 6, fret: 1, finger: 1, barre: true }
        ],
        'G7_barre': [ // G7 barre chord at 3rd fret
            { string: 1, fret: 3, finger: 1, barre: true },
            { string: 2, fret: 3, finger: 1, barre: true },
            { string: 3, fret: 4, finger: 2 },
            { string: 4, fret: 3, finger: 1, barre: true },
            { string: 5, fret: 5, finger: 3 },
            { string: 6, fret: 3, finger: 1, barre: true }
        ],
        
        // Sharp and Flat Barre Chords - E Shape (6th string root)
        'F#_barre': [ // F# major barre chord at 2nd fret
            { string: 1, fret: 2, finger: 1, barre: true },
            { string: 2, fret: 2, finger: 1, barre: true },
            { string: 3, fret: 3, finger: 2 },
            { string: 4, fret: 4, finger: 4 },
            { string: 5, fret: 4, finger: 3 },
            { string: 6, fret: 2, finger: 1, barre: true }
        ],
        'Gb_barre': [ // Gb major barre chord at 2nd fret (same as F#)
            { string: 1, fret: 2, finger: 1, barre: true },
            { string: 2, fret: 2, finger: 1, barre: true },
            { string: 3, fret: 3, finger: 2 },
            { string: 4, fret: 4, finger: 4 },
            { string: 5, fret: 4, finger: 3 },
            { string: 6, fret: 2, finger: 1, barre: true }
        ],
        'G#_barre': [ // G# major barre chord at 4th fret
            { string: 1, fret: 4, finger: 1, barre: true },
            { string: 2, fret: 4, finger: 1, barre: true },
            { string: 3, fret: 5, finger: 2 },
            { string: 4, fret: 6, finger: 4 },
            { string: 5, fret: 6, finger: 3 },
            { string: 6, fret: 4, finger: 1, barre: true }
        ],
        'Ab_barre': [ // Ab major barre chord at 4th fret (same as G#)
            { string: 1, fret: 4, finger: 1, barre: true },
            { string: 2, fret: 4, finger: 1, barre: true },
            { string: 3, fret: 5, finger: 2 },
            { string: 4, fret: 6, finger: 4 },
            { string: 5, fret: 6, finger: 3 },
            { string: 6, fret: 4, finger: 1, barre: true }
        ],
        'A#_barre': [ // A# major barre chord at 6th fret
            { string: 1, fret: 6, finger: 1, barre: true },
            { string: 2, fret: 6, finger: 1, barre: true },
            { string: 3, fret: 7, finger: 2 },
            { string: 4, fret: 8, finger: 4 },
            { string: 5, fret: 8, finger: 3 },
            { string: 6, fret: 6, finger: 1, barre: true }
        ],
        'Bb_barre': [ // Bb major barre chord at 6th fret (same as A#)
            { string: 1, fret: 6, finger: 1, barre: true },
            { string: 2, fret: 6, finger: 1, barre: true },
            { string: 3, fret: 7, finger: 2 },
            { string: 4, fret: 8, finger: 4 },
            { string: 5, fret: 8, finger: 3 },
            { string: 6, fret: 6, finger: 1, barre: true }
        ],
        'C#_barre': [ // C# major barre chord at 9th fret
            { string: 1, fret: 9, finger: 1, barre: true },
            { string: 2, fret: 9, finger: 1, barre: true },
            { string: 3, fret: 10, finger: 2 },
            { string: 4, fret: 11, finger: 4 },
            { string: 5, fret: 11, finger: 3 },
            { string: 6, fret: 9, finger: 1, barre: true }
        ],
        'Db_barre': [ // Db major barre chord at 9th fret (same as C#)
            { string: 1, fret: 9, finger: 1, barre: true },
            { string: 2, fret: 9, finger: 1, barre: true },
            { string: 3, fret: 10, finger: 2 },
            { string: 4, fret: 11, finger: 4 },
            { string: 5, fret: 11, finger: 3 },
            { string: 6, fret: 9, finger: 1, barre: true }
        ],
        'D#_barre': [ // D# major barre chord at 11th fret
            { string: 1, fret: 11, finger: 1, barre: true },
            { string: 2, fret: 11, finger: 1, barre: true },
            { string: 3, fret: 12, finger: 2 },
            { string: 4, fret: 13, finger: 4 },
            { string: 5, fret: 13, finger: 3 },
            { string: 6, fret: 11, finger: 1, barre: true }
        ],
        'Eb_barre': [ // Eb major barre chord at 11th fret (same as D#)
            { string: 1, fret: 11, finger: 1, barre: true },
            { string: 2, fret: 11, finger: 1, barre: true },
            { string: 3, fret: 12, finger: 2 },
            { string: 4, fret: 13, finger: 4 },
            { string: 5, fret: 13, finger: 3 },
            { string: 6, fret: 11, finger: 1, barre: true }
        ],
        
        // Sharp and Flat Minor Barre Chords - E Shape
        'F#m_barre': [ // F# minor barre chord at 2nd fret
            { string: 1, fret: 2, finger: 1, barre: true },
            { string: 2, fret: 2, finger: 1, barre: true },
            { string: 3, fret: 2, finger: 1, barre: true },
            { string: 4, fret: 4, finger: 4 },
            { string: 5, fret: 4, finger: 3 },
            { string: 6, fret: 2, finger: 1, barre: true }
        ],
        'Gbm_barre': [ // Gb minor barre chord at 2nd fret (same as F#m)
            { string: 1, fret: 2, finger: 1, barre: true },
            { string: 2, fret: 2, finger: 1, barre: true },
            { string: 3, fret: 2, finger: 1, barre: true },
            { string: 4, fret: 4, finger: 4 },
            { string: 5, fret: 4, finger: 3 },
            { string: 6, fret: 2, finger: 1, barre: true }
        ],
        'G#m_barre': [ // G# minor barre chord at 4th fret
            { string: 1, fret: 4, finger: 1, barre: true },
            { string: 2, fret: 4, finger: 1, barre: true },
            { string: 3, fret: 4, finger: 1, barre: true },
            { string: 4, fret: 6, finger: 4 },
            { string: 5, fret: 6, finger: 3 },
            { string: 6, fret: 4, finger: 1, barre: true }
        ],
        'Abm_barre': [ // Ab minor barre chord at 4th fret (same as G#m)
            { string: 1, fret: 4, finger: 1, barre: true },
            { string: 2, fret: 4, finger: 1, barre: true },
            { string: 3, fret: 4, finger: 1, barre: true },
            { string: 4, fret: 6, finger: 4 },
            { string: 5, fret: 6, finger: 3 },
            { string: 6, fret: 4, finger: 1, barre: true }
        ],
        'A#m_barre': [ // A# minor barre chord at 6th fret
            { string: 1, fret: 6, finger: 1, barre: true },
            { string: 2, fret: 6, finger: 1, barre: true },
            { string: 3, fret: 6, finger: 1, barre: true },
            { string: 4, fret: 8, finger: 4 },
            { string: 5, fret: 8, finger: 3 },
            { string: 6, fret: 6, finger: 1, barre: true }
        ],
        'Bbm_barre': [ // Bb minor barre chord at 6th fret (same as A#m)
            { string: 1, fret: 6, finger: 1, barre: true },
            { string: 2, fret: 6, finger: 1, barre: true },
            { string: 3, fret: 6, finger: 1, barre: true },
            { string: 4, fret: 8, finger: 4 },
            { string: 5, fret: 8, finger: 3 },
            { string: 6, fret: 6, finger: 1, barre: true }
        ],
        'C#m_barre': [ // C# minor barre chord at 9th fret
            { string: 1, fret: 9, finger: 1, barre: true },
            { string: 2, fret: 9, finger: 1, barre: true },
            { string: 3, fret: 9, finger: 1, barre: true },
            { string: 4, fret: 11, finger: 4 },
            { string: 5, fret: 11, finger: 3 },
            { string: 6, fret: 9, finger: 1, barre: true }
        ],
        'Dbm_barre': [ // Db minor barre chord at 9th fret (same as C#m)
            { string: 1, fret: 9, finger: 1, barre: true },
            { string: 2, fret: 9, finger: 1, barre: true },
            { string: 3, fret: 9, finger: 1, barre: true },
            { string: 4, fret: 11, finger: 4 },
            { string: 5, fret: 11, finger: 3 },
            { string: 6, fret: 9, finger: 1, barre: true }
        ],
        'D#m_barre': [ // D# minor barre chord at 11th fret
            { string: 1, fret: 11, finger: 1, barre: true },
            { string: 2, fret: 11, finger: 1, barre: true },
            { string: 3, fret: 11, finger: 1, barre: true },
            { string: 4, fret: 13, finger: 4 },
            { string: 5, fret: 13, finger: 3 },
            { string: 6, fret: 11, finger: 1, barre: true }
        ],
        'Ebm_barre': [ // Eb minor barre chord at 11th fret (same as D#m)
            { string: 1, fret: 11, finger: 1, barre: true },
            { string: 2, fret: 11, finger: 1, barre: true },
            { string: 3, fret: 11, finger: 1, barre: true },
            { string: 4, fret: 13, finger: 4 },
            { string: 5, fret: 13, finger: 3 },
            { string: 6, fret: 11, finger: 1, barre: true }
        ],
        
        // Sharp and Flat Barre Chords - A Shape (5th string root)
        'C#_barre_A': [ // C# major barre chord at 4th fret (A shape)
            { string: 1, fret: 6, finger: 4 },
            { string: 2, fret: 6, finger: 3 },
            { string: 3, fret: 6, finger: 2 },
            { string: 4, fret: 6, finger: 2 },
            { string: 5, fret: 4, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        'Db_barre_A': [ // Db major barre chord at 4th fret (A shape, same as C#)
            { string: 1, fret: 6, finger: 4 },
            { string: 2, fret: 6, finger: 3 },
            { string: 3, fret: 6, finger: 2 },
            { string: 4, fret: 6, finger: 2 },
            { string: 5, fret: 4, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        'D#_barre_A': [ // D# major barre chord at 6th fret (A shape)
            { string: 1, fret: 8, finger: 4 },
            { string: 2, fret: 8, finger: 3 },
            { string: 3, fret: 8, finger: 2 },
            { string: 4, fret: 8, finger: 2 },
            { string: 5, fret: 6, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        'Eb_barre_A': [ // Eb major barre chord at 6th fret (A shape, same as D#)
            { string: 1, fret: 8, finger: 4 },
            { string: 2, fret: 8, finger: 3 },
            { string: 3, fret: 8, finger: 2 },
            { string: 4, fret: 8, finger: 2 },
            { string: 5, fret: 6, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        'F#_barre_A': [ // F# major barre chord at 9th fret (A shape)
            { string: 1, fret: 11, finger: 4 },
            { string: 2, fret: 11, finger: 3 },
            { string: 3, fret: 11, finger: 2 },
            { string: 4, fret: 11, finger: 2 },
            { string: 5, fret: 9, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ],
        'Gb_barre_A': [ // Gb major barre chord at 9th fret (A shape, same as F#)
            { string: 1, fret: 11, finger: 4 },
            { string: 2, fret: 11, finger: 3 },
            { string: 3, fret: 11, finger: 2 },
            { string: 4, fret: 11, finger: 2 },
            { string: 5, fret: 9, finger: 1, barre: true },
            { string: 6, fret: 'x', finger: 'x' }
        ]
    };

    // Get chord positions for the current chord
    const getChordPositions = (chord) => {
        // Remove chord variations and get base chord
        const baseChord = chord.replace(/[0-9]/g, '').replace('maj', '').replace('min', 'm');
        
        // First try to find exact match
        if (chordPositions[baseChord]) {
            return chordPositions[baseChord];
        }
        
        // Try different barre chord variations
        const barreVariations = [
            `${baseChord}_barre`,
            `${baseChord}_barre_A`,
            `${baseChord}_barre_E`
        ];
        
        for (const variation of barreVariations) {
            if (chordPositions[variation]) {
                return chordPositions[variation];
            }
        }
        
        // Handle enharmonic equivalents (e.g., F# = Gb, C# = Db)
        const enharmonicMap = {
            'F#': 'Gb', 'Gb': 'F#',
            'G#': 'Ab', 'Ab': 'G#', 
            'A#': 'Bb', 'Bb': 'A#',
            'C#': 'Db', 'Db': 'C#',
            'D#': 'Eb', 'Eb': 'D#',
            'F#m': 'Gbm', 'Gbm': 'F#m',
            'G#m': 'Abm', 'Abm': 'G#m',
            'A#m': 'Bbm', 'Bbm': 'A#m',
            'C#m': 'Dbm', 'Dbm': 'C#m',
            'D#m': 'Ebm', 'Ebm': 'D#m'
        };
        
        // Try enharmonic equivalent
        if (enharmonicMap[baseChord]) {
            const enharmonic = enharmonicMap[baseChord];
            if (chordPositions[enharmonic]) {
                return chordPositions[enharmonic];
            }
            
            // Try barre variations of enharmonic equivalent
            for (const variation of [`${enharmonic}_barre`, `${enharmonic}_barre_A`, `${enharmonic}_barre_E`]) {
                if (chordPositions[variation]) {
                    return chordPositions[variation];
                }
            }
        }
        
        // For F chord, prefer barre version
        if (baseChord === 'F' && chordPositions['F_barre']) {
            return chordPositions['F_barre'];
        }
        
        // For common chords that have both open and barre versions, prefer barre if available
        const preferBarreChords = ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'Gb', 'G#', 'Ab', 'A#', 'Bb', 'C#', 'Db', 'D#', 'Eb'];
        if (preferBarreChords.includes(baseChord)) {
            if (chordPositions[`${baseChord}_barre`]) {
                return chordPositions[`${baseChord}_barre`];
            }
            if (chordPositions[`${baseChord}_barre_A`]) {
                return chordPositions[`${baseChord}_barre_A`];
            }
        }
        
        return [];
    };

    // Get the main fret position (for barre chords and position display)
    const getMainFretPosition = (chord) => {
        const positions = getChordPositions(chord);
        if (positions.length === 0) return null;
        
        // Find the most common fret position (excluding open strings and muted strings)
        const fretCounts = {};
        let hasOpenStrings = false;
        
        positions.forEach(pos => {
            if (pos.fret === 0) {
                hasOpenStrings = true;
            } else if (pos.fret !== 'x') {
                fretCounts[pos.fret] = (fretCounts[pos.fret] || 0) + 1;
            }
        });
        
        // If there are fretted notes, return the lowest fret position for better display
        if (Object.keys(fretCounts).length > 0) {
            const lowestFret = Math.min(...Object.keys(fretCounts).map(f => parseInt(f)));
            return lowestFret;
        }
        
        // If it's mostly open strings, return 0 (for "OPEN" display)
        if (hasOpenStrings) {
            return 0;
        }
        
        return null;
    };

    const positions = getChordPositions(currentChord);
    const mainFretPosition = getMainFretPosition(currentChord);
    const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];

    return (
        <div className="fretboard-diagram">
            {/* Simple Chord Diagram */}
            <div className="simple-chord-diagram">
                {/* String Names */}
                <div className="string-names">
                    {stringNames.map((stringName, index) => (
                        <div
                            key={index}
                            className="string-name"
                            style={{
                                top: `${20 + index * 25}px`,
                                left: '-35px'
                            }}
                        >
                            {stringName}
                        </div>
                    ))}
                </div>
                
                {/* Fret lines */}
                <div className="fret-lines">
                    {[0, 1, 2, 3, 4, 5].map(fret => (
                        <div key={fret} className={`fret-line ${fret === 0 ? 'nut' : ''}`} />
                    ))}
                </div>
                
                {/* String lines */}
                <div className="string-lines">
                    {[1, 2, 3, 4, 5, 6].map(string => (
                        <div key={string} className="string-line" />
                    ))}
                </div>
                
                {/* Finger positions */}
                {positions.map((position, index) => {
                    if (position.fret === 'x' || position.fret === 0) return null;
                    
                    const mainFret = getMainFretPosition(currentChord);
                    const startFret = mainFret && mainFret > 0 ? mainFret : 1;
                    const displayFret = position.fret - startFret + 1;
                    
                    // Only show positions that are within our 5-fret display window
                    if (displayFret < 1 || displayFret > 5) return null;
                    
                    const stringPos = (position.string - 1) * 33; // Adjusted for exact string centering (280px / 6 strings = ~46px, but accounting for margins)
                    const fretPos = (displayFret - 0.5) * 42; // Adjusted for larger fretboard width
                    
                    return (
                        <div
                            key={index}
                            className={`finger-position ${position.barre ? 'barre-position' : 'dot-position'}`}
                            style={{
                                left: `${20 + fretPos}px`,
                                top: `${20 + stringPos}px`
                            }}
                        >
                            {position.barre ? (
                                <div className="barre-bar">{position.finger}</div>
                            ) : (
                                <div className="finger-dot">{position.finger}</div>
                            )}
                        </div>
                    );
                })}
                
                {/* Open strings */}
                {positions.map((position, index) => {
                    if (position.fret !== 0) return null;
                    
                    const stringPos = (6 - position.string) * 25;
                    
                    return (
                        <div
                            key={`open-${index}`}
                            className="open-string-marker"
                            style={{
                                top: `${20 + stringPos}px`,
                                left: '-25px'
                            }}
                        >
                            O
                        </div>
                    );
                })}
                
                {/* Muted strings */}
                {positions.map((position, index) => {
                    if (position.fret !== 'x') return null;
                    
                    const stringPos = (6 - position.string) * 25;
                    
                    return (
                        <div
                            key={`muted-${index}`}
                            className="muted-string-marker"
                            style={{
                                top: `${20 + stringPos}px`,
                                left: '-25px'
                            }}
                        >
                            X
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

FretboardHighlight.propTypes = {
    currentChord: PropTypes.string.isRequired,
};

export default FretboardHighlight;