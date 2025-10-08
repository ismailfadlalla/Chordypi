/**
 * 🎵 Audio Extractor Service - Client-Side YouTube Audio Extraction
 * 
 * This service downloads YouTube audio directly in the user's browser,
 * bypassing server-side IP blocking issues.
 * 
 * Flow:
 * 1. User clicks "Analyze Song"
 * 2. Extract audio in browser using ytdl-core
 * 3. Convert to WAV/MP3 using Web Audio API
 * 4. Compress audio for faster upload
 * 5. Upload to backend for chord analysis
 */

import ytdl from '@distube/ytdl-core';

/**
 * Extract audio from YouTube video URL
 * @param {string} videoUrl - Full YouTube URL (e.g., https://www.youtube.com/watch?v=xxxxx)
 * @param {function} onProgress - Progress callback (percent: number) => void
 * @returns {Promise<Blob>} Audio file as Blob
 */
export const extractYouTubeAudio = async (videoUrl, onProgress = null) => {
    try {
        console.log('🎵 Starting YouTube audio extraction:', videoUrl);
        
        // Get video info first
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title;
        const duration = parseInt(info.videoDetails.lengthSeconds);
        
        console.log('📋 Video info:', { title, duration: `${duration}s` });
        
        if (onProgress) onProgress(10); // 10% - Got video info
        
        // Filter for audio-only formats
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        
        if (audioFormats.length === 0) {
            throw new Error('No audio formats available for this video');
        }
        
        // Choose best audio quality (prefer m4a or webm)
        const format = audioFormats.find(f => f.container === 'm4a') || 
                       audioFormats.find(f => f.container === 'webm') || 
                       audioFormats[0];
        
        console.log('🎯 Selected format:', {
            container: format.container,
            bitrate: format.audioBitrate,
            codec: format.audioCodec
        });
        
        if (onProgress) onProgress(20); // 20% - Selected format
        
        // Download audio stream
        console.log('⬇️ Downloading audio stream...');
        const stream = ytdl.downloadFromInfo(info, { format });
        
        // Collect chunks
        const chunks = [];
        let downloadedBytes = 0;
        const totalBytes = parseInt(format.contentLength) || 0;
        
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => {
                chunks.push(chunk);
                downloadedBytes += chunk.length;
                
                if (totalBytes > 0 && onProgress) {
                    // Progress from 20% to 80% during download
                    const downloadProgress = (downloadedBytes / totalBytes) * 60 + 20;
                    onProgress(Math.min(80, downloadProgress));
                }
            });
            
            stream.on('end', async () => {
                console.log('✅ Download complete:', {
                    size: `${(downloadedBytes / 1024 / 1024).toFixed(2)} MB`
                });
                
                if (onProgress) onProgress(85); // 85% - Download complete
                
                // Convert chunks to Blob
                const audioBlob = new Blob(chunks, { type: `audio/${format.container}` });
                
                console.log('📦 Created audio blob:', {
                    size: `${(audioBlob.size / 1024 / 1024).toFixed(2)} MB`,
                    type: audioBlob.type
                });
                
                if (onProgress) onProgress(90); // 90% - Blob created
                
                resolve({
                    blob: audioBlob,
                    title,
                    duration,
                    format: format.container
                });
            });
            
            stream.on('error', (error) => {
                console.error('❌ Stream error:', error);
                reject(error);
            });
        });
        
    } catch (error) {
        console.error('❌ Audio extraction failed:', error);
        throw new Error(`Failed to extract audio: ${error.message}`);
    }
};

/**
 * Compress audio file to reduce upload size
 * Uses Web Audio API to decode and re-encode at lower bitrate
 * @param {Blob} audioBlob - Original audio file
 * @param {number} targetBitrate - Target bitrate in kbps (default: 96)
 * @returns {Promise<Blob>} Compressed audio as WAV
 */
export const compressAudio = async (audioBlob, targetBitrate = 96) => {
    try {
        console.log('🗜️ Compressing audio...');
        console.log('Original size:', `${(audioBlob.size / 1024 / 1024).toFixed(2)} MB`);
        
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Read audio file
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        console.log('📊 Audio info:', {
            duration: `${audioBuffer.duration.toFixed(1)}s`,
            channels: audioBuffer.numberOfChannels,
            sampleRate: audioBuffer.sampleRate
        });
        
        // Limit to first 5 minutes to reduce file size
        const maxDuration = Math.min(audioBuffer.duration, 300); // 5 minutes
        const sampleRate = audioBuffer.sampleRate;
        const numChannels = audioBuffer.numberOfChannels;
        const numSamples = Math.floor(maxDuration * sampleRate);
        
        // Create WAV file (simple format, widely supported)
        const wavBuffer = audioBufferToWav(audioBuffer, numSamples);
        const compressedBlob = new Blob([wavBuffer], { type: 'audio/wav' });
        
        console.log('✅ Compression complete');
        console.log('Compressed size:', `${(compressedBlob.size / 1024 / 1024).toFixed(2)} MB`);
        console.log('Reduction:', `${((1 - compressedBlob.size / audioBlob.size) * 100).toFixed(1)}%`);
        
        audioContext.close();
        
        return compressedBlob;
        
    } catch (error) {
        console.error('❌ Compression failed:', error);
        console.warn('⚠️ Using original audio (uncompressed)');
        return audioBlob; // Return original if compression fails
    }
};

/**
 * Convert AudioBuffer to WAV format
 * @param {AudioBuffer} audioBuffer - Web Audio API AudioBuffer
 * @param {number} numSamples - Number of samples to include
 * @returns {ArrayBuffer} WAV file data
 */
function audioBufferToWav(audioBuffer, numSamples = null) {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = numSamples || audioBuffer.length;
    
    // Interleave channels
    const interleaved = new Float32Array(length * numChannels);
    
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            interleaved[i * numChannels + channel] = channelData[i];
        }
    }
    
    // Convert to 16-bit PCM
    const pcmData = new Int16Array(interleaved.length);
    for (let i = 0; i < interleaved.length; i++) {
        const s = Math.max(-1, Math.min(1, interleaved[i]));
        pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    // Create WAV header
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    
    const byteRate = sampleRate * numChannels * 2;
    const blockAlign = numChannels * 2;
    const dataSize = pcmData.length * 2;
    
    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // File length
    view.setUint32(4, 36 + dataSize, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // Format chunk identifier
    writeString(view, 12, 'fmt ');
    // Format chunk length
    view.setUint32(16, 16, true);
    // Sample format (1 = PCM)
    view.setUint16(20, 1, true);
    // Channel count
    view.setUint16(22, numChannels, true);
    // Sample rate
    view.setUint32(24, sampleRate, true);
    // Byte rate
    view.setUint32(28, byteRate, true);
    // Block align
    view.setUint16(32, blockAlign, true);
    // Bits per sample
    view.setUint16(34, 16, true);
    // Data chunk identifier
    writeString(view, 36, 'data');
    // Data chunk length
    view.setUint32(40, dataSize, true);
    
    // Combine header and PCM data
    const wavBuffer = new ArrayBuffer(header.byteLength + pcmData.byteLength);
    new Uint8Array(wavBuffer).set(new Uint8Array(header), 0);
    new Uint8Array(wavBuffer).set(new Uint8Array(pcmData.buffer), header.byteLength);
    
    return wavBuffer;
}

/**
 * Write string to DataView
 */
function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

/**
 * Upload audio file to backend for analysis
 * @param {Blob} audioBlob - Audio file to upload
 * @param {string} songName - Name of the song
 * @param {function} onProgress - Progress callback
 * @returns {Promise<Object>} Analysis result from backend
 */
export const uploadAudioForAnalysis = async (audioBlob, songName, onProgress = null) => {
    try {
        console.log('📤 Uploading audio to backend:', {
            size: `${(audioBlob.size / 1024 / 1024).toFixed(2)} MB`,
            songName
        });
        
        // Create FormData
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.wav');
        formData.append('song_name', songName);
        
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://chordypi.onrender.com/api';
        
        // Upload with progress tracking
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const percent = (e.loaded / e.total) * 100;
                    onProgress(percent);
                    console.log(`📤 Upload progress: ${percent.toFixed(1)}%`);
                }
            });
            
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    console.log('✅ Analysis complete:', response);
                    resolve(response);
                } else {
                    const error = JSON.parse(xhr.responseText);
                    console.error('❌ Analysis failed:', error);
                    reject(new Error(error.error || 'Analysis failed'));
                }
            });
            
            xhr.addEventListener('error', () => {
                console.error('❌ Upload error');
                reject(new Error('Network error during upload'));
            });
            
            xhr.addEventListener('timeout', () => {
                console.error('❌ Upload timeout');
                reject(new Error('Upload timed out (file too large or slow connection)'));
            });
            
            xhr.open('POST', `${API_BASE_URL}/analyze-audio-upload`);
            xhr.timeout = 120000; // 2 minute timeout
            xhr.send(formData);
        });
        
    } catch (error) {
        console.error('❌ Upload failed:', error);
        throw error;
    }
};

/**
 * Complete audio extraction and analysis pipeline
 * @param {string} videoUrl - YouTube video URL
 * @param {string} songName - Name of the song
 * @param {function} onProgress - Progress callback with steps
 * @returns {Promise<Object>} Chord analysis result
 */
export const extractAndAnalyze = async (videoUrl, songName, onProgress = null) => {
    try {
        const updateProgress = (step, percent) => {
            if (onProgress) {
                onProgress({ step, percent });
            }
        };
        
        // Step 1: Extract audio (0-40%)
        updateProgress('Downloading audio from YouTube...', 0);
        const { blob, title, duration } = await extractYouTubeAudio(
            videoUrl,
            (percent) => updateProgress('Downloading audio...', percent * 0.4)
        );
        
        // Step 2: Compress audio (40-50%)
        updateProgress('Compressing audio...', 40);
        const compressedBlob = await compressAudio(blob);
        updateProgress('Compression complete', 50);
        
        // Step 3: Upload and analyze (50-100%)
        updateProgress('Uploading to backend...', 50);
        const result = await uploadAudioForAnalysis(
            compressedBlob,
            songName || title,
            (percent) => updateProgress('Analyzing chords...', 50 + percent * 0.5)
        );
        
        updateProgress('Analysis complete!', 100);
        
        return {
            ...result,
            originalDuration: duration
        };
        
    } catch (error) {
        console.error('❌ Extract and analyze failed:', error);
        throw error;
    }
};
