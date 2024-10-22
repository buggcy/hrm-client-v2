import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AnniversaryTable from './AnniversaryTable';
import EmpBirthdayTable from './EmpBirthdayTable';

function TabPages() {
  return (
    <Tabs defaultValue="DOB" className="w-full">
      <TabsList className="mb-5 flex justify-center">
        <TabsTrigger value="DOB">DOB</TabsTrigger>
        <TabsTrigger value="Anniversary">Anniversary</TabsTrigger>
      </TabsList>
      <TabsContent value="DOB">
        <EmpBirthdayTable />
      </TabsContent>
      <TabsContent value="Anniversary">
        <AnniversaryTable />
      </TabsContent>
    </Tabs>
  );
}

export default TabPages;
