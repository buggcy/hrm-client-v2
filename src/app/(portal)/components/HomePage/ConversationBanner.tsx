import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const ConversationBanner = () => (
  <div className="relative flex items-center justify-between rounded-lg bg-[linear-gradient(270deg,#E289C5_10.09%,#DE87C2_27.3%,#1D1134_80.03%,#1B0925_120.21%)] p-8">
    <div className="z-10 w-full space-y-4 md:w-1/2">
      <h2 className="text-3xl font-bold text-white">
        Introducing Conversations
      </h2>
      <p className="text-white">
        You can now join a real time conversation with any replica. Improve the
        fidelity of your conversations with replica personas. A replica persona
        is a set of attributes that customize the behavior of a replica during a
        conversation, including a system prompt and optional context for
        additional guidance.
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
