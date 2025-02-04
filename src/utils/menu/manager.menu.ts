import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  Building,
  CalendarCog,
  CalendarDays,
  ClipboardList,
  Gift,
  Home,
  Layers2Icon,
  Megaphone,
  Settings,
  ShieldCheck,
  ThumbsUp,
  UserCog,
  UserCog2,
  UserMinus,
  UserPlus,
} from 'lucide-react';

import { MenuItem } from '@/types/menu';
import { Permission } from '@/types/user-permissions.types';

export const managerMenu = (accessPermissions: Permission[]): MenuItem[] => {
  return [
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
        {
          title: 'Resigned/Fired',
          icon: UserMinus,
          href: '/manager/resigned-fired',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessResigned' && permission.allowed,
          ),
        },
      ],
    },
    {
      title: 'Manage Departments & Projects',
      icon: UserCog2,
      disabled: !(
        accessPermissions.some(
          permission =>
            permission.name === 'accessProjects' && permission.allowed,
        ) ||
        accessPermissions.some(
          permission =>
            permission.name === 'accessDepartments' && permission.allowed,
        )
      ),
      children: [
        {
          title: 'Projects',
          icon: Layers2Icon,
          href: '/manager/manage-projects',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessProjects' && permission.allowed,
          ),
        },
        {
          title: 'Departments',
          icon: Building,
          href: '/manager/manage-department',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessDepartments' && permission.allowed,
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
          permission =>
            permission.name === 'accessPayroll' && permission.allowed,
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
        permission =>
          permission.name === 'accessPolicies' && permission.allowed,
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
      title: 'Manage Complaint & Feedback',
      icon: UserCog2,
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
          title: 'Complaints',
          icon: AlertTriangle,
          href: '/manager/manage-complaints',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessComplaints' && permission.allowed,
          ),
        },
        {
          title: 'Feedbacks',
          icon: ThumbsUp,
          href: '/manager/manage-feedbacks',
          disabled: !accessPermissions.some(
            permission =>
              permission.name === 'accessFeedbacks' && permission.allowed,
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
};
