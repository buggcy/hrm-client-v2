import React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { TransformedPerkData } from '@/libs/validations/perk';

interface ViewPerkProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  viewData?: TransformedPerkData | null;
}
const ViewPerk = ({ open, onCloseChange, viewData }: ViewPerkProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`View Perk`}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <Badge
              className="capitalize"
              variant={
                viewData?.hrApproval === 'approved'
                  ? 'success'
                  : viewData?.hrApproval === 'rejected'
                    ? 'destructive'
                    : viewData?.hrApproval === 'pending'
                      ? 'progress'
                      : 'default'
              }
            >
              {viewData?.hrApproval}
            </Badge>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-6/12">
              <p className="text-sm font-semibold">Perk Name</p>
            </div>
            <div className="w-6/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {viewData?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-6/12">
              <p className="text-sm font-semibold">Assigned Amount</p>
            </div>
            <div className="w-6/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {viewData?.assignedIncrementAmount} PKR
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-6/12">
              <p className="text-sm font-semibold">Deducted Amount</p>
            </div>
            <div className="w-6/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {viewData?.incrementAmount} PKR
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-6/12">
              <p className="text-sm font-semibold">Applied Date</p>
            </div>
            <div className="w-6/12">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {viewData?.dateApplied
                  ? (() => {
                      const field = new Date(Date.parse(viewData?.dateApplied));
                      const day = field.toLocaleDateString('en-US', {
                        weekday: 'short',
                      });
                      const date = field.toDateString().slice(4);
                      return (
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{day}</Badge>
                          <span className="max-w-[500px] truncate">{date}</span>
                        </div>
                      );
                    })()
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-sm font-semibold">Perk Description</p>
            <p className="text-justify indent-16 text-gray-600 dark:text-gray-300">
              {viewData?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewPerk;
