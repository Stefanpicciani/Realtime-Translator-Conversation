import React, { useState } from 'react';
import { useTranslationContext } from '../contexts/TranslationContext';
import LanguageSelector from './LanguageSelector';
import AudioRecorder from './AudioRecorder';
import './TranslationPanel.css';

const TranslationPanel: React.FC = () => {
  const { 
    results, 
    isRecording, 
    isProcessing,
    isConnected,
    error,
    clearResults,
    translateText
  } = useTranslationContext();
  
  const [textInput, setTextInput] = useState('');
  
  const handleTextTranslate = async () => {
    if (textInput.trim()) {
      await translateText(textInput);
      setTextInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextTranslate();
    }
  };
  
  return (
    <div className="translation-panel">
      <div className="translation-header">
        <h2>Tradutor em Tempo Real</h2>
        <div className="language-selection">
          <LanguageSelector />
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <div className="translation-controls">
        <AudioRecorder />
        
        <div className="status-indicators">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </div>
          {isProcessing && <div className="status-indicator processing">Processando...</div>}
        </div>
      </div>
      
      <div className="translation-results">
        {results.length > 0 ? (
          <>
            <div className="results-header">
              <h3>Resultados da Tradução</h3>
              <button className="clear-button" onClick={clearResults}>Limpar</button>
            </div>
            <div className="results-list">
              {results.map((result, index) => (
                <div key={index} className="result-item">
                  <div className="original-text">
                    <strong>Original:</strong> {result.originalText}
                  </div>
                  <div className="translated-text">
                    <strong>Tradução:</strong> {result.translatedText}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <p>Nenhum resultado de tradução ainda. Comece a falar ou digite um texto abaixo.</p>
          </div>
        )}
      </div>
      
      <div className="text-input-container">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite um texto para traduzir..."
          disabled={isRecording}
        />
        <button 
          onClick={handleTextTranslate}
          disabled={!textInput.trim() || isRecording}
        >
          Traduzir
        </button>
      </div>
    </div>
  );
};

export default TranslationPanel;