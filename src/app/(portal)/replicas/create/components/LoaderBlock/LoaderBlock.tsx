import { memo } from 'react';

import { Check, Loader } from 'lucide-react';

import { Progress } from '@/components/ui/progress';

const Uploaded = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4">
    <span>
      <Check className="size-5 text-primary" />
    </span>
    <p className="font-medium text-muted-foreground">{children}</p>
  </div>
);

const Uploader = ({
  children,
  progress,
}: {
  children: React.ReactNode;
  progress: number;
}) => (
  <div className="flex flex-col items-center justify-center gap-4">
    <p className="text-2xl font-semibold text-primary">{progress}%</p>
    <Progress variant="primary" value={progress} className="h-2 w-[18.75rem]" />
    <p className="font-medium">{children}</p>
  </div>
);

export const LoaderBlock = memo(
  ({
    isConsentLoading,
    consentProgress,
    isConsentSuccess,
    isTrainingLoading,
    trainingProgress,
    isTrainingSuccess,
    isSubmitLoading,
  }: {
    isConsentLoading: boolean;
    consentProgress: number;
    isConsentSuccess: boolean;
    isTrainingLoading: boolean;
    trainingProgress: number;
    isTrainingSuccess: boolean;
    isSubmitLoading: boolean;
  }) => {
    return (
      <div className="flex size-full flex-1 flex-col items-center justify-center gap-4">
        {isConsentLoading && (
          <Uploader progress={consentProgress}>
            Uploading consent video...
          </Uploader>
        )}
        {isConsentSuccess && <Uploaded>Consent Video Uploaded</Uploaded>}

        {isTrainingLoading && (
          <Uploader progress={trainingProgress}>
            Uploading training video...
          </Uploader>
        )}

        {isTrainingSuccess && <Uploaded>Training Video Uploaded</Uploaded>}

        {isSubmitLoading && (
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader className="size-6 animate-spin text-primary" />
            <p className="font-medium">Submitting...</p>
          </div>
        )}
      </div>
    );
  },
);

LoaderBlock.displayName = 'LoaderBlock';
