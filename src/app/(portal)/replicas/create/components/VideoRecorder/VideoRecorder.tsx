import React, { useCallback } from 'react';

import { toast } from '@/components/ui/use-toast';

import { ConsentScript } from '../ConsentScript';
import { VideoPreview } from '../VideoPreview';
import { VideoRecord } from '../VideoRecord';
import { useReplicaStore } from '../../hooks';

const VideoRecorderComponent = () => {
  const set = useReplicaStore(state => state.set);

  const onStopRecording = useCallback(
    (blob: Blob) => {
      if (blob.size === 0) {
        toast({
          title: 'Video Save Error',
          description:
            'It looks like your browser is having trouble saving the recorded video, please try upload file directly',
          variant: 'error',
          duration: 5000,
        });
        return;
      }

      const ext = blob.type.split('/')[1];
      const data: Parameters<typeof set>[0] = {
        consentRecordFile: new File([blob], `${Date.now()}consent.${ext}`, {
          type: blob.type,
        }),
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
  const consentRecordFile = useReplicaStore(state => state.consentRecordFile);
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

  const handleDownload = () => {
    if (!consentRecordFile) return;
    const url = URL.createObjectURL(consentRecordFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = consentRecordFile.name;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <>
      {consentRecordFile ? (
        <VideoPreview
          file={consentRecordFile}
          onDelete={handleDelete}
          checkTitle="Confirm these consent video requirements"
          onConfirm={handleConfirm}
          onDownload={handleDownload}
        />
      ) : (
        <VideoRecorderComponent />
      )}
    </>
  );
};
