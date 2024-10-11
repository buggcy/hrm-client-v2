import { BadgeCheck, Clock, Home, UserCog2 } from 'lucide-react';

import { MenuItem } from '@/types/menu';

export const hrMenu: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/hr/dashboard',
  },
  {
    title: 'Manage Employee',
    icon: UserCog2,
    children: [
      {
        title: 'Manage Employees',
        icon: BadgeCheck,
        href: '/hr/manage-employees',
      },
    ],
  },
  {
    title: 'Manage Leave',
    icon: UserCog2,
    children: [
      {
        title: 'Manage Leave',
        icon: Clock,
        href: '/hr/manage-leave',
      },
    ],
  },
  {
    title: 'Manage Policy',
    icon: UserCog2,
    children: [
      {
        title: 'Manage Policy',
        icon: BadgeCheck,
        href: '/hr/manage-policies',
      },
    ],
  },
];
