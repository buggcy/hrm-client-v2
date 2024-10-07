import { CalendarClock, DollarSignIcon, Home, LogOut, Siren } from 'lucide-react';

import { MenuItem } from '@/types/menu';

export const employeeMenu: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/employee/dashboard',
  },
  {
    title: 'Time Tracking',
    icon: CalendarClock,
    children: [
      {
        title: 'Attendance',
        icon: CalendarClock,
        href: '/employee/attendance/attendance-history',
      },
      {
        title: 'Leave',
        icon: LogOut,
        href: '/employee/attendance/leave-history',
      },
    ],
  },
  {
    title: 'Payment',
    icon: DollarSignIcon,
    children: [
      {
        title: 'Payroll',
        icon: DollarSignIcon,
        href: '/employee/payroll',
      },
    ],
  },
  {
    title: 'Policies',
    icon: Siren,
    href: '/employee/policy',
  },
];
