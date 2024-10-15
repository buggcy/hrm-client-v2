import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { AttendanceBreaks } from '@/libs/validations/attendance-list';

interface BreaksTableProps {
  data: AttendanceBreaks[];
}

export function BreaksTable({ data }: BreaksTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Start Time</TableHead>
          <TableHead className="text-center">End Time</TableHead>
          <TableHead className="text-center">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(breaks => {
          const startTime = new Date(breaks.Start_Break).toLocaleTimeString(
            [],
            { hour: '2-digit', minute: '2-digit' },
          );
          const endTime = new Date(breaks.End_Break).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          const startDate = new Date(breaks.Start_Break);
          const endDate = new Date(breaks.End_Break);

          const durationMs = endDate.getTime() - startDate.getTime();

          const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
          const durationMinutes = Math.floor(
            (durationMs % (1000 * 60 * 60)) / (1000 * 60),
          );
          const duration = `${durationHours}h ${durationMinutes}m`;

          return (
            <TableRow key={breaks._id}>
              <TableCell className="text-center font-medium">
                {startTime}
              </TableCell>
              <TableCell className="text-center">{endTime}</TableCell>
              <TableCell className="text-center">{duration}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
