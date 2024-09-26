import { FunctionComponent } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';

import EmployeeTable from './components/EmployeeTable.component';

interface EmployeeListProps {}

const EmployeeList: FunctionComponent<EmployeeListProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Employee">
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="home" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <EmployeeTable />
      </LayoutWrapper>
    </Layout>
  );
};

export default EmployeeList;
