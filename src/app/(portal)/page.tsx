// import { useTranslation } from 'react-i18next';
import { CTACards } from '@/components/CTACards';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Resources } from '@/components/Resources';
import { StockReplicaCarousel } from '@/components/StockReplicaCarousel';
import { Button } from '@/components/ui/button';

export default function Home() {
  // const { t } = useTranslation();

  return (
    <Layout>
      <LayoutHeader title="Home">
        <LayoutHeaderButtonsBlock>
          <Button className="ml-auto" variant="outline">
            Read Docs
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper>
        <CTACards />
        <StockReplicaCarousel />
        <Resources />
      </LayoutWrapper>
    </Layout>
  );
}
