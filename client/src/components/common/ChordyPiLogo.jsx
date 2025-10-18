import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: transform 0.3s ease;

  &:hover {
    transform: ${props => props.clickable ? 'scale(1.05)' : 'none'};
  }
`;

const Tagline = styled.div`
  font-size: ${props => props.size === 'small' ? '0.7rem' : props.size === 'large' ? '1.2rem' : '0.9rem'};
  color: ${props => props.lightText ? '#b0b0b0' : '#666'};
  text-align: center;
  margin-top: ${props => props.size === 'small' ? '8px' : props.size === 'large' ? '20px' : '12px'};
  font-weight: 500;
  letter-spacing: 1px;
`;

const FullLogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoText = styled.span`
  font-size: ${props => props.size === 'small' ? '1.5rem' : props.size === 'large' ? '3rem' : '2rem'};
  font-weight: 800;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
`;

const LogoImage = styled.img`
  height: ${props => props.size === 'small' ? '40px' : props.size === 'large' ? '500px' : '250px'};
  width: auto;
  display: block;
  object-fit: contain;
`;

/**
 * ChordyPi Logo Component
 * 
 * Displays the ChordyPi brand logo (image or text fallback)
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
      {!imageError ? (
        <LogoImage 
          src="/images/chordypi-logo.png" 
          alt="ChordyPi Logo"
          size={size}
          onError={() => setImageError(true)}
        />
      ) : (
        <LogoText size={size}>ChordyPi</LogoText>
      )}
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
