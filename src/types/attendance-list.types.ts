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
  Tahometer_ID?: string;
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
  Late_Minutes?: number;
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

export interface UserDateAttendance {
  Start_Date?: string;
  End_Date?: string;
  Total_Time?: string;
  Status?: string;
  message?: string;
}

interface Address {
  city?: string;
  street?: string;
  province?: string;
  landMark?: string;
  country?: string;
  zip?: string;
  full?: string;
  _id: string;
}

interface Position {
  position: string;
  isCurrent: boolean;
  _id: string;
  timestamp: string;
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string;
  uniqueCode?: string;
  roleId: number;
  companyEmail: string;
  Ed_Exp_ID?: string[];
  dep_ID?: string[];
  isDeleted?: boolean;
  UniqueCodeExpire?: string;
  __v?: number;
  Blood_Group?: string;
  DOB?: string;
  Emergency_Phone?: string;
  Family_Name?: string;
  Family_Occupation?: string;
  Family_PhoneNo?: string;
  Family_Relation?: string;
  Gender?: 'male' | 'female';
  Marital_Status?: 'married' | 'unmarried';
  Nationality?: string;
  isApproved: 'Approved' | 'Pending' | 'Rejected';
  password?: string;
  rejectedReason?: string;
  Avatar?: string | null;
  Current_Status?: string;
  profileDescription?: string;
  Tahometer_ID?: string;
  basicSalary: number;
  activeStatus?: boolean;
  updatedAt: string;
  position?: Position[];
  Joining_Date?: string | null;
  otp?: string;
  otpExpires?: string;
  Address?: Address;
  Designation?: string;
  createdAt?: string;
}

export interface AttendanceUsers {
  users: Employee[];
}

interface dayType {
  Present: number;
  Absent: number;
  Leave: number;
  Holiday: number;
}

export interface Card2Data {
  [key: string]: dayType;
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
  card2Data: Card2Data;
  card3Data: Card3Data;
}

export interface AttendanceDistributionApiResponse {
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
}
