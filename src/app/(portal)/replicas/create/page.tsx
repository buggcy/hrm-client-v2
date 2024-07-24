'use client';
import React, { useEffect } from 'react';

import { Lightbulb } from 'lucide-react';

import { CopyApiUrl } from '@/components/CopyApiUrl';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { Consent } from './components/Consent';
import { Intro } from './components/Intro';
import { RecordingTips } from './components/RecordingTips';
import { StepList } from './components/StepList';
import { Training } from './components/Training';
import { useReplicaStore } from './hooks';

export default function ReplicaCreatePage() {
  const activeStep = useReplicaStore(state => state.activeStep);
  const set = useReplicaStore(state => state.set);

  useEffect(() => {
    return () => {
      const store = useReplicaStore.getInitialState();
      set(store);
    };
  }, [set]);

  return (
    <Layout className="flex flex-col">
      <LayoutHeader title={'Replica Generation'}>
        <CopyApiUrl type="POST" url="replica" />
        <LayoutHeaderButtonsBlock>
          <RecordingTips>
            <Button variant="outline" size="icon" className="rounded-full">
              <span>
                <Lightbulb className="size-5" />
              </span>
              <span className="sr-only">Recording Tips</span>
            </Button>
          </RecordingTips>
          <ReadDocsButton to="replicaCreate" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-[19.125rem,1fr]">
          <StepList />
          <Card className="flex w-full flex-col gap-4 rounded-md p-4 xl:p-6">
            {activeStep === 'intro' && <Intro />}
            {activeStep === 'consent' && <Consent />}
            {activeStep === 'training' && <Training />}
          </Card>
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
