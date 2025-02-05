export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface Increments {
  title: string;
  amount: number;
  date: string;
  _id: string;
}
export interface Department {
  _id: string;
  departmentName: string;
}
export interface EmployeeDetails {
  _id: string;
  firstName: string;
  lastName: string;
  Avatar?: string;
  Designation?: string;
  dep_ID?: Department[];
}

export interface Payroll {
  _id: string;
  Emp_ID: EmployeeDetails;
  User_ID: string;
  Employee_Name: string;
  Date: string;
  Basic_Salary: number;
  Increments: Increments[];
  Tax_Amount: number;
  Absent_Deduction: number;
  Today_Days_Present: number;
  Total_Absent: number;
  Total_Leaves: number;
  Late: number;
  Total_Minutes_Monthly: number;
  Total_Remaining_Minutes: number;
  Net_Salary: number;
  Total_SalaryDeducton: number;
  Total_Working_Minutes: number;
  Pay_Status: 'Paid' | 'Unpaid';
  Paid_Amount: number;
  Working_Days: number;
  isDeleted: boolean;
  amountToBePaid?: number;
  __v: number;
}

export interface PayrollApiResponse {
  pagination: Pagination;
  data: Payroll[];
}
