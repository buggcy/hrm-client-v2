export interface ApplyLeaveApiResponse {
  message: string;
}
type LeaveStatus = 'Approved' | 'Pending' | 'Rejected' | 'Canceled';

export interface LeaveHistory {
  _id: string;
  Title: string;
  Leave_Type: string;
  Start_Date: string;
  End_Date: string;
  Status: LeaveStatus;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface LeaveHistoryApiResponse {
  pagination: Pagination;
  data: LeaveHistory[];
}

export interface dayOfWeekCount {
  [key: string]: number;
}

export interface monthCount {
  [key: string]: number;
}

export interface leaves {
  totalTakenLeaves: number;
  totalAllowedLeaves: number;
  monthlyAllowedLeaved: number;
  annualAllowedLeaves: number;
  totalCasualLeaves: number;
  totalSickLeaves: number;
  totalAnnualLeaveCount: number;
}

export interface LeaveApiResponse {
  dayOfWeekCount: dayOfWeekCount;
  monthCount: monthCount;
  leaves: leaves;
}

export interface ExtraLeave {
  title: string;
  leavesAllowed: number;
  leavesTaken: number;
  month?: number;
  year?: number;
}
export interface MonthlyLeaveRecord {
  year: number;
  month: number;
  casualLeaves: number;
  sickLeaves: number;
}

export interface AnnualLeaveRecord {
  year: number;
  annualLeaves: number;
}

export interface EmployeeLeavesDataApiResponse {
  userId: string;
  allowedCasualLeaves: number;
  allowedSickLeaves: number;
  monthlyLeavesAllowed: number;
  monthlyLeaveRecords: MonthlyLeaveRecord[];
  annualLeavesAllowed: number;
  annualLeavesRecords: AnnualLeaveRecord[];
  extraLeaves: ExtraLeave[];
  createdAt: string;
  updatedAt: string;
}
