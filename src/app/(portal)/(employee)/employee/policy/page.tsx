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

interface EmployeePolicyProps {}

const Policypage: FunctionComponent<EmployeePolicyProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Policies">
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="home" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
      <Tabs defaultValue="attendance">
          <TabsList className="flex border-b w-fit">
            <TabsTrigger value="attendance" className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500">
              Attendence Policy
            </TabsTrigger>
            <TabsTrigger value="technology" className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500">
              Technology Policy
            </TabsTrigger>
          </TabsList>
          <TabsContent value="attendance">
            <AttendencePolicyTable />
          </TabsContent>
          <TabsContent value="technology">
            <TechnologyPolicyTable />
          </TabsContent>
        </Tabs>
      </LayoutWrapper>
    </Layout>
  );
};

export default Policypage;
