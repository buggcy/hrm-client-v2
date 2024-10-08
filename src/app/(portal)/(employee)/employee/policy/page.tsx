import { FunctionComponent } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import AttendencePolicyTable from './component/AttendencePolicyTable.component';
import TechnologyPolicyTable from './component/TechnologyPolicyTable.component';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Notification } from '@/components/NotificationIcon';
import Header from '@/components/Header/Header';

interface EmployeePolicyProps {}

const Policypage: FunctionComponent<EmployeePolicyProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Policies">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-6 px-2">
      <Header subheading="Your Rights, Responsibilities, and Company Guidelines"></Header>
      <Tabs defaultValue="attendance" className="w-full">
      <div className="flex flex-col md:flex-row md:space-x-6 items-start">
          <TabsList className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 bg-transparent p-0 w-full md:w-1/4 mt-7 mb-4 md:mb-0">
            <TabsTrigger value="attendance" className="flex-1 p-3 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-500 sm:w-full sm:justify-start">
            <span>Attendance Policy</span>
            </TabsTrigger>
            <TabsTrigger value="technology" className="flex-1 p-3 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-500 sm:w-full sm:justify-start">
            <span>Technology Policy</span>
            </TabsTrigger>
          </TabsList>
          <div className="w-full md:w-3/4">
          <TabsContent value="attendance" className="mt-0">
            <AttendencePolicyTable />
          </TabsContent>
          <TabsContent value="technology" className="mt-0">
            <TechnologyPolicyTable />
          </TabsContent>
          </div>
        </div>
        </Tabs>
      </LayoutWrapper>
    </Layout>
  );
};

export default Policypage;
