export interface IAnnouncement {
  _id: string;
  hrId: string;
  title: string;
  StartDate: string;
  EndDate: string;
  Priority: string;
  TargetAudience: string;
  Description: string;
  File?: string;
  isDeleted?: boolean;
  isEnabled?: boolean;
  type?: 'hrAnnouncement';
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
