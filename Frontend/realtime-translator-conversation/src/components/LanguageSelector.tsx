import React from 'react';
import { useTranslationContext } from '../contexts/TranslationContext';
import { LanguageOptions } from '../types/translation.types';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { 
    sourceLanguage, 
    targetLanguage, 
    setSourceLanguage, 
    setTargetLanguage,
    swapLanguages,
    isRecording
  } = useTranslationContext();
  
  return (
    <div className="language-selector">
      <div className="language-selector-container">
        <label htmlFor="source-language">Idioma de origem:</label>
        <select 
          id="source-language" 
          value={sourceLanguage.code}
          onChange={(e) => {
            const selected = LanguageOptions.find(lang => lang.code === e.target.value);
            if (selected) setSourceLanguage(selected);
          }}
          disabled={isRecording}
        >
          {LanguageOptions.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      <button 
        className="swap-languages-button" 
        onClick={swapLanguages}
        disabled={isRecording}
        aria-label="Trocar idiomas"
      >
        ↔
      </button>
      
      <div className="language-selector-container">
        <label htmlFor="target-language">Idioma de destino:</label>
        <select 
          id="target-language" 
          value={targetLanguage.code}
          onChange={(e) => {
            const selected = LanguageOptions.find(lang => lang.code === e.target.value);
            if (selected) setTargetLanguage(selected);
          }}
          disabled={isRecording}
        >
          {LanguageOptions.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;