export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface MessageSchema {
  _id: string;
  status: 'Success' | 'Error';
  message: string;
  errorMessage?: string | null;
  timestamp: string;
}

export interface Logs {
  _id: string;
  message: MessageSchema[];
  type: string;
  title: string;
  overallStatus: 'Success' | 'Error' | 'Failed';
  __v: number;
  createdAt: string;
}

export interface LogsApiResponse {
  pagination: Pagination;
  data: Logs[];
}
