'use client';

import { useMemo } from 'react';

import { ApiCode } from '@/components/Code';
import { URLS } from '@/components/CopyApiUrl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ConsentMethod, useReplicaStore, VideoMethod } from '../../hooks';

import { HttpMethods } from '@/types';

export const CodeDialog: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [consentMethod, consentURL, trainingMethod, trainingURL] =
    useReplicaStore(state => [
      state.consentMethod,
      state.consentURL,
      state.trainingMethod,
      state.trainingURL,
    ]);

  const body = useMemo(() => {
    const initial: {
      replica_name: string;
      consent_video_url?: string;
      train_video_url: string;
      model_name: string;
    } = {
      replica_name: '',
      consent_video_url: '<file url>',
      train_video_url: '<file url>',
      model_name: 'phoenix-2',
    };

    if (consentMethod === ConsentMethod.UPLOAD && consentURL) {
      initial.consent_video_url = consentURL;
    } else if (consentMethod === ConsentMethod.SKIP) {
      delete initial.consent_video_url;
    }

    if (trainingMethod === VideoMethod.UPLOAD && trainingURL) {
      initial.train_video_url = trainingURL;
    }

    return initial;
  }, [consentMethod, consentURL, trainingMethod, trainingURL]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Code</DialogTitle>
          <DialogDescription>
            You can use the following code to start integrating your current
            settings into your application.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full">
          <ApiCode
            url={URLS.replica}
            method={HttpMethods.POST}
            body={body}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
