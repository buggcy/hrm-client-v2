export interface AttendanceData {
  todayTotalHours: string;
  todayStartTime: string;
  totalHoursOfWeek: string;
}

export interface AttendanceReport {
  noOfPresents: number;
  noOfAbsents: number;
  noOfLeaves: number;
}
