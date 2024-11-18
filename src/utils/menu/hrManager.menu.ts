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
  ShieldCheck,
  UserCog,
  UserCog2,
  UserPlus,
} from 'lucide-react';

import { useAuthStore } from '@/stores/auth';

import { MenuItem } from '@/types/menu';

const { accessPermissions } = useAuthStore.getState();

export const hrManagerMenu: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/manager/dashboard',
    disabled: false,
  },
  {
    title: 'Manage Employee',
    icon: UserCog2,
    disabled: !(
      accessPermissions.some(
        permission =>
          permission.name === 'accessManageEmployees' && permission.allowed,
      ) ||
      accessPermissions.some(
        permission =>
          permission.name === 'accessAddEmployee' && permission.allowed,
      )
    ),
    children: [
      {
        title: 'Employees',
        icon: UserCog,
        href: '/manager/manage-employees',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessManageEmployees' && permission.allowed,
        ),
      },
      {
        title: 'Add Employees',
        icon: UserPlus,
        href: '/manager/add-employees',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessAddEmployee' && permission.allowed,
        ),
      },
    ],
  },
  {
    title: 'Manage Events',
    icon: UserCog2,
    disabled: !(
      accessPermissions.some(
        permission => permission.name === 'accessEvents' && permission.allowed,
      ) ||
      accessPermissions.some(
        permission =>
          permission.name === 'accessAnnouncements' && permission.allowed,
      ) ||
      accessPermissions.some(
        permission =>
          permission.name === 'accessBirthdayAndAnniversary' &&
          permission.allowed,
      )
    ),
    children: [
      {
        title: 'Events',
        icon: CalendarCog,
        href: '/manager/manage-events',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessEvents' && permission.allowed,
        ),
      },
      {
        title: 'Announcements',
        icon: Megaphone,
        href: '/manager/manage-announcements',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessAnnouncements' && permission.allowed,
        ),
      },
      {
        title: 'Manage Birthday',
        icon: CalendarCog,
        href: '/manager/manage-birthday',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessBirthdayAndAnniversary' &&
            permission.allowed,
        ),
      },
    ],
  },

  {
    title: 'Manage Attendance',
    icon: UserCog2,
    disabled: !(
      accessPermissions.some(
        permission =>
          permission.name === 'accessAttendanceList' && permission.allowed,
      ) ||
      accessPermissions.some(
        permission =>
          permission.name === 'accessLeaveList' && permission.allowed,
      )
    ),
    children: [
      {
        title: 'Attendance List',
        icon: ClipboardList,
        href: '/manager/manage-attendance/attendance-list',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessAttendanceList' && permission.allowed,
        ),
      },
      {
        title: 'Leave List',
        icon: CalendarDays,
        href: '/manager/manage-attendance/leave-list',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessLeaveList' && permission.allowed,
        ),
      },
    ],
  },
  {
    title: 'Manage Payroll',
    icon: UserCog2,
    disabled: !(
      accessPermissions.some(
        permission =>
          permission.name === 'accessAddPerks' && permission.allowed,
      ) ||
      accessPermissions.some(
        permission => permission.name === 'accessPayroll' && permission.allowed,
      )
    ),
    children: [
      {
        title: 'Perks & Benefits',
        icon: Gift,
        href: '/manager/manage-perks/add-perks',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessAddPerks' && permission.allowed,
        ),
      },
      {
        title: 'Payroll',
        icon: Banknote,
        href: '/manager/manage-payroll',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessPayroll' && permission.allowed,
        ),
      },
    ],
  },
  {
    title: 'Manage Policy',
    icon: UserCog2,
    disabled: !accessPermissions.some(
      permission => permission.name === 'accessPolicies' && permission.allowed,
    ),
    children: [
      {
        title: 'Manage Policy',
        icon: BadgeCheck,
        href: '/manager/manage-policies',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessPolicies' && permission.allowed,
        ),
      },
    ],
  },

  {
    title: 'Manage Configuration',
    icon: UserCog2,
    disabled: !accessPermissions.some(
      permission =>
        permission.name === 'accessConfiguration' && permission.allowed,
    ),
    children: [
      {
        title: 'Manage Configuration',
        icon: Settings,
        href: '/manager/manage-configuration',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessConfiguration' && permission.allowed,
        ),
      },
    ],
  },

  {
    title: 'Manage Permissions',
    icon: ShieldCheck,
    disabled: !accessPermissions.some(
      permission =>
        permission.name === 'accessPermissions' && permission.allowed,
    ),
    children: [
      {
        title: 'Manage Permissions',
        icon: ShieldCheck,
        href: '/manager/manage-permissions',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessPermissions' && permission.allowed,
        ),
      },
    ],
  },
];
