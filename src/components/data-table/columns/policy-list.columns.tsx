'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FileText } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { PolicyListType } from '@/libs/validations/policies';

import { DataTableColumnHeader } from '../data-table-column-header';

export const policyListColumns: ColumnDef<PolicyListType>[] = [
  {
    accessorKey: 'file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File" />
    ),
    cell: ({ row }) => {
      const fileUrl: string = row.getValue('file');

      return (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {fileUrl?.split('.')?.pop() === 'pdf' ? (
              <FileText className="mr-3 text-red-500" size={35} />
            ) : (
              <img
                src={fileUrl}
                alt="Document_Img"
                className="mr-3 size-8 rounded-full border border-gray-600 object-cover dark:border-gray-300"
              />
            )}
            <div>
              <div className="font-semibold text-gray-600 dark:text-white">
                {decodeURIComponent(
                  String(fileUrl)?.split('/').pop()?.split('.')[0] || '',
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {fileUrl?.split('.')?.pop()}
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
      const field = new Date(Date.parse(row.getValue('updatedAt')));
      const day = field.toLocaleDateString('en-US', { weekday: 'short' });
      const time = field.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const date = field.toDateString().slice(4);
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{day}</Badge>
          <span className="max-w-[500px] truncate">
            {date} at {time}
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
      const file = row.getValue('file');
      return (
        <Button
          variant="outline"
          onClick={() => window.open(String(file), '_blank')}
        >
          View
        </Button>
      );
    },
  },
];
