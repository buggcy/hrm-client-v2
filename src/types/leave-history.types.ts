export interface ApplyLeaveApiResponse {
  message: string;
}

export interface LeaveHistory {
  _id: string;
  __v: number;
  Leave_Type?: string;
  Start_Date: string;
  End_Date?: string;
  Title: string;
  Description?: string;
  Proof_Document?: string;
  User_ID: {
    _id: string;
    firstName: string;
    lastName: string;
    companyEmail?: string;
    Avatar?: string;
    Designation?: string;
    contactNo?: string;
  };
  ApprovedBy_ID?: {
    _id: string;
    firstName: string;
    lastName: string;
    Avatar?: string;
  };
  Status: 'Approved' | 'Rejected' | 'Pending' | 'Canceled';
  Tahometer_ID?: string;
  isDeleted: boolean;
  rejectedReason?: string;
  createdAt?: string;
  updatedAt?: string;
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
  userId?: string;
  title: string;
  leavesAllowed: number;
  leavesTaken: number;
  month?: number;
  year?: number;
  _id: string;
}
export interface MonthlyLeaveRecord {
  year: number;
  month: number;
  casualLeaves: number;
  sickLeaves: number;
  paidLeaves: number;
  unpaidLeaves: number;
  _id: string;
}

export interface AnnualLeaveRecord {
  year: number;
  month: number;
  annualLeaves: number;
  paidLeaves: number;
  unpaidLeaves: number;
  _id: string;
}

export interface EmployeeLeavesDataApiResponse {
  _id: string;
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
  __v: number;
}
