'use client';
import Link from 'next/link';

import { ArrowRight, Key, MessageSquare, UserPlus, Video } from 'lucide-react';

// import { useTranslation } from 'react-i18next';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { StockReplicaCarousel } from '@/components/StockReplicaCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ROUTES_CONFIG = [
  {
    title: 'Create Video',
    description: 'Generate a video from a replica',
    icon: Video,
    bg: 'bg-[linear-gradient(36deg,_#F57FC6_0%,_#A907A2_182.27%)]',
    href: '/videos/create',
  },
  {
    title: 'Create Replica',
    description: 'Clone yourself in minutes',
    icon: UserPlus,
    bg: 'bg-[linear-gradient(237deg,_#F73DB2_-73.33%,_#F6CA5E_113.89%)]',
    href: '/replicas/create',
  },
  {
    title: 'Create Conversation',
    description: 'Converse with replica in real-time',
    icon: MessageSquare,
    bg: 'bg-[linear-gradient(15deg,_#CBA9EE_0%,_#8650F8_144.57%)]',
    href: '/conversations/create',
  },

  {
    title: 'Create API Key',
    description: 'Star building with an API Key',
    icon: Key,
    bg: 'bg-[linear-gradient(219deg,_#9887FF_0%,_#80CEF9_100%)]',
    href: '/api-keys',
  },
];

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
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(19.25rem,_1fr))] gap-6">
          {ROUTES_CONFIG.map(({ title, description, icon: Icon, href, bg }) => (
            <Card key={href} className="group cursor-pointer rounded-md">
              <Link href={href}>
                {/* TODO: Add hover state for card */}
                <CardContent className="flex flex-col items-start gap-8 from-white to-[rgba(242,_48,_170,_0.10)] p-6 group-hover:bg-gradient-to-tr md:p-6">
                  <div className="flex">
                    <div
                      className={`flex size-9 items-center justify-center rounded-full ${bg}`}
                    >
                      <Icon className="size-5 text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{title}</h3>
                      <ArrowRight className="size-4" />
                    </div>
                    <p className="text-muted-foreground">{description}</p>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
        <StockReplicaCarousel />
      </LayoutWrapper>
    </Layout>
  );
}
