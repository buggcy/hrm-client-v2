export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface UserId {
  _id: string;
  Avatar?: string;
  companyEmail: string;
  firstName: string;
  lastName: string;
}

export interface PolicyType {
  _id: string;
  category: string;
  createdAt: string;
  file: string;
  isDeleted: boolean;
  updatedAt: string;
  userId: UserId;
  __v: number;
  type?: 'hrPolicy';
}

export interface PolicyApiResponse {
  pagination: Pagination;
  data: PolicyType[];
}
