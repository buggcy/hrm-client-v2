'use client';
import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';
import { File, FileText } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { PolicyListType } from '@/libs/validations/policies';

import { DataTableColumnHeader } from '../data-table-column-header';

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
      const fileUrl: string = row.getValue('file');
      const segments = fileUrl.split('/');
      const fileNameWithExtension = segments.pop();
      const [fileName = 'unknown', fileExtension = ''] =
        fileNameWithExtension?.split('.') || [];

      const isImageFile = (extension: string) => {
        return ['jpg', 'png', 'gif', 'jpeg'].includes(extension.toLowerCase());
      };

      const fileIcon = (extension: string) => {
        switch (extension.toLowerCase()) {
          case 'pdf':
          case 'docx':
            return <FileText className="size-4 font-normal text-gray-400" />;
          default:
            return <File className="size-4 font-normal text-gray-400" />;
        }
      };

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="size-8 overflow-hidden rounded-full border border-gray-300 bg-gray-200">
            {isImageFile(fileExtension) ? (
              <AvatarImage
                src={fileUrl}
                alt={`${fileName}`}
                className="size-full object-cover"
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
      );
    },
  },

  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      const userId = row.getValue<{
        firstName: string;
        lastName: string;
        Avatar: string;
      }>('userId');

      const firstName = userId?.firstName;
      const lastName = userId?.lastName;
      const avatar = userId?.Avatar;
      const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

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
        hour12: true,
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
        <Button variant="outline">
          <Link
            href={row.getValue('file')}
            rel="noopener noreferrer"
            target="_blank"
          >
            View
          </Link>
        </Button>
      );
    },
  },
];
