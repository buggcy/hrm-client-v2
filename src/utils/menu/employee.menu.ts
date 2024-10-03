import { Clock9, Home } from 'lucide-react';

import { MenuItem } from '@/types/menu';

export const employeeMenu: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/employee/dashboard',
  },
  {
    title: 'Attendance',
    icon: Clock9,
    href: '/employee/attendance/attendance-history',
  },
  {
    title: 'Leave',
    icon: Clock9,
    href: '/employee/attendance/leave-history',
  },
];
