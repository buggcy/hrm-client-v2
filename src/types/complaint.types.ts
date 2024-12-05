export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface Complaint {
  _id: string;
  __v: number;
  resolvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    companyEmail?: string;
    Designation?: string;
    Avatar?: string;
  };
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    contactNo?: string;
    companyEmail?: string;
    Designation?: string;
    Avatar?: string;
  };
  title: string;
  complaint: string;
  document?: string;
  status: 'Pending' | 'Resolved' | 'Canceled';
  complaintFeedback?: string;
  resolvedDate?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintRecords {
  totalCount: number;
  pendingCount: number;
  resolvedCount: number;
  canceledCount: number;
}
export interface ComplaintTrendChartData {
  month: string;
  resolved: number;
  pending: number;
  canceled: number;
}

export interface ComplaintApiResponse {
  pagination: Pagination;
  data: Complaint[];
}

export interface ComplaintRecordApiResponse {
  records: ComplaintRecords;
  data: ComplaintTrendChartData[];
}
