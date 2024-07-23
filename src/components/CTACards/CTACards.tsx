import Link from 'next/link';

import { ArrowRight, Key, UserPlus, Video } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

const CTA_CONFIG = [
  {
    title: 'Create Video',
    description: 'Generate a video from a replica',
    icon: Video,
    bg: 'bg-[linear-gradient(36deg,_#F57FC6_0%,_#A907A2_182.27%)]',
    href: '/videos/create',
    hover: '/images/createVideo.svg',
  },
  {
    title: 'Create Replica',
    description: 'Clone yourself in minutes',
    icon: UserPlus,
    bg: 'bg-[linear-gradient(237deg,_#F73DB2_-73.33%,_#F6CA5E_113.89%)]',
    href: '/replicas/create',
    hover: '/images/createReplica.svg',
  },
  // {
  //   title: 'Create Conversation',
  //   description: 'Converse with replica in real-time',
  //   icon: MessageSquare,
  //   bg: 'bg-[linear-gradient(15deg,_#CBA9EE_0%,_#8650F8_144.57%)]',
  //   href: '/conversations/create',
  //   hover: '/images/createConv.svg',
  // },
  {
    title: 'Create API Key',
    description: 'Start building with an API Key',
    icon: Key,
    bg: 'bg-[linear-gradient(219deg,_#9887FF_0%,_#80CEF9_100%)]',
    href: '/api-keys',
    hover: '/images/createApi.svg',
  },
];

export const CTACards = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(19.25rem,_1fr))] gap-6">
      {CTA_CONFIG.map(({ title, description, icon: Icon, href, bg, hover }) => (
        <Card key={href} className="group relative cursor-pointer rounded-md">
          <img
            src={hover}
            className="absolute right-0 top-0 size-full rounded-md object-cover opacity-0 group-hover:opacity-100"
            alt=""
          />
          <Link href={href}>
            <CardContent className="relative flex flex-col items-start gap-8 p-6">
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
  );
};
