import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { create } from 'zustand';

import { useMicrophones } from '@/hooks';
import { useCameras } from '@/hooks/useDevices/useCameras.hook';

interface RecordingState {
  countdownValue: number | null;
  isCanceled: boolean;
  setCountdownValue: (value: number | null) => void;
  decrementCountdownTime: () => void;
  setCanceled: (isCanceled: boolean) => void;
  resetState: () => void;
}

const useRecordingStore = create<RecordingState>(set => ({
  countdownValue: null,
  isCanceled: false,
  setCountdownValue: value => set({ countdownValue: value }),
  decrementCountdownTime: () =>
    set(state => ({
      countdownValue: state.countdownValue ? state.countdownValue - 1 : null,
    })),
  setCanceled: isCanceled => set({ isCanceled }),
  resetState: () =>
    set({
      countdownValue: null,
      isCanceled: false,
    }),
}));

interface UseVideoPreviewAndRecordingProps {
  onStopRecording: (blob: Blob) => void;
}

interface UseVideoPreviewAndRecordingResult {
  hasVideoAccess: boolean;
  hasAudioAccess: boolean;
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
  selectedVideoDevice: MediaDeviceInfo;
  selectedAudioDevice: MediaDeviceInfo;
  selectVideoDevice: Dispatch<SetStateAction<MediaDeviceInfo>>;
  selectAudioDevice: Dispatch<SetStateAction<MediaDeviceInfo>>;
  stream: MediaStream | null;
  isRecording: boolean;
  countdownValue: number | null;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
}

export const useVideoPreviewAndRecording = ({
  onStopRecording,
}: UseVideoPreviewAndRecordingProps): UseVideoPreviewAndRecordingResult => {
  const {
    cameras: videoDevices,
    selectedCamera: selectedVideoDevice,
    setSelectedCamera: selectVideoDevice,
  } = useCameras();

  const {
    microphones: audioDevices,
    selectedMicrophone: selectedAudioDevice,
    setSelectedMicrophone: selectAudioDevice,
  } = useMicrophones();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const {
    countdownValue,
    setCountdownValue,
    decrementCountdownTime,
    setCanceled,
  } = useRecordingStore(state => ({
    countdownValue: state.countdownValue,
    setCanceled: state.setCanceled,
    setCountdownValue: state.setCountdownValue,
    decrementCountdownTime: state.decrementCountdownTime,
  }));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const countdownIntervalRef = useRef<number | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  // Function to set up video stream
  const setupVideoStream = useCallback(async (): Promise<void> => {
    if (selectedVideoDevice?.deviceId && selectedAudioDevice?.deviceId) {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedVideoDevice.deviceId },
          audio: { deviceId: selectedAudioDevice.deviceId },
        });
        setStream(newStream);
      } catch (error) {
        console.error('Error setting up video stream:', error);
      }
    }
  }, [selectedVideoDevice?.deviceId, selectedAudioDevice?.deviceId]);

  // Set up stream when permissions and devices are available
  useEffect(() => {
    void setupVideoStream();
  }, [setupVideoStream]);

  const startTimer = useCallback(() => {
    recordingIntervalRef.current = window.setInterval(() => {
      setRecordingTime(prev => {
        return prev + 1;
      });
    }, 1000);
  }, []);

  // Function to start actual recording after countdown
  const startActualRecording = useCallback((): void => {
    if (!stream) return;

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const { isCanceled } = useRecordingStore.getState();
      if (isCanceled) {
        return;
      }
      const recordedBlob = new Blob(recordedChunksRef.current, {
        type: 'video/webm',
      });
      onStopRecording(recordedBlob);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);
    startTimer();
  }, [stream, startTimer, onStopRecording]);

  useEffect(() => {
    if (countdownValue === 0) {
      startActualRecording();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setCountdownValue(null);
    }
  }, [countdownValue, setCountdownValue, startActualRecording]);

  // Function to start recording
  const startRecording = useCallback((): void => {
    if (!stream) return;
    setCanceled(false);
    setCountdownValue(3);
    countdownIntervalRef.current = window.setInterval(
      decrementCountdownTime,
      1000,
    );
  }, [decrementCountdownTime, setCanceled, setCountdownValue, stream]);

  // Function to stop recording
  const stopRecording = useCallback((): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  }, [isRecording]);

  // Function to cancel recording
  const cancelRecording = useCallback((): void => {
    setCanceled(true);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      setCountdownValue(null);
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      recordedChunksRef.current = [];
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
  }, [isRecording, setCanceled, setCountdownValue]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    };
  }, [stream]);

  return {
    hasVideoAccess: !!selectedVideoDevice,
    hasAudioAccess: !!selectedAudioDevice,
    videoDevices,
    audioDevices,
    selectedVideoDevice,
    selectedAudioDevice,
    selectVideoDevice,
    selectAudioDevice,
    stream,
    isRecording,
    countdownValue,
    recordingTime,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};
