'use client';

import React, { useEffect, useState } from 'react';

import { MoreHorizontal, Trash2 } from 'lucide-react';

import DeleteDialog from '@/components/modals/delete-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DesignationType } from '@/libs/validations/edit-employee';
import { deleteEmployeeDesignationData } from '@/services/hr/edit-employee.service';
import { cn } from '@/utils';

interface IEmployeeDesignationTableProps {
  empId?: string;
  data?: DesignationType[];
  refetchSalaryIncrementList: () => void;
}

const EmployeeDesignationTable = ({
  empId,
  data,
  refetchSalaryIncrementList,
}: IEmployeeDesignationTableProps) => {
  const [refetchData, setRefetchData] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState('');

  const handleDeleteDialogOpen = (id: string) => {
    const jointId = `${empId}-${id}`;
    setToBeDeletedId(jointId);
    setShowDeleteDialog(true);
  };

  useEffect(() => {
    if (refetchData) {
      refetchSalaryIncrementList();
      setRefetchData(false);
    }
  }, [refetchData, refetchSalaryIncrementList]);
  return (
    <>
      {data && data?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Designation</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice()
              .reverse()
              .map(designation => {
                const wholeDate = new Date(
                  designation.timestamp as string | number | Date,
                ).toDateString();
                const day = wholeDate.split(' ')[0];
                const date = wholeDate.split(' ').slice(1).join(' ');
                return (
                  <TableRow
                    key={designation._id}
                    className={cn(
                      designation.isCurrent ? 'bg-foreground/10' : '',
                    )}
                  >
                    <TableCell className="text-center font-medium">
                      {designation.position}
                    </TableCell>
                    <TableCell className="flex justify-center gap-2 text-center">
                      <Badge variant="outline" className="hidden sm:block">
                        {day}
                      </Badge>{' '}
                      {date}
                    </TableCell>
                    <TableCell className="p-0 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className="mx-auto">
                          <Button
                            variant="ghost"
                            className="flex size-8 p-0 data-[state=open]:bg-muted"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => {
                              handleDeleteDialogOpen(designation._id);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <DeleteDialog
            id={toBeDeletedId || ''}
            isOpen={showDeleteDialog}
            showActionToggle={setShowDeleteDialog}
            mutationFunc={deleteEmployeeDesignationData}
            setRefetch={setRefetchData}
          />
        </Table>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No Designation Available!
        </p>
      )}
    </>
  );
};

export default EmployeeDesignationTable;
