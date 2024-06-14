import { useEffect, useRef } from 'react';

import { create, StoreApi } from 'zustand';

interface IAudioRecordingStore {
  file: Blob | null;
  duration: number;
  isRecording: boolean;
  isCanceled: boolean;
  set: StoreApi<IAudioRecordingStore>['setState'];
  incrementDuration: () => void;
  reset: () => void;
}

const useAudioRecordingStore = create<IAudioRecordingStore>(set => ({
  file: null,
  duration: 0,
  isRecording: false,
  isCanceled: false,
  set,
  incrementDuration: () => set(({ duration }) => ({ duration: duration + 1 })),
  reset: () =>
    set({ file: null, duration: 0, isRecording: false, isCanceled: false }),
}));

const AUDIO_TYPES = [
  'audio/webm',
  'audio/ogg',
  'audio/mp4',
  'audio/mp3',
  'audio/wav',
  'audio/aac',
] as const;

const getSupportedAudioTypeAndExtension = () => {
  for (const type of AUDIO_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) return [type, type.split('/')[1]];
  }

  throw new Error('No supported audio type found');
};

export function useAudioRecorder(deviceId?: MediaDeviceInfo['deviceId']) {
  const mediaRecorder = useRef<MediaRecorder>();
  const timerInterval = useRef<NodeJS.Timeout>();
  const { file, duration, isRecording, set, incrementDuration, reset } =
    useAudioRecordingStore();

  const _startTimer = () => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    timerInterval.current = setInterval(incrementDuration, 1000);
  };

  const _stopTimer = () => {
    clearInterval(timerInterval.current);
  };

  const record = () => {
    return new Promise<{
      file: File;
      duration: number;
    } | null>((resolve, reject) => {
      if (isRecording) reject(new Error('Recording is in progress'));

      reset();
      _stopTimer();

      const mediaChunks: BlobPart[] = [];

      navigator.mediaDevices
        .getUserMedia({ audio: deviceId ? { deviceId } : true })
        .then(stream => {
          const [mimeType, extension] = getSupportedAudioTypeAndExtension();
          const recorder = new MediaRecorder(stream, {
            mimeType,
          });

          mediaRecorder.current = recorder;

          recorder.addEventListener('dataavailable', ({ data }) => {
            if (data.size) mediaChunks.push(data);
          });
          recorder.addEventListener('stop', () => {
            const { duration, isCanceled } = useAudioRecordingStore.getState();

            if (isCanceled) {
              resolve(null);
              reset();
            } else {
              const file = new File(mediaChunks, `recording.${extension}`, {
                type: mimeType,
              });

              set({ file, duration });
              resolve({ file, duration });
            }

            set({ isRecording: false });
          });

          set({ isRecording: true });
          recorder.start();
          _startTimer();
        })
        .catch(err => {
          reset();
          reject(err);
        });
    });
  };

  const stop = () => {
    _stopTimer();
    mediaRecorder.current?.stop();
    mediaRecorder.current?.stream.getTracks().forEach(track => track.stop());
    mediaRecorder.current = undefined;
  };

  const cancel = () => {
    set({ isCanceled: true });
    stop();
  };

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { file, record, duration, stop, isRecording, cancel };
}
