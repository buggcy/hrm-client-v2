import React, { useCallback } from 'react';

import { ConsentScript } from '../ConsentScript';
import { VideoPreview } from '../VideoPreview';
import { VideoRecord } from '../VideoRecord';
import { useReplicaStore } from '../../hooks';

const VideoRecorderComponent = () => {
  const set = useReplicaStore(state => state.set);

  const onStopRecording = useCallback(
    (blob: Blob) => {
      const ext = blob.type.split('/')[1];
      const data: Parameters<typeof set>[0] = {
        consentRecordFile: {
          file: new File([blob], `${Date.now()}consent.${ext}`, {
            type: blob.type,
          }),
          url: URL.createObjectURL(blob),
        },
      };
      set(data);
    },
    [set],
  );

  return (
    <div className="flex-1">
      <ConsentScript />
      <VideoRecord minimumRecordTime={5} onSubmit={onStopRecording} />
    </div>
  );
};

export const VideoRecorder = () => {
  const consentRecordURL = useReplicaStore(
    state => state.consentRecordFile?.url,
  );
  const set = useReplicaStore(state => state.set);
  const setActiveStep = useReplicaStore(state => state.setActiveStep);
  const completeStep = useReplicaStore(state => state.completeStep);

  const handleDelete = () => {
    set({ consentRecordFile: null });
  };

  const handleConfirm = () => {
    setActiveStep('training');
    completeStep('consent');
  };

  return (
    <>
      {consentRecordURL ? (
        <VideoPreview
          url={consentRecordURL}
          onDelete={handleDelete}
          checkTitle="Confirm these consent video requirements"
          onConfirm={handleConfirm}
        />
      ) : (
        <VideoRecorderComponent />
      )}
    </>
  );
};
