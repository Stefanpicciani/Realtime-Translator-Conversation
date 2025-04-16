import { useState, useEffect, useRef, useCallback } from 'react';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import { AudioChunk } from '../types/translation.types';

interface UseAudioOptions {
  onDataAvailable?: (chunk: AudioChunk) => void;
  timeSlice?: number;
  stopAfterSilence?: number;
}

export const useAudio = (options: UseAudioOptions = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recorder = useRef<RecordRTC | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  // const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);

  const lastAudioTime = useRef<number>(Date.now());

  const timeSlice = options.timeSlice || 1000;
  const stopAfterSilence = options.stopAfterSilence || 0;

  // Function to check audio levels
  const checkAudioLevel = useCallback(() => {
    if (!analyser.current || !dataArray.current) return;
    
    analyser.current.getByteFrequencyData(dataArray.current);
    const values = dataArray.current;
    let sum = 0;
    
    for (let i = 0; i < values.length; i++) {
      sum += values[i];
    }
    
    const average = sum / values.length;
    const level = Math.min(100, Math.max(0, average)); // 0-100 scale
    setAudioLevel(level);
    
    // Check if audio is active
    if (level > 5) {
      lastAudioTime.current = Date.now();
    } else if (stopAfterSilence && Date.now() - lastAudioTime.current > stopAfterSilence) {
      // Stop recording after silence period
      stopRecording();
    }
    
    if (isRecording) {
      requestAnimationFrame(checkAudioLevel);
    }
  }, [isRecording, stopAfterSilence]);

  // Function to start recording
  const startRecording = useCallback(async () => {
    try {
      if (recorder.current) {
        await stopRecording();
      }

      // Request microphone access
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio processing
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream.current);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
      
      source.connect(analyser.current);
      dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
      
      // Setup recorder
      recorder.current = new RecordRTC(stream.current, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: StereoAudioRecorder,
        timeSlice,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        ondataavailable: (blob: Blob) => {
          if (options.onDataAvailable) {
            blob.arrayBuffer().then(buffer => {
              options.onDataAvailable?.({ blob, buffer });
            });
          }
        }
      });
      
      recorder.current.startRecording();
      setIsRecording(true);
      setError(null);
      
      // Start monitoring audio levels
      requestAnimationFrame(checkAudioLevel);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  }, [checkAudioLevel, options, timeSlice]);

  // Function to stop recording
  const stopRecording = useCallback(async () => {
    if (!recorder.current) return;
    
    return new Promise<void>((resolve) => {
      if (recorder.current) {
        recorder.current.stopRecording(() => {
          if (stream.current) {
            stream.current.getTracks().forEach(track => track.stop());
            stream.current = null;
          }
          
          if (audioContext.current) {
            audioContext.current.close();
            audioContext.current = null;
          }
          
          analyser.current = null;
          recorder.current = null;
          
          setIsRecording(false);
          setAudioLevel(0);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recorder.current) {
        recorder.current.stopRecording();
      }
      
      if (stream.current) {
        stream.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContext.current) {
        audioContext.current.close();
      }
      
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
    };
  }, []);

  return {
    isRecording,
    audioLevel,
    error,
    startRecording,
    stopRecording
  };
};

export default useAudio;