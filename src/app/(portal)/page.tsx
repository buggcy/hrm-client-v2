import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { ReadDocsButton } from '@/components/ReadDocsButton';

import {
  ConversationBanner,
  CTACards,
  Resources,
  StockPersonasCarousel,
  StockReplicaCarousel,
} from '@/app/(portal)/components/HomePage';

export default function Home() {
  return (
    <Layout>
      <LayoutHeader title="Home">
        <LayoutHeaderButtonsBlock>
          <ReadDocsButton to="home" />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-10">
        <ConversationBanner />
        <CTACards />
        <StockReplicaCarousel />
        <StockPersonasCarousel />
        <Resources />
      </LayoutWrapper>
    </Layout>
  );
}
