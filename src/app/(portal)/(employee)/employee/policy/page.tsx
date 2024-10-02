import { FunctionComponent } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import PolicyTable from './component/PolicyTable.component';
import * as Tabs from '@radix-ui/react-tabs';

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
      <Tabs.Root defaultValue="attendance">
          <Tabs.List className="flex border-b">
            <Tabs.Trigger value="attendance" className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500">
              Attendance Policy
            </Tabs.Trigger>
            <Tabs.Trigger value="technology" className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500">
              Technology Policy
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="attendance">
            <PolicyTable />
          </Tabs.Content>
          <Tabs.Content value="technology">
            <PolicyTable />
          </Tabs.Content>
        </Tabs.Root>
      </LayoutWrapper>
    </Layout>
  );
};

export default Policypage;
