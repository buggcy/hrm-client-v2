'use client';

import { ColumnDef } from '@tanstack/react-table';

import { hrStatus_options } from '@/components/filters';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { HrEventsListType } from '@/libs/validations/employee';

import { HrEventsListRowActions } from '../actions/hrEvents-list.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const hrEventsColumns: ColumnDef<HrEventsListType>[] = [
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
    accessorKey: 'Event_Name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Name" />
    ),
    cell: ({ row }) => {
      const basicSalary = row.getValue('Event_Name');
      if (
        typeof basicSalary === 'string' ||
        typeof basicSalary === 'undefined'
      ) {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue('Event_Name')}
            </span>
          </div>
        );
      }
    },
  },
  {
    accessorKey: 'Event_Start',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('Event_Start')));
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
    accessorKey: 'Event_End',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('Event_End')));
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
    accessorKey: 'Event_Type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Type" />
    ),
    cell: ({ row }) => {
      const eventType = row.getValue('Event_Type');
      let displayText;

      if (typeof eventType === 'string' || typeof eventType === 'undefined') {
        displayText = eventType === 'company' ? 'Non Holiday' : 'Holiday';
      }

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {displayText}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: 'hrId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Organized By" />
    ),
    cell: ({ row }) => {
      const taxAmount = row.getValue('hrId');
      if (typeof taxAmount === 'string' || typeof taxAmount === 'undefined') {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue('hrId')}
            </span>
          </div>
        );
      }
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
    cell: ({ row }) => <HrEventsListRowActions row={row} />,
  },
];
