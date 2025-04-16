import apiService from './api.service';
import { 
  TextTranslationRequest, 
  TextTranslationResponse, 
  SpeechRecognitionResponse,
  TextToSpeechRequest,
  VoiceInfo
} from '../types/translation.types';

class TranslationService {
  // Translate text from one language to another
  public async translateText(
    text: string,
    fromLanguage: string,
    toLanguage: string
  ): Promise<TextTranslationResponse> {
    const request: TextTranslationRequest = {
      text,
      fromLanguage,
      toLanguage
    };

    return apiService.post<TextTranslationResponse>('/translation/text', request);
  }

  // Convert speech to text
  public async speechToText(
    audioBlob: Blob,
    language: string
  ): Promise<SpeechRecognitionResponse> {
    return apiService.postBinary<SpeechRecognitionResponse>(
      '/translation/speech-to-text',
      audioBlob,
      language
    );
  }

  // Convert text to speech
  public async textToSpeech(
    text: string,
    language: string,
    voiceName?: string
  ): Promise<Blob> {
    const request: TextToSpeechRequest = {
      text,
      language,
      voiceName
    };

    return apiService.getAudioBlob('/translation/text-to-speech', request);
  }

  // Get available voices
  public async getAvailableVoices(): Promise<VoiceInfo[]> {
    return apiService.get<VoiceInfo[]>('/translation/voices');
  }

  // Helper method to play audio from blob
  public playAudio(audioBlob: Blob): void {
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    
    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
    
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  }

  // Helper method to play audio from base64 string
  public playAudioFromBase64(base64Audio: string): void {
    const byteCharacters = atob(base64Audio);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/wav' });
    
    this.playAudio(blob);
  }
}

// Export as singleton
export default new TranslationService();