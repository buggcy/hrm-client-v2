export interface AttendanceHistory {
  _id: string;
  date: string;
  Total_Time: string;
  Start_Date: string;
  Productivity: string;
  Status: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface AttendanceHistoryApiResponse {
  pagination: Pagination;
  data: AttendanceHistory[];
}

export interface Card1Data {
  status: string;
  timeCompleted: number;
  timeLeft: number;
}

export interface Card2Data {
  averageHours: number;
  averageCheckInTime: string;
  averageCheckOutTime: string;
  onTimeArrivals: number;
}

export interface Card3Data {
  count: number;
  leaves: number;
  absents: number;
  onTimeCheckIns: number;
  lateCheckIns: number;
}

export interface AttendanceApiResponse {
  card1Data: Card1Data;
  card2Data: Card2Data;
  card3Data: Card3Data;
}
