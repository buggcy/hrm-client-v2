'use client';
import React, { FunctionComponent } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStores } from '@/providers/Store.Provider';

import { usePayrollQuery } from '@/hooks/payroll/usePayroll.hook';
import { AuthStoreType } from '@/stores/auth';

import { MonthlyPayrollGraph } from './Cards/MonthlyPayrollCard';
import { StackedRadialChart } from './Cards/StackedRadialChart';

interface PayrollItem {
  Date: string;
  Basic_Salary: number;
  Net_Salary: number;
  Pay_Status: string;
  Paid_Amount: number;
  Tax_Amount: number;
  Absent_Deduction: number;
  Total_SalaryDeducton: number;
  Working_Days: number;
}

const PayrollCards: FunctionComponent = () => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const { data: payrollList, error } = usePayrollQuery({
    userId: user?.Tahometer_ID ? user.Tahometer_ID : '',
  });

  if (error) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  const payrollData = payrollList?.data || [];

  const sortedPayrollData = payrollData
    .filter(item => item.Date)
    .sort((a, b) => {
      const dateA = new Date(a.Date || '').getTime();
      const dateB = new Date(b.Date || '').getTime();
      return dateB - dateA;
    });

  const latestMonthData = sortedPayrollData[0] || {};
  const {
    Basic_Salary = 0,
    Net_Salary = 0,
    Pay_Status,
    Paid_Amount = 0,
    Total_SalaryDeducton = 0,
    Date: date = '',
  } = latestMonthData;
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) {
      return 'Rs. 0.00';
    }
    return `Rs. ${amount.toLocaleString('en-PK', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })}`;
  };

  const increments = latestMonthData.Increments || [];
  const totalIncrements = increments.reduce(
    (acc, increment) => acc + (increment.amount ?? 0),
    0,
  );

  const filteredPayrollData = payrollData?.filter(
    item => item.Date !== undefined,
  ) as PayrollItem[];

  return (
    <div>
      <div className="mb-5 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="flex h-24 w-full flex-col items-start justify-center rounded-lg border border-[#e2e8f0] dark:border-[#3c3c44] max-sm:p-0">
          <CardHeader className="h-8">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Basic Salary
            </CardTitle>
          </CardHeader>
          <CardContent className="pr-2 text-sm font-bold sm:text-lg">
            {formatCurrency(Basic_Salary)}
          </CardContent>
        </Card>

        <Card className="flex h-24 w-full flex-col items-start justify-center rounded-lg border border-[#e2e8f0] dark:border-[#3c3c44]">
          <CardHeader className="h-8">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Net Salary
            </CardTitle>
          </CardHeader>
          <CardContent className="pr-2 text-sm font-bold sm:text-lg">
            {formatCurrency(Net_Salary)}
          </CardContent>
        </Card>

        <Card className="flex h-24 w-full flex-col items-start justify-center rounded-lg border border-[#e2e8f0] dark:border-[#3c3c44]">
          <CardHeader className="h-8">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Pay Status
            </CardTitle>
          </CardHeader>
          <CardContent
            className={`text-sm font-bold sm:text-lg ${Pay_Status === 'Paid' ? 'text-green-600' : 'text-red-600'} pr-2`}
          >
            {Pay_Status}
          </CardContent>
        </Card>

        <Card className="flex h-24 w-full flex-col items-start justify-center rounded-lg border border-[#e2e8f0] dark:border-[#3c3c44]">
          <CardHeader className="h-8">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Paid Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="pr-2 text-sm font-bold sm:text-lg">
            {formatCurrency(Paid_Amount)}
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-[75.7%]">
          <MonthlyPayrollGraph payrollData={filteredPayrollData} />
        </div>
        <div className="w-full lg:w-[24.3%]">
          <StackedRadialChart
            netSalary={Net_Salary}
            totalDeductions={Total_SalaryDeducton}
            totalIncrements={totalIncrements}
            date={date}
          />
        </div>
      </div>
    </div>
  );
};

export default PayrollCards;
