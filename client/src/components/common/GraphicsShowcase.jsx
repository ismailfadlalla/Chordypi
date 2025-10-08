import React, { useState } from 'react';
import { CopyrightFreeGraphics } from './AdvancedSVGGraphics';
import { 
    EnhancedAnalyzingScreen, 
    EnhancedHomeHero, 
    EnhancedPlayerBackground, 
    EnhancedLoadingGraphics, 
    EnhancedChordDisplay,
    EnhancedSearchInterface 
} from './GraphicsLibrary';
import '../../styles/components/css-graphics.css';
import '../../styles/components/enhanced-graphics.css';
import '../../styles/components/showcase.css';

// Showcase page to demonstrate all copyright-free graphics
const GraphicsShowcase = () => {
    const [currentDemo, setCurrentDemo] = useState('home');

    const renderDemo = () => {
        switch (currentDemo) {
            case 'home':
                return (
                    <div className="demo-section">
                        <h2>Enhanced Home Hero</h2>
                        <div className="demo-container">
                            <EnhancedHomeHero />
                        </div>
                    </div>
                );
            
            case 'analyzing':
                return (
                    <div className="demo-section">
                        <h2>Enhanced Analyzing Screen</h2>
                        <div className="demo-container analyzing-demo">
                            <EnhancedAnalyzingScreen 
                                songTitle="Wonderwall by Oasis"
                                step={2}
                                useAnimation={true}
                            />
                        </div>
                    </div>
                );
            
            case 'svg':
                return (
                    <div className="demo-section">
                        <h2>SVG Graphics Collection</h2>
                        <div className="graphics-grid">
                            <div className="graphic-item">
                                <h3>Musical Staff</h3>
                                <CopyrightFreeGraphics.Staff width={300} height={100} />
                            </div>
                            
                            <div className="graphic-item">
                                <h3>Musical Staff</h3>
                                <CopyrightFreeGraphics.Staff width={300} height={100} />
                            </div>
                            
                            <div className="graphic-item">
                                <h3>Chord Progression</h3>
                                <CopyrightFreeGraphics.Chords chords={['C', 'Am', 'F', 'G']} />
                            </div>
                            
                            <div className="graphic-item">
                                <h3>Vinyl Record</h3>
                                <CopyrightFreeGraphics.Vinyl size={120} />
                            </div>
                            
                            <div className="graphic-item">
                                <h3>Audio Waveform</h3>
                                <CopyrightFreeGraphics.Waveform width={250} height={60} />
                            </div>
                            
                            <div className="graphic-item">
                                <h3>Equalizer</h3>
                                <CopyrightFreeGraphics.Equalizer bars={12} />
                            </div>
                        </div>
                    </div>
                );
            
            case 'css':
                return (
                    <div className="demo-section">
                        <h2>CSS-Only Graphics</h2>
                        <div className="graphics-grid">
                            <div className="graphic-item">
                                <h3>CSS Fretboard</h3>
                                <div className="css-fretboard">
                                    <div className="css-strings"></div>
                                </div>
                            </div>
                            
                            <div className="graphic-item">
                                <h3>CSS Vinyl</h3>
                                <div className="css-vinyl"></div>
                            </div>
                            
                            <div className="graphic-item">
                                <h3>CSS Equalizer</h3>
                                <div className="css-equalizer">
                                    {Array.from({ length: 8 }, (_, i) => (
                                        <div key={i} className="css-equalizer-bar"></div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="graphic-item">
                                <h3>CSS Music Note</h3>
                                <div className="css-music-note"></div>
                            </div>
                            
                            <div className="graphic-item">
                                <h3>CSS Chord Diagram</h3>
                                <div className="css-chord-diagram">
                                    <div className="finger"></div>
                                    <div className="finger"></div>
                                    <div className="finger"></div>
                                </div>
                            </div>
                            
                            <div className="graphic-item">
                                <h3>CSS Musical Spinner</h3>
                                <div className="css-musical-spinner"></div>
                            </div>
                        </div>
                    </div>
                );
            
            case 'loading':
                return (
                    <div className="demo-section">
                        <h2>Loading Graphics</h2>
                        <div className="graphics-grid">
                            <div className="graphic-item">
                                <h3>Default Loading</h3>
                                <EnhancedLoadingGraphics type="default" message="Analyzing chords..." />
                            </div>
                            
                            <div className="graphic-item">
                                <h3>Vinyl Loading</h3>
                                <EnhancedLoadingGraphics type="vinyl" message="Processing audio..." />
                            </div>
                            
                            <div className="graphic-item">
                                <h3>Equalizer Loading</h3>
                                <EnhancedLoadingGraphics type="equalizer" message="Detecting frequencies..." />
                            </div>
                            
                            <div className="graphic-item">
                                <h3>Waveform Loading</h3>
                                <EnhancedLoadingGraphics type="waveform" message="Building progression..." />
                            </div>
                        </div>
                    </div>
                );
            
            case 'chords':
                return (
                    <div className="demo-section">
                        <h2>Chord Display Graphics</h2>
                        <div className="graphics-grid">
                            {['C', 'Am', 'F', 'G', 'Dm', 'Em'].map(chord => (
                                <EnhancedChordDisplay 
                                    key={chord}
                                    chordName={chord}
                                    className="demo-chord"
                                />
                            ))}
                        </div>
                    </div>
                );
            
            default:
                return <div>Select a demo from the navigation</div>;
        }
    };

    return (
        <div className="graphics-showcase">
            <header className="showcase-header">
                <h1>🎸 ChordyPi Graphics Showcase</h1>
                <p>Copyright-free SVG and CSS graphics for music applications</p>
            </header>
            
            <nav className="showcase-nav">
                <button 
                    className={currentDemo === 'home' ? 'active' : ''} 
                    onClick={() => setCurrentDemo('home')}
                >
                    Home Hero
                </button>
                <button 
                    className={currentDemo === 'analyzing' ? 'active' : ''} 
                    onClick={() => setCurrentDemo('analyzing')}
                >
                    Analyzing Screen
                </button>
                <button 
                    className={currentDemo === 'svg' ? 'active' : ''} 
                    onClick={() => setCurrentDemo('svg')}
                >
                    SVG Graphics
                </button>
                <button 
                    className={currentDemo === 'css' ? 'active' : ''} 
                    onClick={() => setCurrentDemo('css')}
                >
                    CSS Graphics
                </button>
                <button 
                    className={currentDemo === 'loading' ? 'active' : ''} 
                    onClick={() => setCurrentDemo('loading')}
                >
                    Loading States
                </button>
                <button 
                    className={currentDemo === 'chords' ? 'active' : ''} 
                    onClick={() => setCurrentDemo('chords')}
                >
                    Chord Displays
                </button>
            </nav>
            
            <main className="showcase-content">
                {renderDemo()}
            </main>
            
            <footer className="showcase-footer">
                <div className="copyright-info">
                    <h3>✅ Copyright Information</h3>
                    <ul>
                        <li>All graphics are original creations</li>
                        <li>SVG animations use pure CSS/JavaScript</li>
                        <li>No external images or copyrighted content</li>
                        <li>Free to use and modify</li>
                        <li>Responsive and performant</li>
                    </ul>
                </div>
                
                <div className="usage-examples">
                    <h3>🔧 Usage Examples</h3>
                    <pre>{`// Import graphics
import { CopyrightFreeGraphics } from './components/common/AdvancedSVGGraphics';

// Use animated vinyl
<CopyrightFreeGraphics.Vinyl size={150} />

// Use CSS-only graphics
<div className="css-vinyl"></div>

// Use enhanced components
<EnhancedAnalyzingScreen songTitle="Song Name" />`}</pre>
                </div>
            </footer>
        </div>
    );
};

export default GraphicsShowcase;
