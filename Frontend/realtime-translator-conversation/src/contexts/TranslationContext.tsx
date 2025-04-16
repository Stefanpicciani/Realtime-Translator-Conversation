import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AudioChunk, LanguageOption, LanguageOptions, TranslationResult } from '../types/translation.types';
import useAudio from '../hooks/useAudio';
import useTranslation from '../hooks/useTranslation';

interface TranslationContextProps {
  // Language settings
  sourceLanguage: LanguageOption;
  targetLanguage: LanguageOption;
  setSourceLanguage: (language: LanguageOption) => void;
  setTargetLanguage: (language: LanguageOption) => void;
  swapLanguages: () => void;
  
  // Audio recording
  isRecording: boolean;
  audioLevel: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  
  // Translation
  isConnected: boolean;
  isProcessing: boolean;
  results: TranslationResult[];
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  translateText: (text: string) => Promise<TranslationResult>;
  clearResults: () => void;
  
  // General settings
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  continuousMode: boolean;
  setContinuousMode: (continuousMode: boolean) => void;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language settings
  const [sourceLanguage, setSourceLanguage] = useState<LanguageOption>(LanguageOptions[0]); // Portuguese
  const [targetLanguage, setTargetLanguage] = useState<LanguageOption>(LanguageOptions[1]); // English
  
  // General settings
  const [autoPlay, setAutoPlay] = useState(true);
  const [continuousMode, setContinuousMode] = useState(false);
  
  // Audio hook
  const { 
    isRecording, 
    audioLevel, 
    startRecording: startAudioRecording, 
    stopRecording: stopAudioRecording,
    error: audioError
  } = useAudio({
    timeSlice: 1000, // Send audio every second
    stopAfterSilence: continuousMode ? 0 : 2000, // Auto-stop after 2 seconds of silence (if not in continuous mode)
    onDataAvailable: handleAudioData
  });
  
  // Translation hook
  const {
    isConnected,
    isProcessing,
    results,
    error: translationError,
    connect,
    disconnect,
    processAudioChunk,
    translateText,
    clearResults
  } = useTranslation({
    sourceLanguage: sourceLanguage.code,
    targetLanguage: targetLanguage.code,
    autoPlay
  });
  
  // Combined error state
  const error = audioError || translationError;
  
  // Function to handle audio data from recorder
  function handleAudioData(chunk: AudioChunk) {
    if (isConnected) {
      processAudioChunk(chunk);
    }
  }
  
  // Function to start recording
  const startRecording = async () => {
    if (!isConnected) {
      await connect();
    }
    await startAudioRecording();
  };
  
  // Function to stop recording
  const stopRecording = async () => {
    await stopAudioRecording();
  };
  
  // Function to swap languages
  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudioRecording();
      disconnect();
    };
  }, []);
  
  const contextValue: TranslationContextProps = {
    // Language settings
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    swapLanguages,
    
    // Audio recording
    isRecording,
    audioLevel,
    startRecording,
    stopRecording,
    
    // Translation
    isConnected,
    isProcessing,
    results,
    error,
    connect,
    disconnect,
    translateText,
    clearResults,
    
    // General settings
    autoPlay,
    setAutoPlay,
    continuousMode,
    setContinuousMode
  };
  
  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use the translation context
export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  
  return context;
};

export default TranslationContext;