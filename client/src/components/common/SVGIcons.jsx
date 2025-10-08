import React from 'react';

// Copyright-safe SVG icons and graphics for ChordyPi
// These are original creations and can be used freely

export const SVGIcons = {
  // Guitar icon SVG
  GuitarIcon: () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#guitar-glow)">
        {/* Guitar body */}
        <ellipse cx="70" cy="60" rx="25" ry="35" fill="#8B4513" stroke="#FFD700" strokeWidth="2"/>
        <ellipse cx="70" cy="60" rx="20" ry="30" fill="#D2691E"/>
        
        {/* Sound hole */}
        <circle cx="70" cy="60" r="8" fill="#2F1B14"/>
        <circle cx="70" cy="60" r="6" fill="#000000"/>
        
        {/* Neck */}
        <rect x="20" y="58" width="50" height="4" fill="#8B4513"/>
        
        {/* Frets */}
        <line x1="25" y1="56" x2="25" y2="66" stroke="#C0C0C0" strokeWidth="1"/>
        <line x1="30" y1="56" x2="30" y2="66" stroke="#C0C0C0" strokeWidth="1"/>
        <line x1="35" y1="56" x2="35" y2="66" stroke="#C0C0C0" strokeWidth="1"/>
        <line x1="40" y1="56" x2="40" y2="66" stroke="#C0C0C0" strokeWidth="1"/>
        
        {/* Strings */}
        <line x1="20" y1="57" x2="70" y2="57" stroke="#E6E6FA" strokeWidth="0.5"/>
        <line x1="20" y1="59" x2="70" y2="59" stroke="#E6E6FA" strokeWidth="0.5"/>
        <line x1="20" y1="61" x2="70" y2="61" stroke="#E6E6FA" strokeWidth="0.5"/>
        <line x1="20" y1="63" x2="70" y2="63" stroke="#E6E6FA" strokeWidth="0.5"/>
        
        {/* Headstock */}
        <rect x="15" y="57" width="8" height="6" fill="#654321"/>
        
        {/* Tuning pegs */}
        <circle cx="18" cy="58" r="1" fill="#FFD700"/>
        <circle cx="18" cy="62" r="1" fill="#FFD700"/>
      </g>
      
      <defs>
        <filter id="guitar-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  ),

  // Music note icon
  MusicNote: () => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="#FFD700">
        {/* Note head */}
        <ellipse cx="12" cy="35" rx="8" ry="6" transform="rotate(-20 12 35)"/>
        {/* Stem */}
        <rect x="19" y="15" width="2" height="20" rx="1"/>
        {/* Flag */}
        <path d="M21 15 Q35 10 35 20 Q25 25 21 20" fill="#FFD700"/>
      </g>
    </svg>
  ),

  // Chord diagram icon
  ChordDiagram: () => (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Fretboard */}
      <rect x="10" y="20" width="60" height="60" fill="#F5DEB3" stroke="#8B4513" strokeWidth="2"/>
      
      {/* Frets */}
      <line x1="10" y1="35" x2="70" y2="35" stroke="#8B4513" strokeWidth="1"/>
      <line x1="10" y1="50" x2="70" y2="50" stroke="#8B4513" strokeWidth="1"/>
      <line x1="10" y1="65" x2="70" y2="65" stroke="#8B4513" strokeWidth="1"/>
      
      {/* Strings */}
      <line x1="20" y1="20" x2="20" y2="80" stroke="#E6E6FA" strokeWidth="1"/>
      <line x1="30" y1="20" x2="30" y2="80" stroke="#E6E6FA" strokeWidth="1"/>
      <line x1="40" y1="20" x2="40" y2="80" stroke="#E6E6FA" strokeWidth="1"/>
      <line x1="50" y1="20" x2="50" y2="80" stroke="#E6E6FA" strokeWidth="1"/>
      <line x1="60" y1="20" x2="60" y2="80" stroke="#E6E6FA" strokeWidth="1"/>
      
      {/* Finger positions */}
      <circle cx="30" cy="27" r="4" fill="#FF6B6B"/>
      <circle cx="40" cy="42" r="4" fill="#FF6B6B"/>
      <circle cx="50" cy="42" r="4" fill="#FF6B6B"/>
      
      {/* Chord name */}
      <text x="40" y="95" textAnchor="middle" fontSize="12" fill="#333">C</text>
    </svg>
  ),

  // Search icon
  SearchIcon: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="8" stroke="#FFD700" strokeWidth="2"/>
      <path d="m21 21-4.35-4.35" stroke="#FFD700" strokeWidth="2"/>
    </svg>
  ),

  // Loading spinner with musical note
  MusicalSpinner: () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" stroke="#FFD700" strokeOpacity="0.3" strokeWidth="6"/>
      <circle cx="40" cy="40" r="35" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" strokeDasharray="164.93361431346415 54.97787143782138">
        <animateTransform attributeName="transform" type="rotate" dur="2s" values="0 40 40;360 40 40" repeatCount="indefinite"/>
      </circle>
      {/* Musical note in center */}
      <g transform="translate(32, 25) scale(0.8)">
        <ellipse cx="12" cy="35" rx="8" ry="6" transform="rotate(-20 12 35)" fill="#FFD700"/>
        <rect x="19" y="15" width="2" height="20" rx="1" fill="#FFD700"/>
        <path d="M21 15 Q35 10 35 20 Q25 25 21 20" fill="#FFD700"/>
      </g>
    </svg>
  )
};

// Background patterns that can be used as CSS
export const BackgroundPatterns = {
  musicalNotes: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd700' fill-opacity='0.1'%3E%3Cpath d='M20 20h20v20H20z'/%3E%3Cpath d='M10 10h40v40H10z' fill='none' stroke='%23ffd700' stroke-opacity='0.05'/%3E%3C/g%3E%3C/svg%3E")`,
  
  guitarPattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd700' fill-opacity='0.05'%3E%3Ccircle cx='50' cy='50' r='30'/%3E%3Cline x1='20' y1='40' x2='80' y2='40' stroke='%23ffd700' stroke-opacity='0.05'/%3E%3Cline x1='20' y1='50' x2='80' y2='50' stroke='%23ffd700' stroke-opacity='0.05'/%3E%3Cline x1='20' y1='60' x2='80' y2='60' stroke='%23ffd700' stroke-opacity='0.05'/%3E%3C/g%3E%3C/svg%3E")`,
  
  chordPattern: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffd700' fill-opacity='0.03'%3E%3Crect x='10' y='10' width='60' height='60' fill='none' stroke='%23ffd700' stroke-opacity='0.03'/%3E%3Cline x1='10' y1='25' x2='70' y2='25' stroke='%23ffd700' stroke-opacity='0.03'/%3E%3Cline x1='10' y1='40' x2='70' y2='40' stroke='%23ffd700' stroke-opacity='0.03'/%3E%3Cline x1='10' y1='55' x2='70' y2='55' stroke='%23ffd700' stroke-opacity='0.03'/%3E%3Cline x1='25' y1='10' x2='25' y2='70' stroke='%23ffd700' stroke-opacity='0.03'/%3E%3Cline x1='40' y1='10' x2='40' y2='70' stroke='%23ffd700' stroke-opacity='0.03'/%3E%3Cline x1='55' y1='10' x2='55' y2='70' stroke='%23ffd700' stroke-opacity='0.03'/%3E%3C/g%3E%3C/svg%3E")`
};

export default SVGIcons;
