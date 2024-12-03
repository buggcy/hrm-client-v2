import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  CalendarCog,
  CalendarDays,
  ClipboardList,
  Gift,
  Home,
  Megaphone,
  Settings,
  ThumbsUp,
  UserCog,
  UserCog2,
  UserMinus,
  UserPlus,
} from 'lucide-react';

import { MenuItem } from '@/types/menu';
import { Permission } from '@/types/user-permissions.types';

export const hrMenu = (accessPermissions: Permission[]): MenuItem[] => {
  return [
    {
      title: 'Home',
      icon: Home,
      href: '/hr/dashboard',
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
        ) ||
        accessPermissions.some(
          permission =>
            permission.name === 'accessResigned' && permission.allowed,
        )
      ),
      children: [
        {
          title: 'Employees',
          icon: UserCog,
          href: '/hr/manage-employees',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessManageEmployees' && permission.allowed,
          ),
        },
        {
          title: 'Add Employees',
          icon: UserPlus,
          href: '/hr/add-employees',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessAddEmployee' && permission.allowed,
          ),
        },
        {
          title: 'Resigned/Fired',
          icon: UserMinus,
          href: '/hr/resigned-fired',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessResigned' && permission.allowed,
          ),
        },
      ],
    },
    {
      title: 'Manage Events',
      icon: UserCog2,
      disabled: !(
        accessPermissions.some(
          permission =>
            permission.name === 'accessEvents' && permission.allowed,
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
          href: '/hr/manage-events',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessEvents' && permission.allowed,
          ),
        },
        {
          title: 'Announcements',
          icon: Megaphone,
          href: '/hr/manage-announcements',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessAnnouncements' && permission.allowed,
          ),
        },
        {
          title: 'Manage Birthday',
          icon: CalendarCog,
          href: '/hr/manage-birthday',
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
          href: '/hr/manage-attendance/attendance-list',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessAttendanceList' && permission.allowed,
          ),
        },
        {
          title: 'Leave List',
          icon: CalendarDays,
          href: '/hr/manage-attendance/leave-list',
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
          permission =>
            permission.name === 'accessPayroll' && permission.allowed,
        )
      ),
      children: [
        {
          title: 'Perks & Benefits',
          icon: Gift,
          href: '/hr/manage-perks/add-perks',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessAddPerks' && permission.allowed,
          ),
        },
        {
          title: 'Payroll',
          icon: Banknote,
          href: '/hr/manage-payroll',
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
        permission =>
          permission.name === 'accessPolicies' && permission.allowed,
      ),
      children: [
        {
          title: 'Manage Policy',
          icon: BadgeCheck,
          href: '/hr/manage-policies',
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
          href: '/hr/manage-configuration',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessConfiguration' && permission.allowed,
          ),
        },
      ],
    },
    {
      title: 'Manage Complaint',
      icon: UserCog2,
      disabled: !accessPermissions.some(
        permission =>
          permission.name === 'accessComplaints' && permission.allowed,
      ),
      children: [
        {
          title: 'Manage Complaint',
          icon: AlertTriangle,
          href: '/hr/manage-complaints',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessComplaints' && permission.allowed,
          ),
        },
      ],
    },
    {
      title: 'Manage Feedbacks',
      icon: UserCog2,
      disabled: !accessPermissions.some(
        permission =>
          permission.name === 'accessFeedbacks' && permission.allowed,
      ),
      children: [
        {
          title: 'Manage Feedbacks',
          icon: ThumbsUp,
          href: '/hr/manage-feedbacks',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessFeedbacks' && permission.allowed,
          ),
        },
      ],
    },
  ];
};
