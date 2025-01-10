export interface PayrollRecords {
  totalPaid: number;
  totalUnpaid: number;
  totalPaidAmount: number;
  totalPerkAmount: number;
  totalAmountTobePaid: number;
  totalSalaryDeduction: number;
}

export interface PayrollMonthlyChart {
  month: string;
  Net_Salary: number;
  Tax_Amount: number;
  Basic_Salary: number;
}

export interface PayrollTrendChart {
  month: string;
  Total_Working_Minutes: number;
  Total_Remaining_Minutes: number;
  Total_Absent_Deduction: number;
}

export interface PayrollRecordApiResponse {
  records: PayrollRecords;
  chartData: PayrollMonthlyChart[];
  trendData: PayrollTrendChart[];
}
