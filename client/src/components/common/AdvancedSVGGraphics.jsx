import React from 'react';

// Advanced copyright-free SVG graphics and animations for ChordyPi

export const AdvancedSVGGraphics = {
  // Musical staff with floating notes
  MusicalStaff: ({ width = 300, height = 100, className = "" }) => (
    <svg width={width} height={height} viewBox="0 0 300 100" className={`musical-staff ${className}`}>
      {/* Staff lines */}
      {[20, 30, 40, 50, 60].map((y, i) => (
        <line key={i} x1="20" y1={y} x2="280" y2={y} stroke="#333" strokeWidth="1" opacity="0.6"/>
      ))}
      
      {/* Treble clef */}
      <path
        d="M 30 45 Q 25 35 30 25 Q 40 20 45 30 Q 50 40 45 50 Q 40 60 35 55 Q 30 50 35 45"
        fill="#FFD700"
        stroke="#B8860B"
        strokeWidth="1"
      >
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1;1.1;1"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Floating notes */}
      {[
        { x: 80, y: 35, delay: "0s" },
        { x: 120, y: 45, delay: "0.5s" },
        { x: 160, y: 25, delay: "1s" },
        { x: 200, y: 55, delay: "1.5s" },
        { x: 240, y: 40, delay: "2s" }
      ].map((note, i) => (
        <g key={i}>
          {/* Note head */}
          <ellipse cx={note.x} cy={note.y} rx="6" ry="4" fill="#FFD700" transform={`rotate(-20 ${note.x} ${note.y})`}>
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              repeatCount="indefinite"
              begin={note.delay}
            />
          </ellipse>
          {/* Stem */}
          <line x1={note.x + 5} y1={note.y} x2={note.x + 5} y2={note.y - 20} stroke="#FFD700" strokeWidth="2">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              repeatCount="indefinite"
              begin={note.delay}
            />
          </line>
        </g>
      ))}
    </svg>
  ),

  // Chord progression visualizer
  ChordProgression: ({ chords = ['C', 'Am', 'F', 'G'], className = "" }) => (
    <svg width="400" height="80" viewBox="0 0 400 80" className={`chord-progression ${className}`}>
      <defs>
        <linearGradient id="chordGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4CAF50"/>
          <stop offset="25%" stopColor="#2196F3"/>
          <stop offset="50%" stopColor="#FF9800"/>
          <stop offset="75%" stopColor="#E91E63"/>
          <stop offset="100%" stopColor="#9C27B0"/>
        </linearGradient>
      </defs>
      
      {chords.map((chord, i) => (
        <g key={i} transform={`translate(${i * 90 + 20}, 20)`}>
          {/* Chord circle */}
          <circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="url(#chordGradient)"
            strokeWidth="3"
            strokeDasharray="157"
            strokeDashoffset="157"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="157;0;157"
              dur="4s"
              repeatCount="indefinite"
              begin={`${i * 0.5}s`}
            />
          </circle>
          
          {/* Chord name */}
          <text
            x="30"
            y="37"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#FFD700"
          >
            {chord}
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              repeatCount="indefinite"
              begin={`${i * 0.5}s`}
            />
          </text>
          
          {/* Connection line to next chord */}
          {i < chords.length - 1 && (
            <line
              x1="55"
              y1="30"
              x2="85"
              y2="30"
              stroke="#FFD700"
              strokeWidth="2"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                repeatCount="indefinite"
                begin={`${i * 0.5 + 0.5}s`}
              />
            </line>
          )}
        </g>
      ))}
    </svg>
  ),

  // Animated vinyl record
  VinylRecord: ({ size = 100, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`vinyl-record ${className}`}>
      <defs>
        <radialGradient id="vinylGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#333"/>
          <stop offset="30%" stopColor="#1a1a1a"/>
          <stop offset="70%" stopColor="#000"/>
          <stop offset="100%" stopColor="#333"/>
        </radialGradient>
        <radialGradient id="labelGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="70%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FF8C00"/>
        </radialGradient>
      </defs>
      
      {/* Vinyl disc */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#vinylGradient)"
        stroke="#444"
        strokeWidth="1"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Grooves */}
      {[35, 40, 45].map((r, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#555"
          strokeWidth="0.5"
          opacity="0.6"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 50 50;360 50 50"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>
      ))}
      
      {/* Center label */}
      <circle
        cx="50"
        cy="50"
        r="15"
        fill="url(#labelGradient)"
        stroke="#B8860B"
        strokeWidth="1"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Center hole */}
      <circle cx="50" cy="50" r="3" fill="#000"/>
      
      {/* Label text */}
      <text
        x="50"
        y="53"
        textAnchor="middle"
        fontSize="6"
        fill="#000"
        fontWeight="bold"
      >
        ♪
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 50;360 50 50"
          dur="10s"
          repeatCount="indefinite"
        />
      </text>
    </svg>
  ),

  // Audio waveform animation
  AudioWaveform: ({ width = 200, height = 60, className = "" }) => (
    <svg width={width} height={height} viewBox="0 0 200 60" className={`audio-waveform ${className}`}>
      {Array.from({ length: 40 }, (_, i) => {
        const height = Math.random() * 40 + 10;
        const delay = Math.random() * 2;
        return (
          <rect
            key={i}
            x={i * 5}
            y={30 - height / 2}
            width="3"
            height={height}
            fill="#FFD700"
            opacity="0.7"
            rx="1.5"
          >
            <animate
              attributeName="height"
              values={`${height};${height * 0.3};${height};${height * 1.5};${height}`}
              dur="2s"
              repeatCount="indefinite"
              begin={`${delay}s`}
            />
            <animate
              attributeName="y"
              values={`${30 - height / 2};${30 - (height * 0.3) / 2};${30 - height / 2};${30 - (height * 1.5) / 2};${30 - height / 2}`}
              dur="2s"
              repeatCount="indefinite"
              begin={`${delay}s`}
            />
          </rect>
        );
      })}
    </svg>
  ),

  // Equalizer bars
  Equalizer: ({ bars = 12, className = "" }) => (
    <svg width="120" height="80" viewBox="0 0 120 80" className={`equalizer ${className}`}>
      {Array.from({ length: bars }, (_, i) => (
        <rect
          key={i}
          x={i * 10 + 2}
          y="40"
          width="6"
          height="20"
          fill="#FFD700"
          rx="3"
        >
          <animate
            attributeName="height"
            values="5;60;20;40;5"
            dur={`${1 + Math.random()}s`}
            repeatCount="indefinite"
            begin={`${i * 0.1}s`}
          />
          <animate
            attributeName="y"
            values="70;20;55;40;70"
            dur={`${1 + Math.random()}s`}
            repeatCount="indefinite"
            begin={`${i * 0.1}s`}
          />
        </rect>
      ))}
    </svg>
  )
};

// Component wrapper for easy use
export const CopyrightFreeGraphics = {
  Staff: (props) => <AdvancedSVGGraphics.MusicalStaff {...props} />,
  Chords: (props) => <AdvancedSVGGraphics.ChordProgression {...props} />,
  Vinyl: (props) => <AdvancedSVGGraphics.VinylRecord {...props} />,
  Waveform: (props) => <AdvancedSVGGraphics.AudioWaveform {...props} />,
  Equalizer: (props) => <AdvancedSVGGraphics.Equalizer {...props} />
};

export default AdvancedSVGGraphics;
