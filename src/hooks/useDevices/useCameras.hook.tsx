import { useEffect, useState } from 'react';

import { usePersistentState } from '@/hooks';
import { getUserDevices } from '@/utils';

const getCameras = async () => {
  const devices = await getUserDevices();
  const acc = {} as Record<MediaDeviceInfo['groupId'], MediaDeviceInfo>;

  for (const device of devices) {
    if (device.kind === 'videoinput') {
      acc[device.groupId] = device;
    }
  }

  return Object.values(acc);
};

export const useCameras = () => {
  const [isRequestingPermission, setIsRequestingPermission] = useState(true);
  const [selectedCamera, setSelectedCamera] =
    usePersistentState<MediaDeviceInfo>('selectedCameras');
  const [cameras, setCameras] = usePersistentState<MediaDeviceInfo[]>(
    'cameras',
    [],
  );

  useEffect(() => {
    let stream: MediaStream;

    const updateCameras = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        const videoDevices = await getCameras();

        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(
            prev =>
              videoDevices.find(d => d.label === prev?.label) ||
              videoDevices[0],
          );
        }

        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        setCameras([]);
        setSelectedCamera(undefined!);
      } finally {
        setIsRequestingPermission(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    updateCameras();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    navigator.mediaDevices.addEventListener('devicechange', updateCameras);

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        updateCameras,
      );
      stream?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isRequestingPermission,
    cameras,
    selectedCamera,
    setSelectedCamera,
  };
};
