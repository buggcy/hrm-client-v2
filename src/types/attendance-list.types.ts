export interface AttendanceBreaks {
  _id: string;
  Start_Break: string;
  End_Break: string;
}

export interface AttendanceUser {
  _id: string;
  firstName: string;
  lastName: string;
  companyEmail: string;
  Avatar?: string;
}

export interface AttendanceList {
  _id: string;
  User_ID: string;
  Start_Date: string;
  End_Date: string;
  Total_Time: string;
  Status: string;
  isDeleted: boolean;
  date: string;
  breaks: AttendanceBreaks[];
  Productivity: string;
  user: AttendanceUser;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface AttendanceListApiResponse {
  pagination: Pagination;
  data: AttendanceList[];
}

export interface Card1Data {
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
}

interface dayType {
  Present: number;
  Absent: number;
  Leave: number;
  Holiday: number;
}

export interface Card2Data {
  Monday: dayType;
  Tuesday: dayType;
  Wednesday: dayType;
  Thursday: dayType;
  Friday: dayType;
  Saturday: dayType;
  Sunday: dayType;
}

export interface Card3Data {
  January: number;
  February: number;
  March: number;
  April: number;
  May: number;
  June: number;
  July: number;
  August: number;
  September: number;
  October: number;
  November: number;
  December: number;
}

export interface AttendanceListStatsApiResponse {
  card1Data: Card1Data;
  card2Data: Card2Data;
  card3Data: Card3Data;
}
