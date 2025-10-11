import React from 'react';
import styled, { keyframes } from 'styled-components';
import flyingVImage from '../../assets/flying-v.png';

// Subtle guitar rotation animation
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0) rotate(-8deg); }
  50% { transform: translateY(-8px) rotate(-5deg); }
`;

const glowAnimation = keyframes`
  0%, 100% { 
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.7)) 
            drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)); 
  }
  50% { 
    filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1)) 
            drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4)); 
  }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.size === 'small' ? '8px' : props.size === 'large' ? '20px' : '12px'};
  user-select: none;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: transform 0.3s ease;

  &:hover {
    transform: ${props => props.clickable ? 'scale(1.05)' : 'none'};
  }
`;

const ChordText = styled.span`
  font-size: ${props => props.size === 'small' ? '1.5rem' : props.size === 'large' ? '3.5rem' : '2.5rem'};
  font-weight: 800;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  animation: ${shimmerAnimation} 3s linear infinite;
`;

const FlyingVContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size === 'small' ? '35px' : props.size === 'large' ? '90px' : '55px'};
  height: ${props => props.size === 'small' ? '50px' : props.size === 'large' ? '130px' : '80px'};
  animation: ${floatAnimation} 3.5s ease-in-out infinite;
  transform-origin: center center;
  margin: 0 -5px; /* Tighten spacing to fit as Y replacement */
`;

const FlyingVImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: ${glowAnimation} 2.5s ease-in-out infinite;
  transition: transform 0.3s ease;
  transform: rotate(-15deg); /* Rotate to match Y angle */
  
  ${LogoContainer}:hover & {
    transform: scale(1.1) rotate(-10deg);
  }
`;

const PiText = styled.span`
  font-size: ${props => props.size === 'small' ? '1.5rem' : props.size === 'large' ? '3.5rem' : '2.5rem'};
  font-weight: 800;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  animation: ${shimmerAnimation} 3s linear infinite;
  position: relative;
`;

const PiSymbol = styled.span`
  font-size: ${props => props.size === 'small' ? '2rem' : props.size === 'large' ? '4.5rem' : '3.2rem'};
  font-weight: 300;
  color: #FFA500;
  text-shadow: 0 0 20px rgba(255, 165, 0, 0.6);
  font-family: 'Times New Roman', serif;
  font-style: italic;
`;

const Tagline = styled.div`
  font-size: ${props => props.size === 'small' ? '0.7rem' : props.size === 'large' ? '1.2rem' : '0.9rem'};
  color: ${props => props.lightText ? '#b0b0b0' : '#666'};
  text-align: center;
  margin-top: ${props => props.size === 'small' ? '4px' : props.size === 'large' ? '12px' : '8px'};
  font-weight: 500;
  letter-spacing: 1px;
`;

const FullLogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * ChordyPi Logo Component
 * 
 * Displays the ChordyPi brand logo with:
 * - "Chord" text in gold gradient
 * - Flying V guitar as the "Y"
 * - "Pi" with π symbol in purple gradient
 * 
 * @param {Object} props
 * @param {string} props.size - 'small', 'medium', or 'large' (default: 'medium')
 * @param {boolean} props.showTagline - Show tagline below logo (default: false)
 * @param {boolean} props.lightText - Use light text for dark backgrounds (default: false)
 * @param {boolean} props.clickable - Make logo clickable with hover effect (default: false)
 * @param {function} props.onClick - Click handler if clickable is true
 */
const ChordyPiLogo = ({ 
  size = 'medium', 
  showTagline = false, 
  lightText = false,
  clickable = false,
  onClick 
}) => {
  const [imageError, setImageError] = React.useState(false);

  const logoContent = (
    <LogoContainer size={size} clickable={clickable} onClick={onClick}>
      <ChordText size={size}>CHORD</ChordText>
      <FlyingVContainer size={size}>
        {!imageError ? (
          <FlyingVImage 
            src={flyingVImage}
            alt="Flying V Guitar as Y"
            onError={(e) => {
              console.error('Failed to load Flying V image:', flyingVImage);
              setImageError(true);
            }}
            onLoad={() => {
              console.log('✅ Flying V image loaded successfully');
            }}
          />
        ) : (
          <span style={{ fontSize: size === 'small' ? '2.5rem' : size === 'large' ? '5rem' : '3.5rem' }}>🎸</span>
        )}
      </FlyingVContainer>
      <PiText size={size}>PI</PiText>
    </LogoContainer>
  );

  if (showTagline) {
    return (
      <FullLogoContainer>
        {logoContent}
        <Tagline size={size} lightText={lightText}>
          Learn Guitar with AI-Powered Chord Analysis
        </Tagline>
      </FullLogoContainer>
    );
  }

  return logoContent;
};

export default ChordyPiLogo;
