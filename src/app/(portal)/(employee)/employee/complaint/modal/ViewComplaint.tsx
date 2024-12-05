import React from 'react';

import { Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ComplaintListType } from '@/libs/validations/complaint';

interface ViewProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  data?: ComplaintListType | null;
}
const ViewComplaint = ({ open, onCloseChange, data }: ViewProps) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onCloseChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`View Complaint`}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <Badge
              className="capitalize"
              variant={
                data?.status === 'Resolved'
                  ? 'success'
                  : data?.status === 'Pending'
                    ? 'progress'
                    : data?.status === 'Canceled'
                      ? 'error'
                      : 'default'
              }
            >
              {data?.status}
            </Badge>
          </div>
          {data?.document && (
            <div className="flex flex-row justify-between">
              <div className="w-5/12">
                <p className="text-sm font-semibold">Proof Document</p>
              </div>
              <div className="w-7/12">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {typeof data?.document === 'string' &&
                            decodeURIComponent(
                              String(data?.document).split('/').pop() || '',
                            )}
                          <Eye
                            className="ml-2 inline cursor-pointer text-primary/80 hover:text-primary"
                            onClick={() =>
                              data?.document &&
                              window.open(String(data?.document), '_blank')
                            }
                            size={18}
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Click to Preview Document</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col justify-between">
            <p className="text-sm font-semibold">Complaint</p>
            <p className="text-justify indent-6 text-gray-600 dark:text-gray-300">
              {data?.complaint}
            </p>
          </div>
          {data?.status === 'Resolved' && (
            <>
              <div className="flex flex-col justify-between">
                <p className="text-sm font-semibold">Complaint Feedback</p>
                <p className="text-justify indent-6 text-gray-600 dark:text-gray-300">
                  {data?.complaintFeedback}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewComplaint;
