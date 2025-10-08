import React, { useState } from 'react';
import '../../styles/design-tokens.css';
import '../../styles/components/button-system.css';
import '../../styles/components/search-enhanced.css';

const SearchInterface = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setQuery('');
        }
    };

    return (
        <div className="search-interface-enhanced">
            {/* AI Badge */}
            <div className="ai-badge">
                <span className="ai-icon">🤖</span>
                <span>AI-Powered Chord Detection</span>
            </div>

            {/* Hero Section */}
            <div className="search-hero">
                <h1 className="search-title gradient-text">
                    Discover Any Song's Chords
                </h1>
                <p className="search-subtitle">
                    Real-time AI analysis • 98% accuracy • Instant results
                </p>
            </div>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="search-form-glass">
                <div className="search-input-wrapper">
                    <div className="search-icon-ai">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                            <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Search any song... (e.g., 'Let It Be by The Beatles')"
                        className="search-input-ai"
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-md btn-pill search-submit"
                        disabled={!query.trim()}
                    >
                        <span>Search</span>
                        <span className="search-icon">🔍</span>
                    </button>
                </div>
            </form>
            
            {/* Feature Pills */}
            <div className="feature-pills">
                <div className="feature-pill glass">
                    <div className="feature-pill-icon">🎯</div>
                    <div className="feature-pill-content">
                        <div className="feature-pill-title">Real-time Analysis</div>
                        <div className="feature-pill-desc">Instant chord detection</div>
                    </div>
                </div>
                <div className="feature-pill glass">
                    <div className="feature-pill-icon">�</div>
                    <div className="feature-pill-content">
                        <div className="feature-pill-title">Interactive Fretboard</div>
                        <div className="feature-pill-desc">Visual finger positions</div>
                    </div>
                </div>
                <div className="feature-pill glass">
                    <div className="feature-pill-icon">⏱️</div>
                    <div className="feature-pill-content">
                        <div className="feature-pill-title">Synced Playback</div>
                        <div className="feature-pill-desc">Follow along in real-time</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchInterface;