/**
 * 🎵 Unified Analyzing Overlay Component
 * Consistent progress indicator for all song analysis states
 * Enhanced with progressive steps and better UX feedback
 * 
 * NOTE: This component is used on HomePage and SearchResultsPage.
 * AnalyzingPage has its own dedicated overlay implementation.
 */

import React from 'react';
import '../../styles/components/analyzing-overlay.css';

const AnalyzingOverlay = ({ 
    songTitle = '', 
    songThumbnail = null,
    message = 'Analyzing chords...',
    show = false 
}) => {
    const [currentStep, setCurrentStep] = React.useState(0);
    
    // Progressive analysis steps
    const analysisSteps = [
        { icon: '🔍', text: 'Searching database...', duration: 800 },
        { icon: '🎵', text: 'Downloading audio...', duration: 1200 },
        { icon: '🤖', text: 'AI analyzing chords...', duration: 2000 },
        { icon: '✨', text: 'Validating results...', duration: 600 },
        { icon: '🎸', text: 'Preparing player...', duration: 400 }
    ];
    
    React.useEffect(() => {
        if (!show) {
            setCurrentStep(0);
            return;
        }
        
        // Progress through steps
        let currentStepIndex = 0;
        const progressSteps = () => {
            if (currentStepIndex < analysisSteps.length - 1) {
                const timer = setTimeout(() => {
                    currentStepIndex++;
                    setCurrentStep(currentStepIndex);
                    progressSteps();
                }, analysisSteps[currentStepIndex].duration);
                return timer;
            }
        };
        
        const timer = progressSteps();
        return () => clearTimeout(timer);
    }, [show]);
    
    React.useEffect(() => {
        // Prevent body scroll when overlay is showing
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);
    
    if (!show) return null;

    const currentStepData = analysisSteps[currentStep];

    return (
        <div className="unified-analyzing-overlay">
            <div className="overlay-content">
                <div className="step-icon">{currentStepData.icon}</div>
                <h2>Analyzing Chords</h2>
                {songTitle && <p className="song-title">{songTitle}</p>}
                <p className="step-message">{currentStepData.text}</p>
                <div className="progress-steps">
                    {analysisSteps.map((step, index) => (
                        <div 
                            key={index} 
                            className={`step-dot ${index <= currentStep ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyzingOverlay;

