'use client';
import React from 'react';

import { EyeIcon, FileText, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { AdditionalDocuments } from '@/types/employee.types';

interface AdditionalTabsProps {
  additionalDocuments: AdditionalDocuments[];
}
const AdditionalTab: React.FC<AdditionalTabsProps> = ({
  additionalDocuments,
}) => {
  return (
    <>
      {additionalDocuments?.length > 0 ? (
        <Table className="my-2 min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Documents</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {additionalDocuments?.map((documentGroup, index) =>
              documentGroup?.Document?.map((documentUrl, docIndex) => (
                <TableRow key={`${index}-${docIndex}`}>
                  <TableCell className="w-[90%] p-2">
                    <div className="flex items-center">
                      {documentUrl?.split('.')?.pop() === 'pdf' ? (
                        <FileText className="mr-3 text-red-500" size={35} />
                      ) : (
                        <img
                          src={documentUrl}
                          alt="Document_Img"
                          className="mr-3 size-8 rounded-full border border-gray-300 object-cover"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">
                          {decodeURIComponent(
                            String(documentUrl)
                              ?.split('/')
                              .pop()
                              ?.split('.')[0] || '',
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {documentUrl?.split('.')?.pop()}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-2 text-right align-middle">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex size-8 p-0 data-[state=open]:bg-muted"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DialogTrigger
                            asChild
                            onClick={() =>
                              window.open(String(documentUrl), '_blank')
                            }
                          >
                            <DropdownMenuItem>
                              <EyeIcon className="mr-2 size-4" />
                              View
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </Dialog>
                  </TableCell>
                </TableRow>
              )),
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total Records</TableCell>
              <TableCell className="text-right">
                {additionalDocuments?.length}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <p className="mt-3 text-center text-gray-600">
          Currently No Additional Documents Available!
        </p>
      )}
    </>
  );
};

export default AdditionalTab;
