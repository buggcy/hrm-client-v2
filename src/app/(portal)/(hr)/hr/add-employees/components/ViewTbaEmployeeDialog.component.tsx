'use client';

import React from 'react';

import { Calendar, DollarSign, Mail, Phone, User } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { EmployeeListType } from '@/libs/validations/employee';

interface ViewTbaEmployeeDialogProps {
  data: EmployeeListType;
  open: boolean;
  onOpenChange: () => void;
  onCloseChange: () => void;
}

export function ViewTbaEmployeeDialog({
  data,
  open,
  onOpenChange,
}: ViewTbaEmployeeDialogProps) {
  const firstName = data?.firstName;
  const lastName = data?.lastName;

  const personalEmail = data?.email;
  const companyEmail = data?.companyEmail;
  const contact = data?.contactNo;
  const basicSalary = data?.basicSalary;
  const joiningDate = data?.Joining_Date
    ? new Date(data?.Joining_Date).toLocaleDateString()
    : '';
  const designation = data?.Designation;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="max-w-[500px] truncate font-medium capitalize">
              {`${firstName} ${lastName}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Mail className="mr-2" size={16} />
              <span>Personal Email</span>
            </div>
            <span className="ml-4">{personalEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Mail size={16} className="mr-2" color="hsl(var(--primary))" />
              <span>Company Email</span>
            </div>
            <span className="pl-1">{companyEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Phone size={16} color="hsl(var(--chart-1))" className="mr-2" />{' '}
              <span>Contact No</span>
            </div>
            <span className="ml-4">{contact}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <DollarSign
                size={16}
                color="hsl(var(--chart-1))"
                className="mr-2"
              />
              <span>Basic Salary:</span>
            </div>
            <span className="ml-4">Rs. {basicSalary}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <User className="mr-2" size={16} />
              <span>Designation:</span>
            </div>
            <span className="ml-4">{designation}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Calendar size={16} className="mr-2" />
              <span>Joining Date:</span>
            </div>
            <span className="pl-1">{joiningDate}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
