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
