import React, { useState } from 'react';
import styled from 'styled-components';

const UploaderContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  text-align: center;
`;

const UploadLabel = styled.label`
  display: inline-block;
  padding: 12px 30px;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileInfo = styled.div`
  margin-top: 15px;
  color: white;
  font-size: 14px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  margin-top: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  background: white;
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 14px;
`;

const SupportedFormats = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  margin-top: 10px;
`;

const FileUploader = ({ onUpload, onError }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a'];
    const validExtensions = ['.mp3', '.wav', '.m4a'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setError('Invalid file type. Please upload MP3, WAV, or M4A files.');
      setSelectedFile(null);
      if (onError) onError('Invalid file type');
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 50MB.');
      setSelectedFile(null);
      if (onError) onError('File too large');
      return;
    }

    setError(null);
    setSelectedFile(file);
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      // Simulate progress (since we can't track actual upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(formData, file.name);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset after success
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setUploading(false);
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
      if (onError) onError(err.message);
    }
  };

  return (
    <UploaderContainer>
      <UploadLabel htmlFor="audio-upload">
        {uploading ? 'Uploading...' : '📁 Upload Audio File'}
      </UploadLabel>
      <HiddenInput
        id="audio-upload"
        type="file"
        accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/m4a"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      
      {selectedFile && (
        <FileInfo>
          📄 {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
        </FileInfo>
      )}
      
      {uploading && (
        <ProgressBar>
          <ProgressFill progress={uploadProgress} />
        </ProgressBar>
      )}
      
      {error && <ErrorText>⚠️ {error}</ErrorText>}
      
      <SupportedFormats>
        Supported: MP3, WAV, M4A • Max 50MB
      </SupportedFormats>
    </UploaderContainer>
  );
};

export default FileUploader;
