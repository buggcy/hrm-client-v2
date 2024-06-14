import { useEffect, useState } from 'react';

import { usePersistentState } from '@/hooks';
import { getUserDevices } from '@/utils';

const getMicrophones = async () => {
  const devices = await getUserDevices();
  const acc = {} as Record<MediaDeviceInfo['groupId'], MediaDeviceInfo>;

  for (const device of devices) {
    if (device.kind === 'audioinput') {
      acc[device.groupId] = device;
    }
  }

  return Object.values(acc);
};

export const useMicrophones = () => {
  const [isRequestingPermission, setIsRequestingPermission] = useState(true);
  const [selectedMicrophone, setSelectedMicrophone] =
    usePersistentState<MediaDeviceInfo>('selectedMicrophone');
  const [microphones, setMicrophones] = usePersistentState<MediaDeviceInfo[]>(
    'microphones',
    [],
  );

  useEffect(() => {
    let stream: MediaStream;

    const updateMicrophones = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const audioDevices = await getMicrophones();

        setMicrophones(audioDevices);
        if (audioDevices.length > 0) {
          setSelectedMicrophone(
            prev =>
              audioDevices.find(d => d.label === prev?.label) ||
              audioDevices[0],
          );
        }

        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        setMicrophones([]);
        setSelectedMicrophone(undefined!);
      } finally {
        setIsRequestingPermission(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    updateMicrophones();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    navigator.mediaDevices.addEventListener('devicechange', updateMicrophones);

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        updateMicrophones,
      );
      stream?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isRequestingPermission,
    microphones,
    selectedMicrophone,
    setSelectedMicrophone,
  };
};
