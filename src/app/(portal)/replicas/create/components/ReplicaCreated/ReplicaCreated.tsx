import Link from 'next/link';

import { CheckIcon } from 'lucide-react';
import Confetti from 'react-confetti';

import { Button } from '@/components/ui/button';

export const ReplicaCreated = () => {
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
        <p className="mb-8 text-sm font-medium text-muted-foreground">
          Your replica will be created within 3-4 hours. If you have any
          questions, please contact{' '}
          <a href="mailto:developer-support@tavus.io" className="underline">
            developer-support@tavus.io
          </a>
          .
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => console.log('View Code clicked')}
          >
            View Code
          </Button>
          <Button asChild>
            <Link href="/replicas">Finish</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
