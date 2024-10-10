export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface UserId {
  Avatar?: string;
  companyEmail: string;
  firstName: string;
  lastName: string;
  _id: string;
}

export interface Policy {
  _id: string;
  category: string;
  createdAt: string;
  file: string;
  isDeleted: boolean;
  updatedAt: string;
  userId: UserId;
}

export interface PolicyApiResponse {
  pagination: Pagination;
  data: Policy[];
}

export interface PolicyCategoryApiResponse{
  categories?: string[];
  message?: string;
}