import * as signalR from "@microsoft/signalr";
import { TranslationResult } from "../types/translation.types";

// const HUB_URL = process.env.REACT_APP_SIGNALR_URL || 'https://localhost:7071/hubs/translation';
const HUB_URL ='https://localhost:7071/hubs/translation';

type TranslationCallback = (result: TranslationResult) => void;
type ErrorCallback = (error: string) => void;

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private sessionId: string = '';
  private translationCallback: TranslationCallback | null = null;
  private errorCallback: ErrorCallback | null = null;

  // Initialize the SignalR connection
  public async initialize(): Promise<void> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL)
        .withAutomaticReconnect()
        .build();

      // Register handlers
      this.connection.on('ReceiveTranslation', (result: TranslationResult) => {
        if (this.translationCallback) {
          this.translationCallback(result);
        }
      });

      this.connection.on('TranslationError', (error: string) => {
        if (this.errorCallback) {
          this.errorCallback(error);
        }
      });

      // Start the connection
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  // Join a translation session
  public async joinSession(sessionId: string): Promise<void> {
    if (!this.connection) {
      throw new Error('SignalR not initialized');
    }

    try {
      this.sessionId = sessionId;
      await this.connection.invoke('JoinSession', sessionId);
      console.log(`Joined session: ${sessionId}`);
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  }

  // Leave the current session
  public async leaveSession(): Promise<void> {
    if (!this.connection || !this.sessionId) {
      return;
    }

    try {
      await this.connection.invoke('LeaveSession', this.sessionId);
      console.log(`Left session: ${this.sessionId}`);
      this.sessionId = '';
    } catch (error) {
      console.error('Error leaving session:', error);
      throw error;
    }
  }

  // Send audio chunk for processing
  public async sendAudioChunk(
    audioChunk: ArrayBuffer,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<void> {
    if (!this.connection || !this.sessionId) {
      throw new Error('Not connected to a session');
    }

    try {
      await this.connection.invoke(
        'SendAudioChunk',
        new Uint8Array(audioChunk),
        this.sessionId,
        sourceLanguage,
        targetLanguage
      );
    } catch (error) {
      console.error('Error sending audio chunk:', error);
      throw error;
    }
  }

  // Register callback for receiving translations
  public onTranslation(callback: TranslationCallback): void {
    this.translationCallback = callback;
  }

  // Register callback for errors
  public onError(callback: ErrorCallback): void {
    this.errorCallback = callback;
  }

  // Disconnect
  public async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        if (this.sessionId) {
          await this.leaveSession();
        }
        await this.connection.stop();
        this.connection = null;
        console.log('SignalR Disconnected');
      } catch (error) {
        console.error('Error disconnecting:', error);
        throw error;
      }
    }
  }
}

export const signalRService = new SignalRService();
export default signalRService;