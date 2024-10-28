'use client';
import React, { useState } from 'react';

import { MonthPickerComponent } from '@/components/MonthPicker';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ModalProps {
  open: boolean;
  onCloseChange: (open: boolean) => void;
  fireId: string;
}

export function FiredModal({ open, onCloseChange, fireId }: ModalProps) {
  console.log('employee: ', fireId);
  const [isImmediate, setIsImmediate] = useState(false);
  const [date, setDate] = useState(new Date());
  const setDateValue = (date: Date | null) => {
    setDate(date || new Date());
  };
  const initialDate = date;
  const handleCheckboxChange = (checked: boolean) => {
    setIsImmediate(checked);
    console.log('checked', checked);
  };
  console.log('check', isImmediate);
  return (
    <Dialog open={open} onOpenChange={onCloseChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{'Fire Employee'}</DialogTitle>
        </DialogHeader>

        <form className="grid gap-8 py-4">
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="title" className="mb-2 text-left">
                Title <span className="text-red-600">*</span>
              </Label>

              <Input type="text" id="title" placeholder="Please Enter Title" />
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="reason" className="mb-2 text-left">
                Reason <span className="text-red-600">*</span>
              </Label>

              <Input
                type="text"
                id="reason"
                placeholder="Please Enter Reason"
              />
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="month" className="mb-2 text-left">
                Applied Date <span className="text-red-600">*</span>
              </Label>
              <MonthPickerComponent
                setDateValue={setDateValue}
                initialDate={initialDate}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <Label htmlFor="Description" className="mb-2 text-left">
              Description
            </Label>
            <Input id="Description" placeholder="Description" />
          </div>
          <div className="flex flex-row gap-1">
            <Checkbox
              checked={isImmediate}
              aria-label="Immediate Termination"
              className="translate-y-[2px]"
              onCheckedChange={handleCheckboxChange}
            />
            <Label className="mt-1">Immediate</Label>
          </div>
          <DialogFooter>
            <Button type="submit">Apply</Button>
            <Button
              variant="ghostSecondary"
              type="button"
              onClick={() => onCloseChange(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
