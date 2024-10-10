import React from 'react';
import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const NotificationFooter: React.FC = () => (
  <div className="my-2 flex justify-center">
    <Button asChild className="w-[95%]">
      <Link href="/all-notifications">
        <ArrowLeft className="mr-2 size-4" />
        View All Notifications
      </Link>
    </Button>
  </div>
);
