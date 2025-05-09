import { FunctionComponent } from 'react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';

import ConfigurationTypeTable from './component/ConfigurationTypeTables';

interface ManageConfigurationProps {}

const ManageConfiguration: FunctionComponent<ManageConfigurationProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Manage Configurationn">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-6 px-2">
        <ConfigurationTypeTable />
      </LayoutWrapper>
    </Layout>
  );
};

export default ManageConfiguration;
