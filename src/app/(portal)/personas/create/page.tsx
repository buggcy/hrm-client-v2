'use client';

import React from 'react';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Badge } from '@/components/ui/badge';

import { PreviewAndCode } from '@/app/(portal)/components/PreviewAndCode';
import {
  Code,
  CreatePersonaForm,
  Preview,
} from '@/app/(portal)/personas/components';

export default function Page() {
  return (
    <Layout className="flex max-h-screen flex-col">
      <LayoutHeader title="New Persona">
        <CopyApiUrl type="POST" url="persona" />
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="personaCreate" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper
        wrapperClassName="flex flex-1 h-[calc(100vh-64px)]"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-rows-2"
      >
        <CreatePersonaForm />
        <PreviewAndCode
          preview={<Preview />}
          code={<Code />}
          title={
            <Badge variant="label" className="w-fit text-sm">
              Preview
            </Badge>
          }
        />
      </LayoutWrapper>
    </Layout>
  );
}
