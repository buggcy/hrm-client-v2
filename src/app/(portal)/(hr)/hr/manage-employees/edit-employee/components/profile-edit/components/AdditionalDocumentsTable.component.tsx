'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  File as FileIcon,
  FileText,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

import { AdditionalDocumentType } from '@/libs/validations/edit-employee';
import {
  addAdditionalDocument,
  deleteAdditionalDocument,
} from '@/services/hr/edit-employee.service';
import { EditEmployeeStoreType } from '@/stores/hr/edit-employee';

import AdditionalDocumentDialog, {
  additionalDocumentFormData,
} from './AdditionalDocumentDialog.component';

import { MessageErrorResponse } from '@/types';

interface AdditionalDocumentsTableProps {
  empId?: string;
  additionalDocumentsData?: AdditionalDocumentType[];
}

const AdditionalDocumentsTable = ({
  empId,
  additionalDocumentsData,
}: AdditionalDocumentsTableProps) => {
  const [tableData, setTableData] = useState<
    AdditionalDocumentType[] | undefined
  >(additionalDocumentsData ?? additionalDocumentsData);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const { editEmployeeStore } = useStores() as {
    editEmployeeStore: EditEmployeeStoreType;
  };
  const { setRefetchEditEmployeeData } = editEmployeeStore;

  const { mutate: addAdditionalDocumentData, isPending: isAdding } =
    useMutation({
      mutationFn: addAdditionalDocument,
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
        handleDialogClose();
      },
    });

  useEffect(() => {
    setTableData(additionalDocumentsData);
  }, [additionalDocumentsData]);

  const { mutate: deleteAdditionalDocumentData, isPending: isDeleting } =
    useMutation({
      mutationFn: deleteAdditionalDocument,
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
        setDeletedItems([]);
        setRefetchEditEmployeeData(true);
      },
    });

  const onSubmit = (data: additionalDocumentFormData) => {
    const formData = new FormData();
    formData.append('documents', data.document);
    addAdditionalDocumentData({
      id: empId || '',
      body: formData,
    });
  };

  useEffect(() => {
    if (deletedItems.length) {
      deleteAdditionalDocumentData({
        id: empId || '',
        body: deletedItems,
      });
    }
  }, [deleteAdditionalDocumentData, deletedItems, empId]);

  return (
    <div className="flex flex-col items-end justify-between gap-4">
      <Button onClick={handleDialogOpen} size={'sm'}>
        Add More
      </Button>
      <AdditionalDocumentDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={onSubmit}
        loading={isAdding || isDeleting}
      />

      <div className="max-h-[600px] w-full overflow-y-auto">
        {tableData && tableData?.length > 0 ? (
          <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">#</TableHead>
                  <TableHead className="text-center">Document</TableHead>
                  <TableHead className="text-center">View</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData?.map(item =>
                  item.Document.map((fileURL, i) => {
                    const segments = fileURL.split('/');
                    const fileNameWithExtension = segments.pop();
                    const [fileName = 'unknown', fileExtension = ''] =
                      fileNameWithExtension?.split('.') || [];

                    const isImageFile = (extension: string) => {
                      return ['jpg', 'png', 'gif', 'jpeg'].includes(
                        extension.toLowerCase(),
                      );
                    };

                    const fileIcon = (extension: string) => {
                      switch (extension.toLowerCase()) {
                        case 'pdf':
                        case 'docx':
                          return (
                            <FileText className="size-6 font-normal text-gray-400" />
                          );
                        default:
                          return (
                            <FileIcon className="size-6 font-normal text-gray-400" />
                          );
                      }
                    };

                    return (
                      <TableRow key={`${item._id}-${i}`}>
                        <TableCell className="text-center font-medium capitalize">
                          {i + 1}
                        </TableCell>
                        <TableCell className="text-center font-medium capitalize">
                          <div className="flex items-center space-x-2">
                            <Avatar className="size-12 overflow-hidden rounded-full border border-gray-300 p-1">
                              {isImageFile(fileExtension) ? (
                                <AvatarImage
                                  src={fileURL}
                                  alt={`${fileName}`}
                                  className="size-full rounded-full object-cover"
                                />
                              ) : (
                                <AvatarFallback className="text-xl uppercase">
                                  {fileIcon(fileExtension)}
                                </AvatarFallback>
                              )}
                            </Avatar>

                            <div className="flex flex-col">
                              <span className="max-w-[500px] truncate font-medium capitalize">
                                {fileName}
                              </span>
                              <span className="self-start text-sm text-gray-500">
                                {fileExtension.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <Link href={fileURL}>
                            <Button
                              variant="outline"
                              disabled={isAdding || isDeleting}
                            >
                              View
                            </Button>
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
                            <DropdownMenuContent
                              align="end"
                              className="w-[150px]"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={() => {
                                  setDeletedItems([fileURL]);
                                }}
                                className="text-red-600"
                                disabled={isAdding || isDeleting}
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  }),
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300">
            No Additional Documents Provided!
          </p>
        )}
      </div>
    </div>
  );
};

export default AdditionalDocumentsTable;
