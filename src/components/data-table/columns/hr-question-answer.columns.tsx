'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import { QuestionAnswerType } from '@/libs/validations/hr-feedback';

import { QuestionAnswerRowActions } from '../actions/hr-question-answer.actions';
import { DataTableColumnHeader } from '../data-table-column-header';

export const hrQuestionAnswerColumns: ColumnDef<QuestionAnswerType>[] = [
  {
    accessorKey: 'questionText',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Question" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('questionText')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'answerCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Answer Count" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('answerCount')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const field = new Date(Date.parse(row.getValue('timestamp')));
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <QuestionAnswerRowActions row={row} />,
  },
];
