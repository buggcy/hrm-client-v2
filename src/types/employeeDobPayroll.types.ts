export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface EmployeeDobTable {
  _id: string;
  firstName: string;
  lastName: string;
  DOB?: string;
  Joining_Date?: string;
  remainingDays: number;
}

export interface EmployeeDobTableApiResponse {
  pagination: Pagination;
  data: EmployeeDobTable[];
}
