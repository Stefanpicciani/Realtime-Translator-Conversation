export interface TextTranslationRequest {
    text: string;
    fromLanguage: string;
    toLanguage: string;
  }
  
  export interface TextTranslationResponse {
    originalText: string;
    translatedText: string;
  }
  
  export interface SpeechRecognitionResponse {
    recognizedText: string;
  }
  
  export interface TextToSpeechRequest {
    text: string;
    language: string;
    voiceName?: string;
  }
  
  export interface VoiceInfo {
    language: string;
    voiceName: string;
    gender: string;
  }
  
  export interface TranslationResult {
    originalText: string;
    translatedText: string;
    translatedAudio?: string; // Base64 encoded audio
  }
  
  export interface AudioChunk {
    blob: Blob;
    buffer: ArrayBuffer;
  }
  
  export interface LanguageOption {
    code: string;
    name: string;
    voiceNames: string[];
  }
  
  export const LanguageOptions: LanguageOption[] = [
    { 
      code: 'pt-BR', 
      name: 'Português (Brasil)', 
      voiceNames: ['pt-BR-AntonioNeural', 'pt-BR-FranciscaNeural'] 
    },
    { 
      code: 'en-US', 
      name: 'English (United States)', 
      voiceNames: ['en-US-JennyNeural', 'en-US-GuyNeural'] 
    }
  ];