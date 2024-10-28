import {
  BadgeCheck,
  Banknote,
  CalendarCog,
  CalendarDays,
  ClipboardList,
  Gift,
  Home,
  Megaphone,
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
        title: 'Events',
        icon: CalendarCog,
        href: '/hr/manage-events',
      },
      {
        title: 'Announcements',
        icon: Megaphone,
        href: '/hr/manage-announcements',
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
    title: 'Manage Payroll',
    icon: UserCog2,
    children: [
      {
        title: 'Perks & Benefits',
        icon: Gift,
        href: '/hr/manage-perks/add-perks',
      },
      {
        title: 'Payroll',
        icon: Banknote,
        href: '/hr/manage-payroll',
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
