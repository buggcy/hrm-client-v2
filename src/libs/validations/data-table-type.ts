import { AttendanceHistoryListType } from '@/libs/validations/attendance-history';
import { AttendanceListType } from '@/libs/validations/attendance-list';
import {
  EmployeeListType,
  EmployeePayrollListType,
  HrEventsListType,
} from '@/libs/validations/employee';
import { PolicyType } from '@/libs/validations/hr-policy';
import { LeaveHistoryListType } from '@/libs/validations/leave-history';

import { PolicyListType } from './policies';

type DataTableType =
  | PolicyListType
  | PolicyType
  | HrEventsListType
  | AttendanceHistoryListType
  | AttendanceListType
  | EmployeeListType
  | EmployeePayrollListType
  | LeaveHistoryListType;

export default DataTableType;
