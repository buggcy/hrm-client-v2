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
export interface Attendence {
  totalHours: string;
  date: string;
}

export interface ChartData {
  name: string;
  Hours: number;
  date: string;
}
