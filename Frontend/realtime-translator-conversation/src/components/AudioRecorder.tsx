import React from 'react';
import { useTranslationContext } from '../contexts/TranslationContext';
import './AudioRecorder.css';

const AudioRecorder: React.FC = () => {
  const { 
    isRecording, 
    audioLevel,
    startRecording,
    stopRecording,
    continuousMode,
    setContinuousMode,
    isConnected
  } = useTranslationContext();

  const handleRecordingToggle = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  // Convert audio level (0-100) to a visual representation
  const getAudioLevelBars = () => {
    const totalBars = 10;
    const activeBars = Math.round((audioLevel / 100) * totalBars);
    
    return Array(totalBars).fill(0).map((_, index) => (
      <div 
        key={index}
        className={`audio-level-bar ${index < activeBars ? 'active' : ''}`}
        style={{ height: `${20 + (index * 5)}px` }}
      />
    ));
  };

  return (
    <div className="audio-recorder">
      <div className="recorder-controls">
        <button 
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={handleRecordingToggle}
          disabled={!isConnected}
        >
          {isRecording ? 'Parar' : 'Iniciar Gravação'}
        </button>
        
        <div className="audio-level-indicator">
          {getAudioLevelBars()}
        </div>
      </div>
      
      <div className="recorder-options">
        <label className="continuous-mode-toggle">
          <input 
            type="checkbox"
            checked={continuousMode}
            onChange={(e) => setContinuousMode(e.target.checked)}
            disabled={isRecording}
          />
          <span>Modo contínuo</span>
        </label>
        
        <div className="recording-status">
          {isRecording ? (
            <span className="recording-indicator">Gravando...</span>
          ) : (
            <span className="ready-indicator">Pronto para gravar</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;