import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const ConversationBanner = () => (
  <div className="relative flex items-center justify-between rounded-lg bg-[linear-gradient(270deg,#E289C5_10.09%,#DE87C2_27.3%,#1D1134_80.03%,#1B0925_120.21%)] p-8">
    <div className="z-10 w-full space-y-4 md:w-1/2">
      <span className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary">
        New Product
      </span>
      <h2 className="text-3xl font-bold text-white">
        Introducing Conversational Video
      </h2>
      <p className="text-white">
        You can now build live conversational experiences, with real-time
        digital twins that speak, see, & hear.
      </p>
      <Button variant="outline" asChild>
        <Link href="/conversations/create">Create New Conversation</Link>
      </Button>
    </div>
    <img
      className="absolute right-0 hidden w-1/2 md:block"
      src="/images/bcg_home_page_conversation_banner.png"
      alt="Conversation's personas list"
    />
  </div>
);
