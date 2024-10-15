import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';
import { AttendanceListType } from '@/libs/validations/attendance-list';
import {
  EmployeeListType,
  EmployeePayrollListType,
} from '@/libs/validations/employee';
import { PolicyType } from '@/libs/validations/hr-policy';
import { LeaveHistoryListType } from '@/libs/validations/leave-history';

import { AnnouncementType } from './hr-announcement';

type DataTableType =
  | PolicyType
  | AttendanceHistoryListType
  | AttendanceListType
  | EmployeeListType
  | EmployeePayrollListType
  | LeaveHistoryListType
  | AnnouncementType;

export default DataTableType;
