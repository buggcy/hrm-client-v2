export const getUserDevices = async () =>
  (await navigator.mediaDevices.enumerateDevices()).map(
    device => device.toJSON() as MediaDeviceInfo,
  );

const KB = 1024;
const MEMORY_SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function formatBytes(bytes: number, decimals = 2) {
  if (!bytes) return '0 Bytes';

  const dm = decimals < 0 ? 0 : decimals;
  const i = Math.floor(Math.log(bytes) / Math.log(KB));

  return (
    parseFloat((bytes / Math.pow(KB, i)).toFixed(dm)) + ' ' + MEMORY_SIZES[i]
  );
}

export const getVideoDuration = (file: File | string): Promise<number> =>
  new Promise((resolve, reject) => {
    if (!document) reject(new Error('Server-side rendering is not supported'));

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      if (video.duration && video.duration !== Infinity)
        resolve(video.duration);
      else reject(new Error('Invalid video duration'));

      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
      URL.revokeObjectURL(video.src);
    };
    video.src = typeof file === 'string' ? file : URL.createObjectURL(file);
  });

export const formatTime = (duration: number) => {
  if (!duration) return '0:00';

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};
