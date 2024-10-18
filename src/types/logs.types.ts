export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface Logs {
  createdAt: string;
  overallStatus: string;
  title: string;
  type: string;
  _id: string;
  message: LogsMessages[];
}

export interface LogsMessages {
  message: string;
  timestamp: string;
  status: string;
}

export interface LogsApiResponse {
  pagination: Pagination;
  data: Logs[];
}
