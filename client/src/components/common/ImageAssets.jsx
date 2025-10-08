import React from 'react';

// Image asset management component
// Place your images in public/images/ folder and reference them here

const ImageAssets = {
  // Logo and branding - using SVG files that exist
  logo: '/images/logo.svg', // SVG logo we created
  icon: '/images/icon.svg', // SVG icon we created
  
  // Backgrounds - using actual images with CSS gradients as fallback
  heroBackground: '/guitar-fretboards.jpeg', // Main guitar fretboard image
  analyzeBackground: '/guitar-fretboards.jpeg', // Same image for analyzing screen  
  playerBackground: '/guitar-fretboards.jpeg', // Same image for player screen
  
  // Musical elements - using CSS/SVG graphics instead
  guitarHero: null, // Using SVG guitar component instead
  chordDiagram: null, // Using CSS styling instead
  musicNotes: null, // Using CSS/SVG components instead
  
  // Fallback to current emoji/CSS approach if images not available
  fallbacks: {
    guitarIcon: '🎸',
    musicIcon: '🎵',
    searchIcon: '🔍',
    analyzeIcon: '🎯'
  }
};

// Helper component for responsive images
export const ResponsiveImage = ({ 
  src, 
  fallback, 
  alt, 
  className = '', 
  style = {},
  onError 
}) => {
  // If no src provided, use fallback immediately
  if (!src) {
    return (
      <span className={`image-fallback ${className}`} style={style} title={alt}>
        {fallback || '🎵'}
      </span>
    );
  }

  const handleError = (e) => {
    if (fallback) {
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'inline-block';
    }
    if (onError) onError(e);
  };

  return (
    <div className={`responsive-image-container ${className}`} style={style}>
      <img 
        src={src} 
        alt={alt}
        onError={handleError}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <span 
        className="image-fallback" 
        style={{ display: 'none' }}
        title={alt}
      >
        {fallback || '🎵'}
      </span>
    </div>
  );
};

// Background image component with fallback
export const BackgroundImage = ({ 
  src, 
  fallbackGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  children,
  className = '',
  style = {}
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    if (!src) {
      setImageError(true);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
    img.src = src;
  }, [src]);

  const usingFallback = !src || imageError || !imageLoaded;
  const backgroundStyle = {
    ...(usingFallback
      ? {
          background: fallbackGradient
        }
      : {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
    ),
    ...style
  };

  return (
    <div className={`background-image ${className}`} style={backgroundStyle}>
      {children}
    </div>
  );
};

export default ImageAssets;
