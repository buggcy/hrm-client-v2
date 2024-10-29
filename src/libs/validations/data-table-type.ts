import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';
import { AttendanceListType } from '@/libs/validations/attendance-list';
import {
  EmployeeListType,
  EmployeePayrollListType,
  HrEventsListType,
} from '@/libs/validations/employee';
import { PolicyType } from '@/libs/validations/hr-policy';
import { LeaveHistoryListType } from '@/libs/validations/leave-history';

import { AnnouncementType } from './hr-announcements';
import { HRPayrollListType } from './hr-payroll';
import { HrPerksListType } from './hr-perks';
import { PolicyListType } from './policies';

type DataTableType =
  | AnnouncementType
  | PolicyListType
  | HrPerksListType
  | PolicyType
  | HrEventsListType
  | AttendanceHistoryListType
  | AttendanceListType
  | EmployeeListType
  | EmployeePayrollListType
  | LeaveHistoryListType
  | HRPayrollListType;

export default DataTableType;
