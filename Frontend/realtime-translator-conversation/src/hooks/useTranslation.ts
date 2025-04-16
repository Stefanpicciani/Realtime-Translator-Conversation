import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import signalRService from '../services/signalr.service';
import translationService from '../services/translation.service';
import { AudioChunk, TranslationResult } from '../types/translation.types';

interface UseTranslationOptions {
  sourceLanguage: string;
  targetLanguage: string;
  autoPlay?: boolean;
}

export const useTranslation = (options: UseTranslationOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [results, setResults] = useState<TranslationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Connect to SignalR hub
  const connect = useCallback(async () => {
    try {
      await signalRService.initialize();
      
      // Generate a unique session ID if not provided
      const newSessionId = sessionId || uuidv4();
      setSessionId(newSessionId);
      
      await signalRService.joinSession(newSessionId);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect to translation service');
      setIsConnected(false);
    }
  }, [sessionId]);

  // Disconnect from SignalR hub
  const disconnect = useCallback(async () => {
    try {
      await signalRService.disconnect();
      setIsConnected(false);
    } catch (err) {
      console.error('Disconnect error:', err);
      setError('Failed to disconnect from translation service');
    }
  }, []);

  // Process audio chunk for translation
  const processAudioChunk = useCallback(async (chunk: AudioChunk) => {
    if (!isConnected) {
      setError('Not connected to translation service');
      return;
    }

    setIsProcessing(true);

    try {
      await signalRService.sendAudioChunk(
        chunk.buffer,
        options.sourceLanguage,
        options.targetLanguage
      );
    } catch (err) {
      console.error('Error processing audio chunk:', err);
      setError('Failed to process audio chunk');
    } finally {
      setIsProcessing(false);
    }
  }, [isConnected, options.sourceLanguage, options.targetLanguage]);

  // Text-only translation without audio
  const translateText = useCallback(async (text: string): Promise<TranslationResult> => {
    try {
      const response = await translationService.translateText(
        text,
        options.sourceLanguage,
        options.targetLanguage
      );

      const result: TranslationResult = {
        originalText: response.originalText,
        translatedText: response.translatedText
      };

      // Add to results
      setResults(prev => [...prev, result]);
      return result;
    } catch (err) {
      console.error('Text translation error:', err);
      setError('Failed to translate text');
      throw err;
    }
  }, [options.sourceLanguage, options.targetLanguage]);

  // Handle incoming translation results
  const handleTranslationResult = useCallback((result: TranslationResult) => {
    setResults(prev => [...prev, result]);

    // Auto-play the translated audio if enabled
    if (options.autoPlay && result.translatedAudio) {
      translationService.playAudioFromBase64(result.translatedAudio);
    }
  }, [options.autoPlay]);

  // Clear results
  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  // Set up event handlers on component mount
  useEffect(() => {
    signalRService.onTranslation(handleTranslationResult);
    signalRService.onError(setError);

    return () => {
      // Clean up by setting callbacks to null
      signalRService.onTranslation(() => {});
      signalRService.onError(() => {});
    };
  }, [handleTranslationResult]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    sessionId,
    results,
    error,
    isProcessing,
    connect,
    disconnect,
    processAudioChunk,
    translateText,
    clearResults
  };
};

export default useTranslation;