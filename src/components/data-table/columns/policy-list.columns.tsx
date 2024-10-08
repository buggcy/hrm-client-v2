'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

import { PolicyListType } from '@/libs/validations/policies';

import { DataTableColumnHeader } from '../data-table-column-header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, FileImage, File } from 'lucide-react';

export const policyListColumns: ColumnDef<PolicyListType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File" />
    ),
    cell: ({ row }) => {
      const fileUrl = row.getValue("file");
      const segments = fileUrl.split("/");
      const fileNameWithExtension = segments.pop();
      const [fileName, fileExtension] = fileNameWithExtension.split('.');
  
      const fileIcon = (extension: string) => {
        switch(extension.toLowerCase()) {
          case 'pdf':
          case 'docx':
            return <FileText className="h-5 w-5" />;
          case 'jpg':
          case 'png':
          case 'gif':
          case 'jpeg':
            return <FileImage className="h-5 w-5" />;
          default:
            return <File className="h-5 w-5" />;
        }
      };
  
      return (
        <div className="flex flex-col items-start space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{fileIcon(fileExtension)}</span>
            <div className="flex flex-col">
              <span className="max-w-[500px] truncate font-medium capitalize">
                {fileName}
              </span>
              <span className="text-sm text-gray-500 self-start">
                {fileExtension.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      const userId = row.getValue("userId");
      const firstName: string = userId?.firstName
      const first = firstName;
      const lastName = userId?.lastName;
      const avatar = userId?.Avatar;
      const initials = `${first?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="size-8">
            <AvatarImage src={avatar || ''} alt={`${firstName} ${lastName}`} />
            <AvatarFallback className="uppercase">{initials}</AvatarFallback>
          </Avatar>

          <span className="max-w-[500px] truncate font-medium capitalize">
            {`${firstName} ${lastName}`}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Update" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true
      }).format(date);
  
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedDate}
          </span>
        </div>
      );
    },
  },
  

  {
    accessorKey: 'file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      return (
        <Button variant='outline'>
          <Link href={row.getValue("file")} rel="noopener noreferrer" target="_blank">View</Link>
        </Button>
      );
    },
  },
];
