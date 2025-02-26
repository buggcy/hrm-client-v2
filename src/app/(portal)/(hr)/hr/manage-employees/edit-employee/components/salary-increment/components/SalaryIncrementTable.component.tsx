'use client';

import React, { useEffect, useState } from 'react';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { SalaryType } from '@/libs/validations/edit-employee';
import { deleteEmployeeSalaryIncrementData } from '@/services/hr/edit-employee.service';

import { SalaryIncrementDialog } from './SalaryIncrementDialog.component';

interface SalaryIncrementTableProps {
  empId?: string;
  data?: SalaryType;
  refetchSalaryIncrementList: () => void;
}

const SalaryIncrementTable = ({
  empId,
  data,
  refetchSalaryIncrementList,
}: SalaryIncrementTableProps) => {
  const [refetchData, setRefetchData] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIncrementData, setSelectedIncrementData] = useState({
    incrementId: '',
    incrementTitle: '',
    incrementAmount: 0,
    desiredSalary: 0,
  });
  const [toBeDeletedId, setToBeDeletedId] = useState('');

  const handleEditDialogOpen = (id: string) => {
    const increment = data?.incrementRecords.find(
      increment => increment._id === id,
    );
    setSelectedIncrementData({
      incrementId: id,
      incrementTitle: increment?.title || '',
      incrementAmount: increment?.amount || 0,
      desiredSalary: increment?.desiredSalary || 0,
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };
  const handleDeleteDialogOpen = (id: string) => {
    setToBeDeletedId(id);
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
      {data?.incrementRecords && (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Desired Salary</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.incrementRecords?.length > 0 ? (
                data?.incrementRecords.map(increment => {
                  const wholeDate = new Date(
                    increment.date as string | number | Date,
                  ).toDateString();
                  const day = wholeDate.split(' ')[0];
                  const date = wholeDate.split(' ').slice(1).join(' ');
                  return (
                    <TableRow key={increment._id}>
                      <TableCell className="text-center font-medium">
                        {increment.title}
                      </TableCell>
                      <TableCell className="text-center">
                        {increment.amount}
                      </TableCell>
                      <TableCell className="text-center">
                        {increment.desiredSalary || '0'}
                      </TableCell>
                      <TableCell className="flex justify-center gap-2 text-center">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{day}</Badge>
                          <span className="max-w-[500px] truncate">{date}</span>
                        </div>
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
                          <DropdownMenuContent
                            align="end"
                            className="w-[150px]"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => {
                                handleEditDialogOpen(increment._id);
                              }}
                            >
                              <Pencil className="mr-2 size-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                handleDeleteDialogOpen(increment._id);
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
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-gray-500 dark:text-gray-300"
                  >
                    No Salary Increment Available!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total Records</TableCell>
                <TableCell className="text-right">
                  {data?.incrementRecords?.length}
                </TableCell>
              </TableRow>
            </TableFooter>
            <SalaryIncrementDialog
              open={editDialogOpen}
              onOpenChange={handleEditDialogClose}
              onCloseChange={handleEditDialogClose}
              refetchSalaryIncrementList={() => refetchSalaryIncrementList()}
              empId={empId}
              editData={{
                incrementId: selectedIncrementData.incrementId,
                incrementTitle: selectedIncrementData.incrementTitle,
                incrementAmount: selectedIncrementData.incrementAmount,
                desiredSalary: selectedIncrementData?.desiredSalary,
              }}
            />
            <DeleteDialog
              id={toBeDeletedId || ''}
              isOpen={showDeleteDialog}
              showActionToggle={setShowDeleteDialog}
              mutationFunc={deleteEmployeeSalaryIncrementData}
              setRefetch={setRefetchData}
            />
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </>
  );
};

export default SalaryIncrementTable;
