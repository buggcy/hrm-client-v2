import {
  CalendarClock,
  DollarSignIcon,
  Gift,
  Home,
  LogOut,
  Shield,
  Siren,
} from 'lucide-react';

import { useAuthStore } from '@/stores/auth';

const { accessPermissions } = useAuthStore.getState();

import { MenuItem } from '@/types/menu';

export const employeeMenu: MenuItem[] = [
  {
    title: 'Home',
    icon: Home,
    href: '/employee/dashboard',
    disabled: false,
  },
  {
    title: 'Time Tracking',
    icon: CalendarClock,
    disabled: !(
      accessPermissions.some(
        permission =>
          permission.name === 'accessAttendanceHistory' && permission.allowed,
      ) ||
      accessPermissions.some(
        permission =>
          permission.name === 'accessLeaveHistory' && permission.allowed,
      )
    ),
    children: [
      {
        title: 'Attendance',
        icon: CalendarClock,
        href: '/employee/attendance/attendance-history',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessAttendanceHistory' && permission.allowed,
        ),
      },
      {
        title: 'Leave',
        icon: LogOut,
        href: '/employee/attendance/leave-history',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessLeaveHistory' && permission.allowed,
        ),
      },
    ],
  },
  {
    title: 'Payment',
    icon: DollarSignIcon,
    disabled: !(
      accessPermissions.some(
        permission =>
          permission.name === 'accessPerksAndBenefits' && permission.allowed,
      ) ||
      accessPermissions.some(
        permission => permission.name === 'accessPayroll' && permission.allowed,
      )
    ),
    children: [
      {
        title: 'Perks & Benefits',
        icon: Gift,
        href: '/employee/perks',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessPerksAndBenefits' && permission.allowed,
        ),
      },
      {
        title: 'Payroll',
        icon: DollarSignIcon,
        href: '/employee/payroll',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessPayroll' && permission.allowed,
        ),
      },
    ],
  },
  {
    title: 'Policies',
    icon: Siren,
    disabled: !accessPermissions.some(
      permission => permission.name === 'accessPolicies' && permission.allowed,
    ),
    children: [
      {
        title: 'Policies',
        icon: Shield,
        href: '/employee/policy',
        disabled: !accessPermissions.some(
          permission =>
            permission.name === 'accessPolicies' && permission.allowed,
        ),
      },
    ],
  },
];
