import React, { forwardRef } from 'react';
import Image from 'next/image';

// eslint-disable-next-line import/no-unresolved
import buggcy_logo from '/public/images/buggcy/logo-buggcy.png';

interface PayslipProps {
  payslipDate: string;
  date: string;
  employeeName: string;
  employeeDesignation: string;
  employeeDepartment: string;
  basicSalary: number;
  absentDeduction: number;
  totalEarnings: number;
  totalAfterTax: number;
  salaryDeduction: number;
  paymentStatus: string;
  perks: {
    increments: {
      name: string;
      amount: number;
    }[];
    decrements: {
      name: string;
      amount: number;
    }[];
  };
  totalPerkIncrement?: number;
  totalPerkDecrement?: number;
  casualLeaves?: number;
  sickLeaves?: number;
  annualLeaves?: number;
}

const Payslip = forwardRef<HTMLDivElement, PayslipProps>(
  (
    {
      payslipDate,
      date,
      employeeName,
      employeeDesignation,
      employeeDepartment,
      basicSalary,
      absentDeduction,
      totalEarnings,
      totalAfterTax,
      salaryDeduction,
      paymentStatus,
      perks,
      totalPerkIncrement,
      totalPerkDecrement,
      casualLeaves,
      sickLeaves,
      annualLeaves,
    },
    ref,
  ) => {
    const netSalary =
      totalAfterTax + (totalPerkIncrement || 0) - (totalPerkDecrement || 0);
    return (
      <div
        className="relative box-border flex justify-center bg-gray-100 p-10 font-sans"
        id="print-area"
        ref={ref}
      >
        <div
          style={{ width: '1000px' }}
          className="overflow-hidden rounded-lg border border-gray-300 bg-white p-6"
        >
          <div className="mb-4 grid grid-cols-2 items-center py-2">
            <div>
              <Image src={buggcy_logo} alt="Logo" width={150} height={50} />
            </div>
            <div className="text-right">
              <p>
                <strong
                  style={{
                    color: '#30bbf2',
                  }}
                >
                  Date:
                </strong>{' '}
                {date}
              </p>
            </div>
          </div>
          <hr className="mb-6 border-t border-gray-300" />
          <div className="mb-6">
            <div className="flex justify-between">
              <p>
                <strong>Employee Name:</strong> {employeeName}
              </p>
              <p>
                <strong>Payslip Date:</strong> {payslipDate}
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Designation:</strong> {employeeDesignation}
              </p>
              <p>
                <strong>Payment Status:</strong> {paymentStatus}
              </p>
            </div>
            <p>
              <strong>Department:</strong> {employeeDepartment}
            </p>
          </div>
          <div className="mb-6 rounded-lg border border-gray-300 p-4">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2" style={{ color: '#30bbf2' }}>
                    Earnings
                  </th>
                  <th className="p-2" style={{ color: '#30bbf2' }}>
                    Amount
                  </th>
                  <th className="p-2" style={{ color: '#30bbf2' }}>
                    Deductions
                  </th>
                  <th className="p-2" style={{ color: '#30bbf2' }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-gray-300 p-2">Basic Salary</td>
                  <td className="border-b border-gray-300 p-2">{`Rs ${basicSalary}`}</td>
                  <td className="border-b border-gray-300 p-2">
                    Absent Deduction
                  </td>
                  <td className="border-b border-gray-300 p-2">{`Rs ${absentDeduction}`}</td>
                </tr>
                {Array.from({
                  length: Math.max(
                    perks.increments?.length || 0,
                    perks.decrements?.length || 0,
                  ),
                }).map((_, index) => {
                  const increment = perks.increments?.[index];
                  const decrement = perks.decrements?.[index];
                  return (
                    <tr key={index}>
                      <td className="border-b border-gray-300 p-2">
                        {increment ? increment.name : ''}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {increment ? `Rs ${increment.amount}` : ''}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {decrement ? decrement.name : ''}
                      </td>
                      <td className="border-b border-gray-300 p-2">
                        {decrement ? `Rs ${decrement.amount}` : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-between border-t border-gray-300 p-2">
              <p>
                <strong>Total Earnings:</strong>
              </p>
              <p>{`Rs ${totalEarnings > 0 ? totalEarnings : 0}`}</p>
            </div>
            <div className="flex justify-between border-t border-gray-300 p-2">
              <p>
                <strong>Total Perk Increments:</strong>
              </p>
              <p>{`Rs ${totalPerkIncrement || 0}`}</p>
            </div>
            <div className="flex justify-between border-t border-gray-300 p-2">
              <p>
                <strong>Total Perk Decrements:</strong>
              </p>
              <p>{`Rs ${totalPerkDecrement || 0}`}</p>
            </div>
            <div className="flex justify-between border-t border-gray-300 p-2">
              <p>
                <strong>Total Deductions:</strong>
              </p>
              <p>{`Rs ${salaryDeduction + (totalPerkDecrement || 0)}`}</p>
            </div>
            <div className="flex justify-between border-t border-gray-300 p-2">
              <p>
                <strong>Net Salary:</strong>
              </p>
              <p>{`Rs ${netSalary > 0 ? netSalary : 0}`}</p>
            </div>
          </div>
          <div className="mb-4 text-center">
            <p
              className="text-xl font-bold"
              style={{
                color: '#30bbf2',
              }}
            >
              Availed Leaves Record
            </p>
          </div>
          <ul className="list-none p-0">
            <li className="flex justify-between border-b border-gray-300 p-2">
              <p>Casual Leaves</p> <span>{casualLeaves || 0}</span>
            </li>
            <li className="flex justify-between border-b border-gray-300 p-2">
              <p>Sick Leaves</p> <span>{sickLeaves || 0}</span>
            </li>
            <li className="flex justify-between border-b border-gray-300 p-2">
              <p>Annual Leaves</p> <span>{annualLeaves || 0}</span>
            </li>
          </ul>
          <div className="mt-6">
            <h2>Note</h2>
            <ul className="list-disc pl-4">
              <li>All amounts are in PKR</li>
              <li>
                Hours are converted into numbers for calculation simplicity.
              </li>
              <li>
                This is a system-generated slip, no stamp or signature required.
              </li>
              <li>In case of any issue, contact HR</li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
);

Payslip.displayName = 'Payslip';

export default Payslip;
