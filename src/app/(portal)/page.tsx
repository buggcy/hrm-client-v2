import { CTACards } from '@/components/CTACards';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';
import { Resources } from '@/components/Resources';
import { StockReplicaCarousel } from '@/components/StockReplicaCarousel';

export default function Home() {
  return (
    <Layout>
      <LayoutHeader title="Home">
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="home" />
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
