import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  Home,
  Mail,
  UserCog2,
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
        title: 'Manage Employees',
        icon: BadgeCheck,
        href: '/hr/manage-employees',
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
];
