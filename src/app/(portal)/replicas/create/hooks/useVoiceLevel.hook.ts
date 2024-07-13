import { useCallback, useEffect, useRef, useState } from 'react';

interface UseVoiceLevelProps {
  stream: MediaStream | null;
}

interface UseVoiceLevelResult {
  voiceLevel: number;
}

export const useVoiceLevel = ({
  stream,
}: UseVoiceLevelProps): UseVoiceLevelResult => {
  const [voiceLevel, setVoiceLevel] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const createAudioContext = useCallback(() => {
    if (!stream) return;

    audioContextRef.current = new window.AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 1024;
    analyserRef.current.smoothingTimeConstant = 0.8;

    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
  }, [stream]);

  const calculateVoiceLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const sum = dataArray.reduce((acc, value) => acc + value, 0);
    const average = sum / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1);

    setVoiceLevel(normalizedLevel);

    animationFrameRef.current = requestAnimationFrame(calculateVoiceLevel);
  }, []);

  useEffect(() => {
    if (stream) {
      createAudioContext();
      calculateVoiceLevel();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, [stream, createAudioContext, calculateVoiceLevel]);

  return { voiceLevel };
};
