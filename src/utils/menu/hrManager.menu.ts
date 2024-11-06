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

export const hrManagerMenu: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/manager/dashboard',
  },
  {
    title: 'Manage Employee',
    icon: UserCog2,
    children: [
      {
        title: 'Employees',
        icon: UserCog,
        href: '/manager/manage-employees',
      },
      {
        title: 'Add Employees',
        icon: UserPlus,
        href: '/manager/add-employees',
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
        href: '/manager/manage-events',
      },
      {
        title: 'Announcements',
        icon: Megaphone,
        href: '/manager/manage-announcements',
      },
      {
        title: 'Manage Birthday',
        icon: CalendarCog,
        href: '/manager/manage-birthday',
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
        href: '/manager/manage-attendance/attendance-list',
      },
      {
        title: 'Leave List',
        icon: CalendarDays,
        href: '/manager/manage-attendance/leave-list',
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
        href: '/manager/manage-perks/add-perks',
      },
      {
        title: 'Payroll',
        icon: Banknote,
        href: '/manager/manage-payroll',
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
        href: '/manager/manage-policies',
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
        href: '/manager/manage-configuration',
      },
    ],
  },
];
