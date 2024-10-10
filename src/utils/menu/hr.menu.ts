import { Home, UserCog, UserCog2, UserPlus } from 'lucide-react';

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
        title: 'Employees',
        icon: UserCog,
        href: '/hr/manage-employees',
      },
      {
        title: 'Add Employees',
        icon: UserPlus,
        href: '/hr/add-employees',
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
