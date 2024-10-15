import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  Home,
  Mail,
  Megaphone,
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
      {
        title: 'Leave Requests',
        icon: Mail,
        href: '/hr/manage-attendance/leave-requests',
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
    title: 'Manage Announcement',
    icon: UserCog2,
    children: [
      {
        title: 'Manage Announcement',
        icon: Megaphone,
        href: '/hr/manage-announcement',
      },
    ],
  },
];
