'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import { EduEpxDialog } from '@/app/(authentication)/auth/register/components/EduExpDialg';
import { EducationExperienceType as EduExpType } from '@/app/(authentication)/auth/register/components/VerifyCodeForm';
import { EducationExperienceType } from '@/libs/validations/edit-employee';
import {
  addEducationExperience,
  deleteEducationExperience,
  updateEducationExperience,
} from '@/services/hr/edit-employee.service';
import { EditEmployeeStoreType } from '@/stores/hr/edit-employee';

import { MessageErrorResponse } from '@/types';

interface EducationExperiencesTableProps {
  empId?: string;
  eduExpData?: EducationExperienceType[];
}

const EducationExperienceTable = ({
  empId,
  eduExpData,
}: EducationExperiencesTableProps) => {
  const [tableData, setTableData] = useState<
    EducationExperienceType[] | undefined
  >(eduExpData ?? eduExpData);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<EduExpType | null>(null);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditingItem(null);
    setDialogOpen(false);
  };

  const { editEmployeeStore } = useStores() as {
    editEmployeeStore: EditEmployeeStoreType;
  };
  const { setRefetchEditEmployeeData } = editEmployeeStore;

  const { mutate: addEducationExperienceData, isPending: isAdding } =
    useMutation({
      mutationFn: addEducationExperience,
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description: err?.response?.data?.message || 'Error on adding data!',
          variant: 'error',
        });
      },
      onSuccess: response => {
        toast({
          title: 'Success',
          description: response?.message || 'Data added successfully!',
          variant: 'success',
        });
        setRefetchEditEmployeeData(true);
      },
    });

  const { mutate: updateEducationExperienceData, isPending: isUpdating } =
    useMutation({
      mutationFn: updateEducationExperience,
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description:
            err?.response?.data?.message || 'Error on updating data!',
          variant: 'error',
        });
      },
      onSuccess: response => {
        toast({
          title: 'Success',
          description: response?.message || 'Data updated successfully!',
          variant: 'success',
        });
        setRefetchEditEmployeeData(true);
      },
    });

  useEffect(() => {
    setTableData(eduExpData);
  }, [eduExpData]);

  const { mutate: deleteEducationExperienceData, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteEducationExperience,
      onError: (err: AxiosError<MessageErrorResponse>) => {
        toast({
          title: 'Error',
          description:
            err?.response?.data?.message || 'Error on deleting data!',
          variant: 'error',
        });
      },
      onSuccess: response => {
        toast({
          title: 'Success',
          description: response?.message || 'Data deleted successfully!',
          variant: 'success',
        });
        setRefetchEditEmployeeData(true);
      },
    });

  const handleEditClick = (rowData: EducationExperienceType) => {
    const startDate = new Date(rowData.Start_Date);
    const endDate = new Date(rowData.End_Date);
    const row = {
      user_id: empId || '',
      _id: rowData._id,
      type: rowData.type,
      Start_Date: startDate,
      End_Date: endDate,
      Institute: rowData.Institute,
      Position: rowData.Position,
      referenceNumber: rowData.referenceNumber,
      Document: rowData.Document,
      documentType: rowData.documentType,
    };
    setEditingItem(row);
    handleDialogOpen();
  };

  const handleExperienceSubmit = (data: EduExpType) => {
    if (editingItem) {
      if (data.Document instanceof File) {
        const formData = new FormData();
        formData.append('documents', data.Document);
        const newData = [
          {
            type: data.type,
            documentType: data.documentType,
            referenceNumber: data.referenceNumber,
            Start_Date: data.Start_Date.toISOString(),
            End_Date: data.End_Date.toISOString(),
            Institute: data.Institute,
            Position: data.Position,
            _id: data._id,
            user_id: empId || '',
            isDeleted: false,
          },
        ];
        formData.append('educationExperienceData', JSON.stringify(newData));
        addEducationExperienceData({ id: empId || '', body: formData });
      } else {
        const updatedExperiences = tableData?.map(
          (exp: EducationExperienceType) => {
            const startDate = data.Start_Date.toDateString();
            const endDate = data.End_Date.toDateString();
            const dataId = data._id;
            const expId = exp._id;
            return dataId === expId
              ? {
                  ...data,
                  Start_Date: startDate,
                  End_Date: endDate,
                  __v: 0,
                  isDeleted: false,
                  _id: data._id || '',
                  Document: (data.Document as string) || '',
                }
              : exp;
          },
        );
        setTableData(updatedExperiences);
        setIsUpdated(true);
      }
    } else {
      const formData = new FormData();
      formData.append('documents', data.Document);
      const newData = [
        {
          type: data.type,
          documentType: data.documentType,
          referenceNumber: data.referenceNumber,
          Start_Date: data.Start_Date.toLocaleDateString('en-CA'),
          End_Date: data.End_Date.toLocaleDateString('en-CA'),
          Institute: data.Institute,
          Position: data.Position,
        },
      ];
      formData.append('educationExperienceData', JSON.stringify(newData));
      addEducationExperienceData({ id: empId || '', body: formData });
    }
  };

  useEffect(() => {
    if (isUpdated) {
      updateEducationExperienceData({ id: empId || '', body: tableData });
      setIsUpdated(false);
    }
  }, [updateEducationExperienceData, isUpdated, empId, tableData]);

  useEffect(() => {
    if (deletedItems.length > 0) {
      deleteEducationExperienceData({ id: empId || '', body: deletedItems });
    }
  }, [deleteEducationExperienceData, deletedItems, empId]);

  return (
    <>
      <div className="flex flex-col items-end justify-between gap-4">
        <Button
          className="w-fit"
          size={'sm'}
          onClick={handleDialogOpen}
          disabled={isAdding || isDeleting || isUpdating}
        >
          Add More
        </Button>
      </div>
      {tableData && tableData?.length > 0 ? (
        <ScrollArea className="mt-2 w-full whitespace-nowrap rounded-md border md:w-[1070px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Start Date</TableHead>
                <TableHead className="text-center">End Date</TableHead>
                <TableHead className="text-center">Company/Institute</TableHead>
                <TableHead className="text-center">Position/Degree</TableHead>
                <TableHead className="text-center">Reference Number</TableHead>
                <TableHead className="text-center">Document Type</TableHead>
                <TableHead className="text-center">Document</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData?.map(exp => {
                const startDateStr = new Date(
                  exp.Start_Date as string | number | Date,
                ).toDateString();
                const startDay = startDateStr.split(' ')[0];
                const startDate = startDateStr.split(' ').slice(1).join(' ');
                const endDateStr = new Date(
                  exp.End_Date as string | number | Date,
                ).toDateString();
                const endDay = endDateStr.split(' ')[0];
                const endDate = endDateStr.split(' ').slice(1).join(' ');
                return (
                  <TableRow key={exp._id}>
                    <TableCell className="text-center font-medium capitalize">
                      {exp.type}
                    </TableCell>
                    <TableCell className="text-nowrap text-center">
                      <Badge
                        variant="outline"
                        className="hidden sm:inline-block"
                      >
                        {startDay}
                      </Badge>{' '}
                      {startDate}
                    </TableCell>
                    <TableCell className="text-nowrap text-center">
                      <Badge
                        variant="outline"
                        className="hidden sm:inline-block"
                      >
                        {endDay}
                      </Badge>{' '}
                      {endDate}
                    </TableCell>
                    <TableCell className="text-center capitalize">
                      {exp.Institute}
                    </TableCell>
                    <TableCell className="text-center capitalize">
                      {exp.Position}
                    </TableCell>
                    <TableCell className="text-center">
                      {exp.referenceNumber || ''}
                    </TableCell>
                    <TableCell className="text-center">
                      {exp.documentType || ''}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={exp.Document}>
                        <Button variant="outline">View</Button>
                      </Link>
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
                              handleEditClick(exp);
                            }}
                          >
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setTableData(
                                tableData?.filter(item => item._id !== exp._id),
                              );
                              setDeletedItems([...deletedItems, exp._id]);
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
            <EduEpxDialog
              open={dialogOpen}
              onOpenChange={handleDialogClose}
              onCloseChange={handleDialogClose}
              handleExperienceSubmit={handleExperienceSubmit}
              editingItem={editingItem}
              userId={empId || ''}
            />
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No Education & Experience Provided!
        </p>
      )}
    </>
  );
};

export default EducationExperienceTable;
