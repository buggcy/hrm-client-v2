import { BadgeCheck, Home, UserCog2 } from 'lucide-react';

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
];
