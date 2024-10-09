import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { PerkListType } from '@/libs/validations/perk';

interface ViewPerkProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  viewData?: PerkListType | null;
}
const ViewPerk = ({ open, onCloseChange, viewData }: ViewPerkProps) => {
  return (
    <>
      {' '}
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
                      : viewData?.hrApproval === 'canceled'
                        ? 'error'
                        : 'default'
              }
            >
              {viewData?.hrApproval}
            </Badge>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-6/12">
              <p className="text-base font-bold">Perk Name</p>
            </div>
            <div className="w-6/12">
              <p className="text-gray-600 dark:text-gray-300">
                {viewData?.name}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-6/12">
              <p className="text-base font-bold">Assigned Amount</p>
            </div>
            <div className="w-6/12">
              <p className="text-gray-600 dark:text-gray-300">
                {viewData?.assignedIncrementAmount} PKR
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-6/12">
              <p className="text-base font-bold">Deducted Amount</p>
            </div>
            <div className="w-6/12">
              <p className="text-gray-600 dark:text-gray-300">
                {viewData?.assignedDecrementAmount} PKR
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-6/12">
              <p className="text-base font-bold">Applied Date</p>
            </div>
            <div className="w-6/12">
              <p className="text-gray-600 dark:text-gray-300">
                {viewData?.dateApplied
                  ? new Date(viewData.dateApplied).toDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-base font-bold">Perk Description</p>
            <p className="p-3 text-justify text-gray-600 dark:text-gray-300">
              {viewData?.description}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="ghostSecondary"
              onClick={() => onCloseChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewPerk;
