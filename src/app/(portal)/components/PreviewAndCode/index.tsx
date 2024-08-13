import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const PreviewAndCode = ({
  title,
  code,
  preview,
}: {
  preview: React.ReactNode;
  code: React.ReactNode;
  title: React.ReactNode;
}) => (
  <div className="flex w-full rounded-md border border-border bg-background p-4 sm:col-span-1 sm:row-span-1">
    <Tabs
      defaultValue="preview"
      className="flex w-full flex-col overflow-hidden rounded"
    >
      <div className="mb-4 flex justify-between">
        {title}
        <TabsList>
          <TabsTrigger value="preview">Video</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="preview"
        asChild
        className="mt-0 flex size-full overflow-hidden"
      >
        {preview}
      </TabsContent>
      <TabsContent
        value="code"
        asChild
        className="mt-0 flex h-full overflow-hidden"
      >
        {code}
      </TabsContent>
    </Tabs>
  </div>
);
