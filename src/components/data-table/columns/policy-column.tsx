'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FileText } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { PolicyListType } from '@/libs/validations/hr-policy';

import { PolicyListRowActions } from '../actions/policy-table.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

import { UserId } from '@/types/hr-policies.types';

export const policyColumn: ColumnDef<PolicyListType>[] = [
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
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Policy Category" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue('category')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      const userId: UserId = row.getValue('userId');
      const firstName: string = userId?.firstName;
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
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('createdAt')));
      const day = field.toLocaleDateString('en-US', { weekday: 'short' });
      const date = field.toDateString().slice(4);
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{day}</Badge>
          <span className="max-w-[500px] truncate">{date}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <PolicyListRowActions row={row} />,
  },
];
