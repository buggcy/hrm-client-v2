export interface IAnnouncement {
  hrId: string;
  title: string;
  StartDate: string;
  EndDate: string;
  Priority: 'Low' | 'Medium' | 'High';
  TargetAudience: 'All' | 'HR' | 'Employees' | 'Management';
  Description: string;
  File?: string;
  isDeleted?: boolean;
  isEnabled?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface AnnouncementApiResponse {
  pagination: Pagination;
  data: IAnnouncement[];
}
