import {
  AlertOctagon,
  CalendarClock,
  ClipboardPlus,
  Clock,
  DollarSignIcon,
  Gift,
  Home,
  LogOut,
  MessageSquare,
  Shield,
  Siren,
} from 'lucide-react';

import { MenuItem } from '@/types/menu';
import { Permission } from '@/types/user-permissions.types';

export const employeeMenu = (accessPermissions: Permission[]): MenuItem[] => {
  return [
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
        ) ||
        accessPermissions.some(
          permission =>
            permission.name === 'accessAttendanceRequest' && permission.allowed,
        ) ||
        accessPermissions.some(
          permission =>
            permission.name === 'accessOvertimeRequest' && permission.allowed,
        )
      ),
      children: [
        {
          title: 'Attendance',
          icon: CalendarClock,
          href: '/employee/attendance/attendance-history',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessAttendanceHistory' &&
              permission.allowed,
          ),
        },
        {
          title: 'Attendance Request',
          icon: ClipboardPlus,
          href: '/employee/attendance/attendance-request',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessAttendanceRequest' &&
              permission.allowed,
          ),
        },
        {
          title: 'Overtime Request',
          icon: Clock,
          href: '/employee/attendance/overtime-request',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessOvertimeRequest' && permission.allowed,
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
          permission =>
            permission.name === 'accessPayroll' && permission.allowed,
        )
      ),
      children: [
        {
          title: 'Perks & Benefits',
          icon: Gift,
          href: '/employee/perks',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessPerksAndBenefits' &&
              permission.allowed,
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
        permission =>
          permission.name === 'accessPolicies' && permission.allowed,
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
    {
      title: 'Complaint & Feedback',
      icon: AlertOctagon,
      disabled: !(
        accessPermissions.some(
          permission =>
            permission.name === 'accessComplaints' && permission.allowed,
        ) ||
        accessPermissions.some(
          permission =>
            permission.name === 'accessFeedbacks' && permission.allowed,
        )
      ),
      children: [
        {
          title: 'Complaint',
          icon: AlertOctagon,
          href: '/employee/complaint',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessComplaints' && permission.allowed,
          ),
        },
        {
          title: 'Feedback',
          icon: MessageSquare,
          href: '/employee/feedback',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessFeedbacks' && permission.allowed,
          ),
        },
      ],
    },
  ];
};
