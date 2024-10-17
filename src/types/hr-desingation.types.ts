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

export interface Designation {
  _id: string;
  userId: UserId;
  status: string;
  designationType: string;
  isDeleted: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface DesignationApiResponse {
  pagination: Pagination;
  data: Designation[];
}
