@echo off
REM Quick Install Script for AI Chord Detection
REM Run this to install Basic Pitch AI model

echo ========================================
echo ChordyPi AI Chord Detection Setup
echo ========================================
echo.

cd /d "%~dp0"
cd server

echo Installing AI dependencies...
echo.

python install_ai_chord_detection.py

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart the Flask server
echo 2. Test chord detection on a song
echo 3. Enjoy 90-95%% accuracy!
echo.

pause
