import Link from 'next/link';

import { Info, Lightbulb, MoveRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/ui/tooltip';

import { useUserQuotasQuery } from '@/hooks/useBilling';

import { RecordingTips } from '../RecordingTips';
import { useReplicaStore } from '../../hooks';

export const Intro = () => {
  const setActiveStep = useReplicaStore(state => state.setActiveStep);
  const completeStep = useReplicaStore(state => state.completeStep);
  const { data: quotas, isError } = useUserQuotasQuery();

  const handleStart = () => {
    completeStep('intro');
    setActiveStep('consent');
  };

  const isOutOfReplicaQuotas = isError
    ? false
    : !(quotas ? quotas.replica?.isAllowed : true);

  const noQuotasTooltipContent = (
    <p>
      {"You don't have enough quotas. Please "}
      <Button asChild variant="link" className="p-0">
        <Link href="/billing">upgrade your plan</Link>
      </Button>{' '}
      to continue.
    </p>
  );

  return (
    <>
      <div className="relative flex flex-col items-center rounded-md bg-secondary-foreground px-13 pb-8 pt-11">
        <img
          src="/images/introBG.png"
          className="absolute inset-0 -z-0 size-full dark:hidden"
          alt="Intro Background"
        />
        <img
          src="/images/introBGDark.png"
          className="absolute inset-0 -z-0 hidden size-full dark:block"
          alt="Intro Background"
        />
        <h2 className="relative text-center text-2xl font-semibold">
          Follow these steps to create your replica
        </h2>

        <div className="mt-16 grid w-full max-w-screen-md grid-cols-[1fr_minmax(0.25rem,_3.25rem)_1fr_minmax(0.25rem,_3.25rem)_1fr] justify-between gap-2">
          <div className="relative flex aspect-[1.27] items-center justify-center rounded-lg border bg-background shadow-md">
            <div className="absolute -top-4 rounded-md border border-border bg-white/20 px-2 text-center backdrop-blur-sm">
              <span className="text-xs font-semibold xl:text-sm">
                Consent Video
              </span>
            </div>
            <img src="/images/fileCheck.svg" alt="Consent Video" />
          </div>
          {/* // TODO: maybe improve */}
          <div className="relative flex items-center justify-center">
            <MoveRight className="size-5 text-muted-foreground" />
          </div>
          <div className="relative flex aspect-[1.27] items-center justify-center rounded-lg border bg-background shadow-md">
            <div className="absolute -top-4 rounded-md border border-border bg-white/20 px-2 text-center backdrop-blur-sm">
              <span className="text-xs font-semibold xl:text-sm">
                Training Video
              </span>
            </div>
            <img src="/images/webcam.svg" alt="Training Video" />
          </div>
          {/* // TODO: maybe improve */}
          <div className="relative flex items-center justify-center">
            <MoveRight className="size-5 text-muted-foreground" />
          </div>

          <div className="relative flex aspect-[1.27] items-center justify-center rounded-lg border bg-background shadow-md">
            <div className="absolute -top-4 rounded-md border border-border bg-white/20 px-2 text-center backdrop-blur-sm">
              <span className="text-xs font-semibold xl:text-sm">
                Your Replica
              </span>
            </div>
            <img
              src="/images/replicaCircle.svg"
              alt="Replica Ready"
              className="dark:hidden"
            />
            <img
              src="/images/replicaCircleDark.svg"
              alt="Replica Ready"
              className="hidden dark:block"
            />
          </div>
        </div>

        <div className="relative mt-19 flex items-center gap-2 rounded-md border bg-background px-4 py-2">
          <span>
            <Info className="size-5 text-primary" />
          </span>
          <p className="text-sm text-foreground">
            The Phoenix model takes about 3-4 hours to train. During this time,
            it learns your voice, appearance, and movements.
          </p>
        </div>
      </div>

      <div className="mb-6 mt-auto flex justify-center gap-2">
        <RecordingTips>
          <Button variant="outline" className="relative">
            <span className="absolute -left-1 -top-1 flex size-2 items-center justify-center">
              <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
            </span>
            <span>
              <Lightbulb className="size-5" />
            </span>
            Recording Tips
          </Button>
        </RecordingTips>
        <SimpleTooltip
          disabled={!isOutOfReplicaQuotas}
          tooltipContent={noQuotasTooltipContent}
        >
          <div>
            <Button disabled={isOutOfReplicaQuotas} onClick={handleStart}>
              Get Started
            </Button>
          </div>
        </SimpleTooltip>
      </div>
    </>
  );
};
