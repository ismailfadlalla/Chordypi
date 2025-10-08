import React from 'react';
import { CopyrightFreeGraphics } from './AdvancedSVGGraphics';
import '../../styles/components/css-graphics.css';

// Component library for enhanced graphics and animations
export const GraphicsLibrary = {
  
  // Enhanced analyzing screen with multiple graphics options
  AnalyzingScreen: ({ songTitle, step = 0, useAnimation = true }) => (
    <div className="analyzing-graphics-container">
      {useAnimation ? (
        <CopyrightFreeGraphics.Vinyl size={150} className="main-vinyl-animation" />
      ) : (
        <div className="css-vinyl"></div>
      )}
      
      <div className="analyzing-content-enhanced">
        <h2 className="analyzing-title">🎯 Analyzing Real Chords</h2>
        <h3 className="song-title">"{songTitle}"</h3>
        
        <div className="progress-graphics">
          <CopyrightFreeGraphics.Waveform width={250} height={40} />
          <div className="css-equalizer">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="css-equalizer-bar"></div>
            ))}
          </div>
        </div>
        
        <div className="analysis-steps-visual">
          {[
            { icon: "📥", text: "Downloading audio...", active: step >= 0 },
            { icon: "🎵", text: "Processing frequencies...", active: step >= 1 },
            { icon: "🔍", text: "Detecting chords...", active: step >= 2 },
            { icon: "✨", text: "Finalizing analysis...", active: step >= 3 }
          ].map((stepData, i) => (
            <div key={i} className={`step-visual ${stepData.active ? 'active' : ''}`}>
              <span className="step-icon">{stepData.icon}</span>
              <span className="step-text">{stepData.text}</span>
              {stepData.active && <div className="css-musical-spinner"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  // Enhanced home page hero
  HomeHero: ({ onSearch }) => (
    <div className="home-hero-enhanced">
      <div className="animated-gradient-bg hero-background">
        <div className="hero-graphics-container">
          <CopyrightFreeGraphics.Staff width={400} height={80} className="hero-staff" />
        </div>
        
        <div className="hero-content">
          <div className="logo-section">
            <div className="css-music-note"></div>
            <div className="css-music-note"></div>
          </div>
          
          <p className="hero-subtitle">
            Discover real chord progressions from your favorite songs
          </p>
          
          <div className="search-interface-enhanced">
            <div className="search-decoration">
              <CopyrightFreeGraphics.Vinyl size={40} />
              <span className="search-text">Search for any song...</span>
              <CopyrightFreeGraphics.Vinyl size={40} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),

  // Player page enhancement
  PlayerBackground: ({ chords = [], currentChord = 0 }) => (
    <div className="player-background-enhanced">
      <div className="musical-gradient-bg player-bg">
        <div className="floating-graphics">
          {/* Floating musical elements */}
          <div className="floating-note note-1">
            <div className="css-music-note"></div>
          </div>
          <div className="floating-note note-2">
            <CopyrightFreeGraphics.Vinyl size={60} />
          </div>
          <div className="floating-note note-3">
            <div className="css-chord-diagram">
              <div className="finger"></div>
              <div className="finger"></div>
              <div className="finger"></div>
            </div>
          </div>
        </div>
        
        {/* Chord progression visualization */}
        <div className="chord-progression-bg">
          <CopyrightFreeGraphics.Chords 
            chords={chords.slice(0, 4).map(c => c.name || c)} 
            className="background-chords"
          />
        </div>
        
        {/* Background fretboard */}
        <div className="background-fretboard">
          <div className="css-fretboard">
            <div className="css-strings"></div>
          </div>
        </div>
      </div>
    </div>
  ),

  // Loading states with graphics
  LoadingGraphics: ({ type = "default", message = "Loading..." }) => {
    const graphics = {
      default: <div className="css-musical-spinner"></div>,
      vinyl: <CopyrightFreeGraphics.Vinyl size={80} />,
      equalizer: (
        <div className="css-equalizer">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="css-equalizer-bar"></div>
          ))}
        </div>
      ),
      waveform: <CopyrightFreeGraphics.Waveform width={150} height={40} />
    };

    return (
      <div className="loading-graphics-container">
        {graphics[type]}
        <p className="loading-message">{message}</p>
      </div>
    );
  },

  // Chord display with graphics
  ChordDisplay: ({ chordName, frets = [], className = "" }) => (
    <div className={`chord-display-enhanced ${className}`}>
      <div className="chord-visual">
        <div className="css-chord-diagram">
          <div className="finger"></div>
          <div className="finger"></div>
          <div className="finger"></div>
        </div>
        <div className="chord-name-display">{chordName}</div>
      </div>
      
      <div className="chord-animation">
        <div className="css-wave-pattern"></div>
      </div>
    </div>
  ),

  // Search interface enhancement
  SearchEnhanced: ({ onSearch, query, setQuery }) => (
    <div className="search-enhanced-container">
      <div className="search-graphics-header">
        <CopyrightFreeGraphics.Vinyl size={100} />
        <div className="search-title-section">
          <h1>Find Your Chords</h1>
          <p>Real chord analysis powered by AI</p>
        </div>
        <CopyrightFreeGraphics.Vinyl size={80} />
      </div>
      
      <div className="search-input-enhanced">
        <div className="input-decoration">
          <CopyrightFreeGraphics.Vinyl size={30} />
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for any song... (e.g., 'Wonderwall by Oasis')"
          className="enhanced-search-input"
        />
      </div>
      
      <div className="search-features-visual">
        <div className="feature-item">
          <CopyrightFreeGraphics.Equalizer bars={5} />
          <span>Real-time Analysis</span>
        </div>
        <div className="feature-item">
          <div className="css-chord-diagram">
            <div className="finger"></div>
            <div className="finger"></div>
          </div>
          <span>Accurate Chords</span>
        </div>
        <div className="feature-item">
          <div className="css-musical-spinner"></div>
          <span>AI Powered</span>
        </div>
      </div>
    </div>
  )
};

// Easy-to-use wrapper components
export const EnhancedAnalyzingScreen = (props) => <GraphicsLibrary.AnalyzingScreen {...props} />;
export const EnhancedHomeHero = (props) => <GraphicsLibrary.HomeHero {...props} />;
export const EnhancedPlayerBackground = (props) => <GraphicsLibrary.PlayerBackground {...props} />;
export const EnhancedLoadingGraphics = (props) => <GraphicsLibrary.LoadingGraphics {...props} />;
export const EnhancedChordDisplay = (props) => <GraphicsLibrary.ChordDisplay {...props} />;
export const EnhancedSearchInterface = (props) => <GraphicsLibrary.SearchEnhanced {...props} />;

export default GraphicsLibrary;
