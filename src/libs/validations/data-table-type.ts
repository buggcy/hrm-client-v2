import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';
import { AttendanceListType } from '@/libs/validations/attendance-list';
import {
  EmployeeDobTableListType,
  EmployeeListType,
  EmployeePayrollListType,
  HrEventsListType,
} from '@/libs/validations/employee';
import { PolicyType } from '@/libs/validations/hr-policy';
import { LeaveHistoryListType } from '@/libs/validations/leave-history';

import { AttendanceRequest } from './attendance-request';
import { AnnouncementType } from './hr-announcements';
import { TaxType } from './hr-configuration';
import { HRPayrollListType } from './hr-payroll';
import { HrPerksListType } from './hr-perks';
import { OvertimeListType } from './overtime';
import { PolicyListType } from './policies';

type DataTableType =
  | AttendanceRequest
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
  | EmployeeDobTableListType
  | HRPayrollListType
  | OvertimeListType
  | TaxType;

export default DataTableType;
