import React, { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ScriptBlock } from '../ScriptBlock';
import { VideoPreview } from '../VideoPreview';
import { VideoRecord } from '../VideoRecord';
import { useReplicaStore } from '../../hooks';

const VideoRecorderComponent = () => {
  const set = useReplicaStore(state => state.set);

  const onStopRecording = useCallback(
    (blob: Blob) => {
      const data: Parameters<typeof set>[0] = {
        trainingRecordFile: {
          file: new File([blob], `${Date.now()}training.webm`, {
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
      <ScriptBlock />
      <VideoRecord minimumRecordTime={60} onSubmit={onStopRecording} />
    </div>
  );
};

export const VideoRecorderTraining = ({
  onSubmit,
}: {
  onSubmit: () => Promise<void>;
}) => {
  const [open, setOpen] = React.useState(false);
  const trainingRecordFile = useReplicaStore(
    state => state.trainingRecordFile?.url,
  );
  const set = useReplicaStore(state => state.set);
  const completeStep = useReplicaStore(state => state.completeStep);

  const handleDelete = () => {
    set({ trainingRecordFile: null });
  };

  const handleSubmit = () => {
    setOpen(false);
    completeStep('training');
    void onSubmit();
  };

  const handleConfirm = () => {
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Ready to Submit Your Replica?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Please review your video before submitting. Once submitted, you
              won’t be able to make any changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {trainingRecordFile ? (
        <VideoPreview
          url={trainingRecordFile}
          onDelete={handleDelete}
          checkTitle="Confirm these Training video requirements"
          onConfirm={handleConfirm}
        />
      ) : (
        <VideoRecorderComponent />
      )}
    </>
  );
};
