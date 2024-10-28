export interface HrPerksList {
  _id: string;
  name: string;
  description: string;
  salaryIncrement: boolean;
  salaryDecrement: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface HrPerksListApiResponse {
  pagination: Pagination;
  data: HrPerksList[];
}

export interface HrPerksGetEmployees {
  id: string;
  avatar?: string;
  name: string;
  email: string;
}

export interface HrPerksGetEmployeesApiResponse {
  data: HrPerksGetEmployees[];
}

export interface HrEmployeeAllPerks {
  _id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  isAvailed: boolean;
  salaryDecrement: boolean;
  salaryIncrement: boolean;
  assignedDecrementAmount: number;
  assignedIncrementAmount: number;
  decrementAmount: number;
  incrementAmount: number;
  dateApplied: string;
  hrApproval: string;
  decisionDate: string;
  document: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface HrEmployeeAllPerksApiResponse {
  data: HrEmployeeAllPerks[];
}

export interface HrPerkRequests {
  _id: string;
  Proof_Document: string;
  assignedIncrementAmount: number;
  incrementAmount: number;
  dateApplied: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    Avatar?: string;
    companyEmail: string;
    contactNo: string;
  };
  perksId: {
    _id: string;
    name: string;
  };
}

export interface HrPerkRequestsApiResponse {
  data: HrPerkRequests[];
}

export interface HrPerkChartData {
  month: string;
  assigned: number;
  availed: number;
}

export interface HrTopAvailed {
  name: string;
  count: number;
}

export interface HrPerkRecordApiResponse {
  records: {
    totalPerks: number;
    totalApprovedPerks: number;
    totalRejectedPerks: number;
    totalPerkAssigned: number;
  };
  topAvailed: HrTopAvailed[];
  chartData: HrPerkChartData[];
}
