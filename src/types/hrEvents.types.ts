export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
export interface HrEvent {
  _id: string;
  hrId?: string;
  Event_Name?: string;
  Event_Start?: string;
  Event_End?: string;
  Event_Discription?: string;
  isDeleted?: boolean;
  isEnabled?: boolean;
  Event_Type?: string;
  __v?: number;
}

export interface HrEventApiResponse {
  pagination: Pagination;
  data: HrEvent[];
}
