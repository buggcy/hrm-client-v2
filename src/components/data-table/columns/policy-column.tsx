'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

import { PolicyType } from '@/libs/validations/hr-policy';

import { PolicyListRowActions } from '../actions/policy-table.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

import { UserId } from '@/types/hr-policies.types';

export const policyColumn: ColumnDef<PolicyType>[] = [
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
      <DataTableColumnHeader column={column} title="Policy File" />
    ),
    cell: ({ row }) => {
      const fileUrl: string = row.getValue('file');
      const segments = fileUrl?.split('/');
      const fileNameWithExtension = segments?.pop() || '';
      const [fileName, fileExtension] = fileNameWithExtension.split('.');

      const isImage = (fileExtension: string) => {
        return ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(
          fileExtension.toLowerCase(),
        );
      };
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="size-10">
            {isImage(fileExtension) && fileUrl ? (
              <AvatarImage src={fileUrl} alt={fileName} />
            ) : (
              <AvatarFallback>{fileExtension.toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="max-w-[500px] truncate font-medium capitalize">
              {fileName}
            </span>
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
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue('createdAt')).toDateString();
      return <div>{createdAt}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <PolicyListRowActions row={row} />,
  },
];
