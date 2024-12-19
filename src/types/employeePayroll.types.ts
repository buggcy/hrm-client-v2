export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
export interface Increment {
  _id?: string;
  title?: string;
  amount?: number;
  date?: string;
}
export interface EmpIdSchema {
  Avatar?: string;
  firstName: string;
  lastName: string;
  _id: string;
}
export interface EmployeePayroll {
  _id: string;
  Emp_ID?: EmpIdSchema | null;
  User_ID?: string;
  type?: string;
  Employee_Name?: string;
  Date?: string;
  Basic_Salary?: number;
  Tax_Amount?: number;
  Absent_Deduction?: number;
  Today_Days_Present?: number;
  Total_Absent?: number;
  Total_Leaves?: number;
  Late?: number;
  Total_Minutes_Monthly?: number;
  Total_Remaining_Minutes?: number;
  Net_Salary?: number;
  Total_SalaryDeducton?: number;
  Total_Working_Minutes?: number;
  Pay_Status?: string;
  Paid_Amount?: number;
  Working_Days?: number;
  isDeleted?: boolean;
  Increments?: Increment[];
}

export interface EmployeePayrollApiResponse {
  pagination: Pagination;
  data: EmployeePayroll[];
}
