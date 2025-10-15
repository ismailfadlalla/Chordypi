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

const LogoImage = styled.img`
  width: ${props => {
    switch(props.size) {
      case 'small': return '120px';
      case 'large': return '400px';
      case 'medium':
      default: return '250px';
    }
  }};
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
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

/**
 * ChordyPi Logo Component
 * 
 * Displays the ChordyPi brand logo image
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
  const logoContent = (
    <LogoContainer size={size} clickable={clickable} onClick={onClick}>
      <LogoImage 
        src={`${window.location.origin}/images/chordypi-logo.png`}
        alt="ChordyPi Logo"
        size={size}
        onError={(e) => {
          // Fallback to text if image fails to load
          console.error('Failed to load ChordyPi logo image');
          e.target.style.display = 'none';
          const fallbackHTML = `<span style="font-size: ${size === 'small' ? '1.5rem' : size === 'large' ? '3rem' : '2rem'}; font-weight: 800; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">ChordyPi</span>`;
          e.target.parentElement.innerHTML = fallbackHTML;
        }}
      />
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
