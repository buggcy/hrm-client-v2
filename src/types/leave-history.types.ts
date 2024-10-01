export interface LeaveHistory {
  _id: string;
  Title: string;
  Leave_Type: string;
  Start_Date: string;
  End_Date: string;
  Status: string;
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
