import { useState } from 'react';

import { AxiosProgressEvent } from 'axios';

export const useProgress = () => {
  const [progress, setProgress] = useState(0);

  return {
    progress,
    onUploadProgress: (ev: AxiosProgressEvent) =>
      setProgress(Math.round((ev.loaded * 100) / (ev.total ?? 100))),
    reset: () => setProgress(0),
  };
};
