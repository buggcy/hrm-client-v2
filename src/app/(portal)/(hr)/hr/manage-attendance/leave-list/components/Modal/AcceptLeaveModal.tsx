'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type AcceptProps = {
  isOpen: boolean;
  isPending: boolean;
  onSubmit: () => void;
  onOpenChange: () => void;
  leaveDistribution: {
    date: Date;
    isPaid: boolean;
    isAnnual: boolean;
  }[];
  onChange: (date: number, isPaid: boolean, isAnnual: boolean) => void;
  isAnnualLeave?: boolean;
  allowAnnual?: boolean;
  leaveDuration?: 'Full' | 'Half' | 'Quarter';
};

export default function AcceptLeaveDialog({
  isOpen,
  isPending,
  onSubmit,
  onOpenChange,
  leaveDistribution,
  onChange,
  isAnnualLeave,
  allowAnnual,
  leaveDuration,
}: AcceptProps) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="mb-4">Accept Leave Request</DialogTitle>
            <DialogDescription>
              <ScrollArea className="h-[250px] sm:h-[500px]">
                <div className="size-full p-4">
                  {leaveDistribution.map((leave, index) => (
                    <div
                      key={index}
                      className="mb-4 flex flex-row items-center justify-between"
                    >
                      <p className="flex flex-row items-center gap-2 text-base text-foreground">
                        <Badge
                          variant="outline"
                          className="flex w-[40px] items-center justify-center"
                        >
                          {leave.date.toLocaleDateString('en-US', {
                            weekday: 'short',
                          })}
                        </Badge>
                        {leave.date.toLocaleDateString('en-CA')}{' '}
                      </p>
                      {leaveDuration === 'Full' ? (
                        <Select
                          defaultValue={
                            isAnnualLeave
                              ? leave.isAnnual && leave.isPaid
                                ? 'annual'
                                : 'unpaid'
                              : leave.isPaid && leave.isAnnual
                                ? 'annual'
                                : leave.isPaid && !leave.isAnnual
                                  ? 'paid'
                                  : 'unpaid'
                          }
                          onValueChange={value =>
                            onChange(
                              index,
                              value === 'paid' || value === 'annual',
                              value === 'annual',
                            )
                          }
                        >
                          <SelectTrigger className="max-w-[170px] text-foreground">
                            <SelectValue className="text-current" />
                          </SelectTrigger>
                          <SelectContent>
                            {!isAnnualLeave && (
                              <SelectItem value="paid">Leave</SelectItem>
                            )}
                            <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                            {(isAnnualLeave || allowAnnual) && (
                              <SelectItem value="annual">
                                Annual Leave
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      ) : leaveDuration === 'Half' ? (
                        <Select
                          defaultValue={
                            isAnnualLeave
                              ? leave.isAnnual && leave.isPaid
                                ? 'annual_half'
                                : 'unpaid_half'
                              : leave.isPaid && leave.isAnnual
                                ? 'annual_half'
                                : leave.isPaid && !leave.isAnnual
                                  ? 'paid_half'
                                  : 'unpaid_half'
                          }
                          onValueChange={value =>
                            onChange(
                              index,
                              value === 'paid_half' || value === 'annual_half',
                              value === 'annual_half',
                            )
                          }
                        >
                          <SelectTrigger className="max-w-[170px] text-foreground">
                            <SelectValue className="text-current" />
                          </SelectTrigger>
                          <SelectContent>
                            {!isAnnualLeave && (
                              <SelectItem value="paid_half">
                                Half Day Leave
                              </SelectItem>
                            )}
                            <SelectItem value="unpaid_half">
                              Unpaid Half Day Leave
                            </SelectItem>
                            {(isAnnualLeave || allowAnnual) && (
                              <SelectItem value="annual_half">
                                Annual Half Day Leave
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select
                          defaultValue={
                            isAnnualLeave
                              ? leave.isAnnual && leave.isPaid
                                ? 'annual_quarter'
                                : 'unpaid_quarter'
                              : leave.isPaid && leave.isAnnual
                                ? 'annual_quarter'
                                : leave.isPaid && !leave.isAnnual
                                  ? 'paid_quarter'
                                  : 'unpaid_quarter'
                          }
                          onValueChange={value =>
                            onChange(
                              index,
                              value === 'paid_quarter' ||
                                value === 'annual_quarter',
                              value === 'annual_quarter',
                            )
                          }
                        >
                          <SelectTrigger className="max-w-[170px] text-foreground">
                            <SelectValue className="text-current" />
                          </SelectTrigger>
                          <SelectContent>
                            {!isAnnualLeave && (
                              <SelectItem value="paid_quarter">
                                Quarter Day Leave
                              </SelectItem>
                            )}
                            <SelectItem value="unpaid_quarter">
                              Unpaid Quarter Day Leave
                            </SelectItem>
                            {(isAnnualLeave || allowAnnual) && (
                              <SelectItem value="annual_quarter">
                                Annual Quarter Day Leave
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="default"
              onClick={onSubmit}
              disabled={isPending}
            >
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
