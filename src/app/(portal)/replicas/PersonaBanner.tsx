import React, { useState } from 'react';

import { XIcon } from 'lucide-react';

import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Button } from '@/components/ui/button';

export const PersonaBanner = () => {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('personaBannerVisible') !== 'false';
  });

  const handleClose = () => {
    localStorage.setItem('personaBannerVisible', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative mb-6 overflow-hidden rounded-md border bg-background">
      <div className="relative flex items-center justify-between px-8 py-6">
        <Button
          variant="ghostSecondary"
          size="icon"
          className="absolute right-1.5 top-1.5 z-10 rounded-full"
          onClick={handleClose}
        >
          <XIcon
            className="text-muted-foreground"
            strokeWidth={1}
            size={23.5}
          />
        </Button>

        <div className="z-10 w-full space-y-4 md:w-[43%] xl:w-[48%]">
          <h2 className="font-semibold md:text-2xl">Configure a Persona</h2>
          <p className="text-sm font-medium text-muted-foreground">
            A Persona defines &quot;who is this replica&quot; and how it behaves
            in a conversation. You can configure the Persona Role (e.g., Math
            Tutor), the System Prompt (its personality), and the Conversational
            Context (e.g., a math lesson with a long-time student). <br />
            For conversations that require specialized knowledge like a
            Healthcare Worker, you can also bring your own LLM to power the
            conversation.
          </p>
          <ReadDocsButton to="personaCreate">Read More</ReadDocsButton>
        </div>
        <img
          className="absolute right-0 hidden h-full object-cover md:block"
          src="/images/banner_persona.png"
          alt="Persona's banner persons list"
        />
      </div>
    </div>
  );
};
