import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useReplicaStore } from '../../hooks';

export const Skip = () => {
  const setActiveStep = useReplicaStore(state => state.setActiveStep);
  const completeStep = useReplicaStore(state => state.completeStep);

  const handleClick = () => {
    completeStep('consent');
    setActiveStep('training');
  };

  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-6">
      <span className="rounded-full bg-primary-foreground p-1.5">
        <Check className="size-5 text-primary" />
      </span>
      <p className="max-w-[50ch] text-center">
        Make sure to include a clear consent statement in your training video to
        avoid any issues with processing your replica.
      </p>
      <Button onClick={handleClick}>Continue</Button>
    </div>
  );
};
