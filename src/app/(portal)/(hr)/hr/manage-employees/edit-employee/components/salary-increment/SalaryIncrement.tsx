'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import { useEmployeeSalaryQuery } from '@/hooks/employeeEdit/useEmployeeEdit.hook';

import { SalaryIncrementDialog } from './components/SalaryIncrementDialog.component';
import SalaryIncrementTable from './components/SalaryIncrementTable.component';

interface SalaryIncrementProps {
  employeeId?: string;
}

const SalaryIncrement = ({ employeeId }: SalaryIncrementProps) => {
  const { refetch, data: salaryData } = useEmployeeSalaryQuery({ employeeId });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const handleAddDialogOpen = () => {
    setShowAddDialog(true);
  };
  const handleAddDialogClose = () => {
    setShowAddDialog(false);
  };
  return (
    <div>
      <div className="flex w-full justify-end">
        <Button
          variant="default"
          className="mb-2 h-9 rounded-md px-3 sm:h-10 sm:px-4"
          onClick={handleAddDialogOpen}
        >
          Add Salary Increment
        </Button>
      </div>
      <div>
        <SalaryIncrementTable
          data={salaryData}
          empId={employeeId}
          refetchSalaryIncrementList={refetch}
        />
      </div>
      <SalaryIncrementDialog
        open={showAddDialog}
        onOpenChange={handleAddDialogClose}
        onCloseChange={handleAddDialogClose}
        refetchSalaryIncrementList={() => refetch()}
        empId={employeeId}
      />
    </div>
  );
};

export default SalaryIncrement;
