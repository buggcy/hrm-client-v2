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
import { LogRocket } from '@/libs';

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

const quickScan = [
  { label: '4K UHD', width: 3840, height: 2160, ratio: '16:9' },
  { label: '4K DCI', width: 4096, height: 2160, ratio: '256:135' },
  { label: '4K UltraWide', width: 3840, height: 1600, ratio: '21:9' },
  { label: '4K UHD Portrait', height: 3840, width: 2160, ratio: '9:16' },
  { label: '1440p UltraWide', width: 3440, height: 1440, ratio: '21:9' },
  { label: '3K 3:2', width: 3000, height: 2000, ratio: '3:2' },
  { label: '1620p 3:2', width: 2880, height: 1920, ratio: '3:2' },
  { label: '1440p QHD', width: 2560, height: 1440, ratio: '16:9' },
  { label: '1080p UltraWide', width: 2560, height: 1080, ratio: '21:9' },
  { label: '1440p QHD Portrait', height: 2560, width: 1440, ratio: '9:16' },
  { label: '1:1 2K', width: 2048, height: 2048, ratio: '1:1' },
  { label: '2K DCI', width: 2048, height: 1080, ratio: '256:135' },
  { label: '1920x1440', width: 1920, height: 1440, ratio: '4:3' },
  { label: '1080p FHD', width: 1920, height: 1080, ratio: '16:9' },
  { label: '1080p FHD Portrait', height: 1920, width: 1080, ratio: '9:16' },
  { label: '1600x1200', width: 1600, height: 1200, ratio: '4:3' },
  { label: '1080p 3:2', width: 1620, height: 1080, ratio: '3:2' },
  { label: '1:1 1080', width: 1080, height: 1080, ratio: '1:1' },
  { label: '720p HD', width: 1280, height: 720, ratio: '16:9' },
  { label: '720p HD Portrait', height: 1280, width: 720, ratio: '9:16' },
  { label: '1024x768', width: 1024, height: 768, ratio: '4:3' },
  { label: '1:1 720', width: 720, height: 720, ratio: '1:1' },
  { label: '800x600', width: 800, height: 600, ratio: '4:3' },
];

const getSupportedVideoTypeAndExtension = (): [string, string] => {
  const videoTypes = ['video/webm', 'video/mp4', 'video/quicktime'] as const;
  for (const type of videoTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return [type, type.split('/')[1]];
    }
  }
  throw new Error('No supported video type found');
};

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
  const resolutionRef = useRef<{
    width: number;
    height: number;
    label: string;
    device: string;
  } | null>(null);

  const findBestResolution = useCallback(
    async (
      deviceId: string,
    ): Promise<{ width: number; height: number; label: string } | null> => {
      for (const resolution of quickScan) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: deviceId },
              width: { exact: resolution.width },
              height: { exact: resolution.height },
            },
          });
          stream.getTracks().forEach(track => track.stop());
          return {
            width: resolution.width,
            height: resolution.height,
            label: resolution.label,
          };
        } catch {
          continue;
        }
      }
      return null;
    },
    [],
  );

  const setupVideoStream = useCallback(async (): Promise<void> => {
    if (selectedVideoDevice?.deviceId && selectedAudioDevice?.deviceId) {
      try {
        const bestResolution = await findBestResolution(
          selectedVideoDevice.deviceId,
        );
        resolutionRef.current = bestResolution
          ? { ...bestResolution, device: selectedVideoDevice.label }
          : {
              label: 'Less than 720p',
              width: 0,
              height: 0,
              device: selectedVideoDevice.label,
            };
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedVideoDevice.deviceId,
            width: bestResolution
              ? { exact: bestResolution.width }
              : { ideal: 4096 },
            height: bestResolution
              ? { exact: bestResolution.height }
              : { ideal: 2160 },
            frameRate: { ideal: 25 },
          },
          audio: { deviceId: selectedAudioDevice.deviceId },
        });
        setStream(newStream);
      } catch (error) {
        console.error('Error setting up video stream:', error);
      }
    }
  }, [
    selectedVideoDevice.deviceId,
    selectedVideoDevice.label,
    selectedAudioDevice.deviceId,
    findBestResolution,
  ]);

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
    const [mimeType] = getSupportedVideoTypeAndExtension();
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: mimeType,
    });

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
        type: mimeType,
      });
      LogRocket.track('RECORDING_SUBMIT', {
        ...resolutionRef.current,
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
