'use client';
import React, { useState } from 'react';

import moment from 'moment';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useReadResignationRecordQuery } from '@/hooks/employee/useUnApprovedEmployee.hook';

import { ResignationModal } from '../../profile/components/Modal/ResignationModal';

import { User } from '@/types/user.types';
interface UserProps {
  user: User;
}

const ResignationTab: React.FC<UserProps> = ({ user }) => {
  const userId = user?.id;

  const { data } = useReadResignationRecordQuery(userId, {
    enabled: !!userId,
  });

  const [modal, setModal] = useState<boolean>(false);
  const handleResignation = () => {
    setModal(true);
  };
  const handleClose = () => {
    setModal(false);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="mb-2 mt-4 text-base font-normal dark:text-white">
          Apply For Resignation
        </div>
        {user?.roleId === 2 && (
          <Button
            variant="default"
            size={'sm'}
            className="mt-3"
            onClick={handleResignation}
            disabled={data?.data && data?.data?.length > 0 ? true : false}
          >
            Apply Resignation
          </Button>
        )}
      </div>
      <div className="mt-4 overflow-x-auto">
        {data?.data && data?.data?.length > 0 ? (
          <Table className="mb-2">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((resignation, index) => (
                <TableRow key={index}>
                  <TableCell>{resignation.title || '-'}</TableCell>
                  <TableCell>{resignation.reason || '-'}</TableCell>
                  <TableCell>{resignation.description || '-'}</TableCell>
                  <TableCell>
                    {moment(
                      resignation?.appliedDate as string | number | Date,
                    ).format('ddd MMM DD YYYY')}{' '}
                    -{' '}
                    {resignation?.type === 'immediate' &&
                    resignation?.immedaiteDate
                      ? moment(
                          resignation?.immedaiteDate as string | number | Date,
                        ).format('ddd MMM DD YYYY')
                      : moment(
                          resignation?.assignedDate as string | number | Date,
                        ).format('ddd MMM DD YYYY')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={
                        resignation.isApproved === 'Approved'
                          ? 'success'
                          : resignation.isApproved === 'Rejected'
                            ? 'destructive'
                            : resignation.isApproved === 'Pending'
                              ? 'progress'
                              : 'default'
                      }
                    >
                      {resignation.isApproved}
                    </Badge>
                  </TableCell>
                  {resignation.type ? (
                    <TableCell>{resignation.type}</TableCell>
                  ) : (
                    <TableCell>As per company policy</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="mt-4 text-center text-xs">
            No resignation application has been submitted yet.
          </div>
        )}
      </div>

      <ResignationModal open={modal} onCloseChange={handleClose} />
    </>
  );
};

export default ResignationTab;
