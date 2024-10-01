import { Gift, Home } from 'lucide-react';

import { MenuItem } from '@/types/menu';

export const employeeMenu: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/employee/dashboard',
  },
  {
    title: 'Perks & Benefits',
    icon: Gift,
    href: '/employee/perks',
  },
];
