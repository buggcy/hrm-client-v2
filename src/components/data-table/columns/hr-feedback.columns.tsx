'use client';

import { ColumnDef } from '@tanstack/react-table';

import { hrStatus_options } from '@/components/filters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { FeedbackType } from '@/libs/validations/hr-feedback';

import { FeedbackRowActions } from '../actions/hr-feedback.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const hrFeedbackColumns: ColumnDef<FeedbackType>[] = [
  {
    accessorKey: 'feedbackTitle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Feedback Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('feedbackTitle')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'feedbackCategory',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Feedback Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('feedbackCategory')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'hr',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated by" />
    ),
    cell: ({ row }) => {
      const firstName = row.original?.hr?.firstName;
      const lastName = row.original?.hr?.lastName;
      const avatar = row.original?.hr?.Avatar;
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
    accessorKey: 'questions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Feedback Questions" />
    ),
    cell: ({ row }) => {
      const questions = row.getValue('questions');
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {Array.isArray(questions) ? questions?.length : 0}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('startDate')));
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
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('endDate')));
      const day = field.toLocaleDateString('en-US', { weekday: 'short' });
      const date = field.toDateString().slice(4);
      const isContinue = row.original.isContinue;
      return (
        <div className="flex items-center space-x-2">
          {isContinue === true ? (
            <span className="max-w-[500px] truncate">{'Continue'}</span>
          ) : (
            <>
              <Badge variant="outline">{day}</Badge>
              <span className="max-w-[500px] truncate">{date}</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'isEnabled',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isEnabled = row.getValue('isEnabled');
      const statusOption = hrStatus_options.find(
        option => option.value === (isEnabled ? 'enabled' : 'disabled'),
      );

      if (!statusOption) {
        return null;
      }

      const variant = isEnabled ? 'success' : 'destructive';

      return (
        <div className="flex items-center space-x-2">
          <Badge variant={variant}>{statusOption.label}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const isEnabled = row.getValue(id);
      const statusValue = isEnabled ? 'enabled' : 'disabled';
      return value.includes(statusValue);
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <FeedbackRowActions row={row} />,
  },
];
