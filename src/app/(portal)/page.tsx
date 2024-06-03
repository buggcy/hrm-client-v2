'use client';
import Link from 'next/link';

import { ArrowRight, List, SmilePlus, Users, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent } from '@/components/ui/card';

// DUMMY CONTENT, GENERATED FOR TEST PURPOSES / DO NOT SPEND YOUR TIME FOR REVIEW
// WILL BE REMOVED
const ROUTES_CONFIG = [
  {
    title: 'List of Replicas',
    description: 'List of Replicas bla bla bla.',
    icon: Users,
    href: '/replicas',
  },
  {
    title: 'Create a Replica',
    description: 'Create a Replica bla bla bla.',
    icon: SmilePlus,
    href: '/replicas/create',
  },
  {
    title: 'List of Videos',
    description: 'List of videos bla bla bla.',
    icon: List,
    href: '/videos',
  },
  {
    title: 'Create a Video',
    description: 'Create a video bla bla bla.',
    icon: Video,
    href: '/videos/create',
  },
];
export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
        {t('general.title')} {t('general.description')}
      </h1>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {ROUTES_CONFIG.map(({ title, description, icon: Icon, href }) => (
          <Card
            key={href}
            className="group cursor-pointer border border-gray-200 transition-colors hover:border-gray-400 dark:hover:border-gray-800"
          >
            <Link href={href}>
              <CardContent className="flex flex-col items-start gap-4 p-4 md:flex-row md:p-6">
                <div className="rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                  <Icon className="size-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary dark:text-gray-50 dark:group-hover:text-primary">
                      {title}
                    </h3>
                    <ArrowRight className="size-4 text-gray-500 group-hover:text-primary dark:text-gray-400 dark:group-hover:text-primary" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
