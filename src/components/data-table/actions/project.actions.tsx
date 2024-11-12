'use client';

import * as React from 'react';

import { Row } from '@tanstack/react-table';
import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  XCircle,
} from 'lucide-react';

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

import { ProjectListType } from '@/libs/validations/project-department';

interface DataTableRowActionsProps {
  row: Row<ProjectListType>;
}

export function ProjectRowActions({ row }: DataTableRowActionsProps) {
  const [dialogContent] = React.useState<React.ReactNode | null>(null);
  const data = row.original;
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
              Edit Project
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem>
            {data?.isActive === true ? (
              <XCircle className="mr-2 size-4" />
            ) : (
              <CheckCircle2 className="mr-2 size-4" />
            )}
            {data?.isActive === true ? 'Inactive' : 'Active'} Project
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Eye className="mr-2 size-4" />
            View Project
          </DropdownMenuItem>

          <DropdownMenuItem className="text-red-600">
            <Trash2 className="mr-2 size-4" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
    </Dialog>
  );
}
