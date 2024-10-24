export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface Configuration {
  _id: string;
  __v: number;
  educationType?: string;
  designationType?: string;
  experienceType?: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    companyEmail: string;
    Avatar: string;
  };
  status: 'designation' | 'education' | 'experience';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationApiResponse {
  pagination: Pagination;
  data: Configuration[];
}
