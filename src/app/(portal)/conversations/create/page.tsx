import React from 'react';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';

import { PreviewAndCode } from '@/app/(portal)/components/PreviewAndCode';
import {
  Code,
  ConversationsList,
  CreateConversationForm,
  Preview,
  Title,
} from '@/app/(portal)/conversations/components';

import { ConversationDetailsSheetWrapper } from '../components/ConversationDetailsSheetWrapper';

export default function Page() {
  return (
    <Layout className="flex max-h-screen flex-col">
      <HighTrafficBanner />
      <LayoutHeader title="New Conversation">
        <CopyApiUrl type="POST" url="conversation" />
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="conversationCreate" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper
        wrapperClassName="flex flex-1 h-[calc(100vh-64px)]"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:grid-rows-2"
      >
        <CreateConversationForm />
        <PreviewAndCode
          preview={<Preview />}
          code={<Code />}
          title={<Title />}
        />
        <ConversationsList />
        <ConversationDetailsSheetWrapper />
      </LayoutWrapper>
    </Layout>
  );
}
