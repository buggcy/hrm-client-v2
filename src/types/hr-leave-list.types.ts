export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface LeaveList {
  _id: string;
  __v: number;
  Leave_Type?: string;
  Start_Date: string;
  End_Date?: string;
  Title?: string;
  Description?: string;
  Proof_Document?: string;
  User_ID: {
    _id: string;
    firstName: string;
    lastName: string;
    companyEmail: string;
    Avatar: string;
    Designation?: string;
    contactNo?: string;
  };
  ApprovedBy_ID?: {
    _id: string;
    firstName: string;
    lastName: string;
    Avatar: string;
  };
  Status: 'Approved' | 'Rejected' | 'Pending' | 'Canceled';
  Tahometer_ID?: string;
  isDeleted: boolean;
  rejectedReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PerkApiResponse {
  pagination: Pagination;
  data: LeaveList[];
}

export interface LeaveListRecords {
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  canceledCount: number;
}

export interface LeaveListApiResponse {
  pagination: Pagination;
  data: LeaveList[];
}
