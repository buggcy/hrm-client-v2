'use client';
import Link from 'next/link';

import { Check, Leaf, Video } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SimpleTooltip } from '@/components/ui/tooltip';

import { useUserQuotasQuery } from '@/hooks/useBilling';
import { cn } from '@/utils';

import { State, useReplicaStore } from '../../hooks';

const ItemDot = ({
  active,
  completed,
  disabled,
  number,
}: {
  active: boolean;
  completed: boolean;
  disabled: boolean;
  number: number;
}) => {
  return (
    <div
      className={cn(
        'absolute -left-9 top-2/4 flex size-6 -translate-y-2/4 items-center justify-center rounded-full bg-accent',
        {
          'bg-primary': active,
          'bg-primary-foreground': completed,
          'bd-accent': disabled,
        },
      )}
    >
      <p
        className={cn('text-xs text-foreground', {
          'text-primary-foreground': active,
          'text-primary': completed,
          'text-muted-foreground': disabled,
        })}
      >
        {completed ? <Check className="size-4" /> : number}
      </p>
    </div>
  );
};

const Separator = () => (
  // eslint-disable-next-line prettier/prettier
  <div className="absolute -bottom-6.5 -left-6 top-12 w-0.5 -translate-x-2/4 bg-border" />
);

export const StepList = () => {
  const { data: quotas, isError } = useUserQuotasQuery();

  const activeStep = useReplicaStore(state => state.activeStep);
  const completedStep = useReplicaStore(state => state.completedSteps);
  const setActiveStep = useReplicaStore(state => state.setActiveStep);
  const completeStep = useReplicaStore(state => state.completeStep);

  const handleSelect = (value: State['activeStep']) => {
    if (value === 'consent' && !completedStep.intro) {
      completeStep('intro');
    }
    setActiveStep(value);
  };

  const isActiveIntro = activeStep === 'intro';
  const isActiveConsent = activeStep === 'consent';
  const isActiveTraining = activeStep === 'training';

  const isCompletedIntro = completedStep.intro;
  const isCompletedConsent = completedStep.consent;
  const isCompletedTraining = completedStep.training;

  const isDisabledTraining = !isCompletedConsent;

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
    <Card className="hidden rounded-md px-6 py-4 lg:flex xl:py-6">
      <div className="flex w-full flex-1">
        <Accordion
          // to collapse the accordion
          value={isCompletedTraining ? undefined : activeStep}
          onValueChange={handleSelect}
          type="single"
          className="w-full space-y-4 pl-6"
          disabled={isCompletedTraining}
        >
          <AccordionItem
            value="intro"
            className="relative rounded-md border data-[state=open]:bg-secondary-foreground"
          >
            <Separator />
            <AccordionTrigger hideIcon className="relative p-4">
              <ItemDot
                active={isActiveIntro}
                completed={isCompletedIntro}
                disabled={false}
                number={1}
              />
              Intro
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem
            value="consent"
            className="relative rounded-md border data-[state=open]:bg-secondary-foreground"
          >
            <Separator />
            <SimpleTooltip
              disabled={!isOutOfReplicaQuotas}
              tooltipContent={noQuotasTooltipContent}
            >
              <AccordionTrigger
                className="relative p-4"
                disabled={isOutOfReplicaQuotas}
              >
                <ItemDot
                  active={isActiveConsent}
                  completed={isCompletedConsent}
                  disabled={false}
                  number={2}
                />
                Consent Video
              </AccordionTrigger>
            </SimpleTooltip>
            <AccordionContent className="p-4 pt-0 text-muted-foreground">
              Record or upload your consent video by reading the provided
              script.
              {/* <div className="mt-4 flex gap-2">
                <span>
                  <Video className="size-4" />
                </span>
                <p>
                  Your consent video must be{' '}
                  <span className="font-semibold text-foreground">
                    at least 15 seconds
                  </span>
                  .
                </p>
              </div> */}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="training"
            disabled={isDisabledTraining}
            className="rounded-md border data-[state=open]:bg-secondary-foreground"
          >
            <AccordionTrigger
              className={cn('relative p-4', {
                'cursor-not-allowed text-popover-foreground/50 hover:no-underline':
                  isDisabledTraining,
              })}
            >
              <ItemDot
                active={isActiveTraining}
                completed={isCompletedTraining}
                disabled={isDisabledTraining}
                number={3}
              />
              Training Video
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0 text-muted-foreground">
              Record or upload your training video. You can read the default
              script or choose any topic.
              <div className="mt-4 flex gap-2">
                <span>
                  <Video className="size-4" />
                </span>
                <p>
                  Your training video must be at{' '}
                  <span className="font-semibold text-foreground">
                    least 1 min
                  </span>{' '}
                  and at most 2 minutes.
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <span>
                  <Leaf className="size-4" />
                </span>
                <p>Stay calm, be natural and focus on the camera.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};
