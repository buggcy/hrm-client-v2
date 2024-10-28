import { ExtraLeave } from './leave-history.types';

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface EmployeePerks {
  id: string;
  email: string;
  name: string;
  Avatar?: string;
}

export interface ExtraLeaveApiResponse {
  pagination: Pagination;
  data: ExtraLeave[];
}
