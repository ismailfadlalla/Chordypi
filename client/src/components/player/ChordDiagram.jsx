import React from 'react';

const ChordDiagram = ({ chordName, compact = false, mini = false }) => {
    console.log('🎸 ChordDiagram rendering with chordName:', chordName, 'compact:', compact, 'mini:', mini);
    
    // Force a test chord to debug visibility
    const testChord = chordName || 'C';
    console.log('🎸 Using chord name:', testChord);
    
    // Enhanced chord fingerings with proper finger positions
    const chordLibrary = {
        'G': { 
            frets: [3, 2, 0, 0, 3, 3], 
            fingers: [3, 2, 0, 0, 3, 4],
            description: 'G Major - Place 2nd finger on 2nd fret A string, 3rd finger on 3rd fret low E string, 4th finger on 3rd fret high E string'
        },
        'D': { 
            frets: [-1, -1, 0, 2, 3, 2], 
            fingers: [0, 0, 0, 1, 3, 2],
            description: 'D Major - 1st finger 2nd fret G string, 2nd finger 2nd fret high E, 3rd finger 3rd fret B string'
        },
        'A': { 
            frets: [-1, 0, 2, 2, 2, 0], 
            fingers: [0, 0, 1, 2, 3, 0],
            description: 'A Major - 1st finger 2nd fret D string, 2nd finger 2nd fret G string, 3rd finger 2nd fret B string'
        },
        'C': { 
            frets: [-1, 3, 2, 0, 1, 0], 
            fingers: [0, 3, 2, 0, 1, 0],
            description: 'C Major - 1st finger 1st fret B string, 2nd finger 2nd fret D string, 3rd finger 3rd fret A string'
        },
        'Em': { 
            frets: [0, 2, 2, 0, 0, 0], 
            fingers: [0, 2, 3, 0, 0, 0],
            description: 'E Minor - 2nd finger 2nd fret A string, 3rd finger 2nd fret D string'
        },
        'F': { 
            frets: [1, 3, 3, 2, 1, 1], 
            fingers: [1, 3, 4, 2, 1, 1],
            description: 'F Major - Barre chord: 1st finger barres 1st fret, 2nd finger 2nd fret G string, 3rd finger 3rd fret A string, 4th finger 3rd fret D string'
        },
        'Am': { 
            frets: [-1, 0, 2, 2, 1, 0], 
            fingers: [0, 0, 2, 3, 1, 0],
            description: 'A Minor - 1st finger 1st fret B string, 2nd finger 2nd fret D string, 3rd finger 2nd fret G string'
        },
        'E': { 
            frets: [0, 2, 2, 1, 0, 0], 
            fingers: [0, 2, 3, 1, 0, 0],
            description: 'E Major - 1st finger 1st fret G string, 2nd finger 2nd fret A string, 3rd finger 2nd fret D string'
        },
        'B': { 
            frets: [-1, 2, 4, 4, 4, 2], 
            fingers: [0, 1, 3, 4, 4, 1],
            description: 'B Major - 1st finger barres 2nd fret, 3rd finger 4th fret D string, 4th finger 4th fret G & B strings'
        },
        'F#': { 
            frets: [2, 4, 4, 3, 2, 2], 
            fingers: [1, 3, 4, 2, 1, 1],
            description: 'F# Major - 1st finger barres 2nd fret, 2nd finger 3rd fret G string, 3rd finger 4th fret A string, 4th finger 4th fret D string'
        },
        'Dm': { 
            frets: [-1, -1, 0, 2, 3, 1], 
            fingers: [0, 0, 0, 1, 3, 2],
            description: 'D Minor - 1st finger 1st fret high E, 2nd finger 2nd fret G string, 3rd finger 3rd fret B string'
        },
        'Bm': { 
            frets: [-1, 2, 4, 4, 3, 2], 
            fingers: [0, 1, 3, 4, 2, 1],
            description: 'B Minor - 1st finger barres 2nd fret, 2nd finger 3rd fret B string, 3rd finger 4th fret D string, 4th finger 4th fret G string'
        },
        'Bb': { 
            frets: [-1, 1, 3, 3, 3, 1], 
            fingers: [0, 1, 3, 4, 4, 1],
            description: 'Bb Major - 1st finger barres 1st fret, 3rd finger 3rd fret D string, 4th finger 3rd fret G & B strings'
        },
        'Eb': { 
            frets: [-1, -1, 1, 3, 4, 3], 
            fingers: [0, 0, 1, 2, 4, 3],
            description: 'Eb Major - 1st finger 1st fret D string, 2nd finger 3rd fret G string, 3rd finger 3rd fret high E, 4th finger 4th fret B string'
        },
        'Gm': { 
            frets: [3, 5, 5, 3, 3, 3], 
            fingers: [1, 3, 4, 1, 1, 1],
            description: 'G Minor - 1st finger barres 3rd fret, 3rd finger 5th fret A string, 4th finger 5th fret D string'
        },
        'Cm': { 
            frets: [-1, 3, 5, 5, 4, 3], 
            fingers: [0, 1, 3, 4, 2, 1],
            description: 'C Minor - 1st finger barres 3rd fret, 2nd finger 4th fret B string, 3rd finger 5th fret A string, 4th finger 5th fret D string'
        }
    };

    const chord = chordLibrary[testChord] || { 
        frets: [0, 0, 0, 0, 0, 0], 
        fingers: [0, 0, 0, 0, 0, 0],
        description: 'Unknown chord'
    };
    const strings = ['E', 'A', 'D', 'G', 'B', 'E'];

    const size = mini ? 'mini' : compact ? 'compact' : 'normal';

    return (
        <div className={`chord-diagram ${size}`} title={chord.description}>
            <div className="chord-name">{testChord}</div>
            <div className="fretboard">
                <div className="nut"></div>
                {[0, 1, 2, 3, 4].map(fret => (
                    <div key={fret} className={`fret fret-${fret}`}>
                        {chord.frets.map((fretNum, stringIndex) => {
                            // Place finger positions on the correct fret
                            if (fretNum === fret && fret > 0) {
                                return (
                                    <div 
                                        key={`finger-${fret}-${stringIndex}`} 
                                        className={`finger finger-${chord.fingers[stringIndex]} ${chord.fingers[stringIndex] === 1 ? 'index' : ''} ${chord.fingers[stringIndex] === 2 ? 'middle' : ''} ${chord.fingers[stringIndex] === 3 ? 'ring' : ''} ${chord.fingers[stringIndex] === 4 ? 'pinky' : ''}`}
                                        style={{ left: `${stringIndex * 16.66}%` }}
                                        data-finger={chord.fingers[stringIndex]}
                                        data-string={stringIndex}
                                        data-fret={fret}
                                        title={`Finger ${chord.fingers[stringIndex]} on string ${strings[stringIndex]} at fret ${fret}`}
                                    >
                                        {chord.fingers[stringIndex]}
                                    </div>
                                );
                            }
                            // Show open strings (fret 0) above the nut
                            if (fretNum === 0 && fret === 0) {
                                return (
                                    <div 
                                        key={`open-${stringIndex}`} 
                                        className="open-string"
                                        style={{ left: `${stringIndex * 16.66}%` }}
                                        data-string={stringIndex}
                                        title={`Open ${strings[stringIndex]} string`}
                                    >
                                        O
                                    </div>
                                );
                            }
                            // Show muted strings (fret -1) above the nut
                            if (fretNum === -1 && fret === 0) {
                                return (
                                    <div 
                                        key={`muted-${stringIndex}`} 
                                        className="muted-string"
                                        style={{ left: `${stringIndex * 16.66}%` }}
                                        data-string={stringIndex}
                                        title={`Muted ${strings[stringIndex]} string`}
                                    >
                                        X
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                ))}
                <div className="strings">
                    {strings.map((string, index) => (
                        <div key={index} className="string" data-string={string} />
                    ))}
                </div>
                
                {/* Fret numbers for larger chords */}
                {!compact && (
                    <div className="fret-numbers">
                        {[1, 2, 3, 4, 5].map(fretNum => (
                            <div key={fretNum} className="fret-number" style={{ top: `${fretNum * 18 + 13}px` }}>
                                {fretNum}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Finger position guide for non-compact mode */}
            {!compact && (
                <div className="finger-guide">
                    <div className="finger-legend">
                        <span className="finger-1">1 = Index</span>
                        <span className="finger-2">2 = Middle</span>
                        <span className="finger-3">3 = Ring</span>
                        <span className="finger-4">4 = Pinky</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChordDiagram;
