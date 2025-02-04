import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import { DesignationType } from '@/libs/validations/edit-employee';

import { AddEmployeeDesignationDialog } from './components/AddEmployeeDesignation.component';
import EmployeeDesignationTable from './components/EmployeeDesignationTable.component';

interface IEditDesignationProps {
  employeeId: string;
  designationData?: DesignationType[];
  refetchDesignationList: () => void;
}

const EditDesignation = ({
  employeeId,
  designationData,
  refetchDesignationList,
}: IEditDesignationProps) => {
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
          className="mb-2"
          size={'sm'}
          onClick={handleAddDialogOpen}
        >
          Add Designation
        </Button>
      </div>
      <div>
        <EmployeeDesignationTable
          empId={employeeId}
          data={designationData}
          refetchSalaryIncrementList={refetchDesignationList}
        />
      </div>
      <AddEmployeeDesignationDialog
        open={showAddDialog}
        onOpenChange={handleAddDialogClose}
        onCloseChange={handleAddDialogClose}
        refetchDesignationList={refetchDesignationList}
        empId={employeeId}
      />
    </div>
  );
};

export default EditDesignation;
