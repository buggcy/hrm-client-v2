import Link from 'next/link';

import { CheckIcon } from 'lucide-react';
import Confetti from 'react-confetti';

import { CopyRequestID } from '@/components/CopyRequestID';
import { toggleIntercom } from '@/components/Intercom';
import { Button } from '@/components/ui/button';

import { CodeDialog } from '../CodeDialog';

import { IReplica } from '@/types';

export const ReplicaCreated = ({
  replicaId,
}: {
  replicaId: IReplica['replica_id'];
}) => {
  const handleClick = () => {
    toggleIntercom();
  };
  return (
    <div className="flex size-full flex-1 flex-col items-center justify-center gap-8">
      <Confetti recycle={false} numberOfPieces={600} />
      <div className="inline-flex size-12 items-center justify-center rounded-full bg-primary-foreground">
        <CheckIcon className="size-6 text-primary" />
      </div>
      <div className="flex w-full max-w-md flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Replica Submitted Successfully!
        </h1>
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Your replica will be created within 3-4 hours. If you have any
          questions, please contact{' '}
          <button onClick={handleClick} className="underline">
            support
          </button>
          .
        </p>
        <div className="mb-8 flex items-center">
          <p className="text-sm font-medium text-muted-foreground">
            Replica ID:
          </p>
          <CopyRequestID id={replicaId} />
        </div>
        <div className="flex items-center justify-center gap-4">
          <CodeDialog>
            <Button variant="outline">View Code</Button>
          </CodeDialog>
          <Button asChild>
            <Link href="/replicas">Finish</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
