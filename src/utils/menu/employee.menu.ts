import { Home, Siren } from 'lucide-react';

import { MenuItem } from '@/types/menu';

export const employeeMenu: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/employee/dashboard',
  },
  {
    title: 'Policies',
    icon: Siren,
    href: '/employee/policy',
  },
];
