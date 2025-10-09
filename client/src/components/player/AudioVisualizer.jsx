import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const VisualizerContainer = styled.div`
  width: 100%;
  height: 450px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const SongInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  padding: 15px 30px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const SongTitle = styled.h3`
  color: white;
  margin: 0 0 5px 0;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const SongArtist = styled.p`
  color: #FFD700;
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
`;

const PlayingIndicator = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 48px;
  animation: pulse 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
  z-index: 10;

  @keyframes pulse {
    0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
    50% { transform: translateX(-50%) scale(1.2); opacity: 0.8; }
  }
`;

const AudioVisualizer = ({ audioRef, isPlaying, title, artist }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  
  useEffect(() => {
    if (!audioRef?.current || !canvasRef.current) return;

    const audioElement = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create audio context and analyser
    if (!analyserRef.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;
      const bufferLength = dataArray.length;

      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency bars
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        // Create gradient for each bar
        const barGradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        barGradient.addColorStop(0, '#FFD700');
        barGradient.addColorStop(0.5, '#FF6B6B');
        barGradient.addColorStop(1, '#6C5CE7');
        
        ctx.fillStyle = barGradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Add glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFD700';
        
        x += barWidth + 2;
      }

      // Draw waveform circle in center
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Animated circle based on audio
      const avgFrequency = dataArray.reduce((a, b) => a + b) / bufferLength;
      const radius = 50 + (avgFrequency / 255) * 50;
      
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      const circleGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, radius
      );
      circleGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
      circleGradient.addColorStop(1, 'rgba(108, 92, 231, 0.4)');
      ctx.fillStyle = circleGradient;
      ctx.fill();
    };

    if (isPlaying) {
      draw();
    } else {
      // Draw static visualization when paused
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw paused circle
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, 2 * Math.PI);
      const circleGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, 80
      );
      circleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      circleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
      ctx.fillStyle = circleGradient;
      ctx.fill();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioRef, isPlaying]);

  return (
    <VisualizerContainer>
      <Canvas ref={canvasRef} />
      <SongInfo>
        <SongTitle>🎵 {title}</SongTitle>
        <SongArtist>{artist}</SongArtist>
      </SongInfo>
      {isPlaying && (
        <PlayingIndicator>
          🎸
        </PlayingIndicator>
      )}
    </VisualizerContainer>
  );
};

export default AudioVisualizer;
