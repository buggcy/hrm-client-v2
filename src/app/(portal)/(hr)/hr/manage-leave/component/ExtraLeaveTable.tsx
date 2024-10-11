import React, { FunctionComponent } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ExtraLeave } from '@/types/leave-history.types';
interface ExtraLeaveProps {
  extraData?: ExtraLeave[];
}
const ExtraLeaveTable: FunctionComponent<ExtraLeaveProps> = ({
  extraData = [],
}) => {
  return (
    <>
      <div className="overflow-x-auto">
        <h5>Extra Leaves</h5>
        <Table className="mb-2">
          <TableHeader>
            <TableRow>
              <TableHead>Leave Name</TableHead>
              <TableHead>Leave Allowed</TableHead>
              <TableHead>Leave Taken</TableHead>
              <TableHead>Leave For Month</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extraData?.length > 0 ? (
              extraData?.map((leave, index) => (
                <TableRow key={index}>
                  <TableCell>{leave.title}</TableCell>
                  <TableCell>{leave.leavesAllowed}</TableCell>
                  <TableCell>{leave.leavesTaken}</TableCell>
                  <TableCell>
                    {new Date(`${leave.year}-${leave.month}-01`).toLocaleString(
                      'en-US',
                      {
                        month: 'long',
                        year: 'numeric',
                      },
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No Extra Leave Available!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Extra Leaves</TableCell>
              <TableCell className="text-right">{extraData?.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
};

export default ExtraLeaveTable;
