'use client';
import React, { useEffect, useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { DataTableLoading } from '@/components/data-table/data-table-skeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useAllowLeaveListQuery,
  useEmployeePerkListQuery,
} from '@/hooks/manageLeave/useLeaveList.hook';

import { AddExtraLeaveModal } from './AddExtraLeave';
import ExtraLeaveTable from './ExtraLeaveTable';
import UpdateLeaveForm from './UpdateLeaveForm';

const EmployeeList = () => {
  const { data } = useEmployeePerkListQuery();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [modal, setModal] = useState(false);

  const {
    data: leaveData,
    error,
    isLoading,
    refetch,
  } = useAllowLeaveListQuery(selectedEmployeeId, {
    enabled: !!selectedEmployeeId,
  });

  const handleEmployeeChange = (employeeId: string) => {
    if (employeeId === 'reset') {
      setSelectedEmployeeId('');
    } else {
      setSelectedEmployeeId(employeeId);
    }
  };

  const handleClose = () => {
    setModal(false);
  };
  const handleOpen = () => {
    setModal(true);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmployeeId]);

  if (error)
    return (
      <div className="py-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <div className="mt-2 flex justify-end">
        <div className="flex w-full flex-col md:w-[300px] lg:w-[300px]">
          <form>
            <Select onValueChange={handleEmployeeChange}>
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue placeholder="Select an Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="text-sm">
                  <SelectItem value="reset">Select Employee</SelectItem>
                  {data?.map(employee => (
                    <SelectItem key={employee?.id} value={employee?.id}>
                      {employee?.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
              <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
            </Select>
          </form>
        </div>
      </div>

      {selectedEmployeeId && (
        <>
          {leaveData && (
            <div className="mt-4 flex justify-end">
              <Button size={'sm'} onClick={handleOpen}>
                Add Extra Leave
              </Button>
            </div>
          )}
          {leaveData && (
            <div className="mt-4">
              <UpdateLeaveForm
                selectedEmployeeId={selectedEmployeeId}
                CasualLeaves={leaveData?.allowedCasualLeaves}
                SickLeaves={leaveData?.allowedSickLeaves}
                AnnualLeaves={leaveData?.annualLeavesAllowed}
                refetch={refetch}
              />
            </div>
          )}
          <div className="mt-5">
            {isLoading ? (
              <DataTableLoading columnCount={4} rowCount={5} />
            ) : (
              <ExtraLeaveTable extraData={leaveData?.extraLeaves} />
            )}
          </div>
        </>
      )}
      <AddExtraLeaveModal
        open={modal}
        onCloseChange={handleClose}
        selectedEmployeeId={selectedEmployeeId}
        refetch={refetch}
      />
    </>
  );
};

export default EmployeeList;
