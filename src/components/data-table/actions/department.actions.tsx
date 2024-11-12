'use client';

import * as React from 'react';

import { Row } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { DepartmentListType } from '@/libs/validations/project-department';

interface DataTableRowActionsProps {
  row: Row<DepartmentListType>;
}

export function DepartmentRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const data = row.original;
  console.log(data);
  return (
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
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Pencil className="mr-2 size-4" />
              Edit Department
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem>
            <Eye className="mr-2 size-4" />
            View Department
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="mr-2 size-4" />
            Delete Department
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
    </Dialog>
  );
}
