import {
  BadgeCheck,
  CalendarCog,
  CalendarDays,
  ClipboardList,
  Gift,
  Home,
  Medal,
  Settings,
  UserCog,
  UserCog2,
  UserPlus,
} from 'lucide-react';

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
    title: 'Manage Events',
    icon: UserCog2,
    children: [
      {
        title: 'Manage Events',
        icon: CalendarCog,
        href: '/hr/manage-events',
      },
    ],
  },
  {
    title: 'Manage Attendance',
    icon: UserCog2,
    children: [
      {
        title: 'Attendance List',
        icon: ClipboardList,
        href: '/hr/manage-attendance/attendance-list',
      },
      {
        title: 'Leave List',
        icon: CalendarDays,
        href: '/hr/manage-attendance/leave-list',
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
  {
    title: 'Manage Perks',
    icon: UserCog2,
    children: [
      {
        title: 'Add Perks',
        icon: Gift,
        href: '/hr/manage-perks/add-perks',
      },
      {
        title: 'Award Perks',
        icon: Medal,
        href: '/hr/manage-perks/award-perks',
      },
    ],
  },
  {
    title: 'Manage Payroll',
    icon: UserCog2,
    children: [
      {
        title: 'Manage Payroll',
        icon: BadgeCheck,
        href: '/hr/manage-payroll',
      },
    ],
  },
  {
    title: 'Manage Configuration',
    icon: UserCog2,
    children: [
      {
        title: 'Manage Configuration',
        icon: Settings,
        href: '/hr/manage-configuration',
      },
    ],
  },
];
