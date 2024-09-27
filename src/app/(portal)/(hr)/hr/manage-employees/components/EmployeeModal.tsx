import React, { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent } from '@/components/ui/select';

import { cn } from '@/utils';

interface DialogDemoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogDemo({ open, onOpenChange }: DialogDemoProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [contact, setContact] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [date, setDate] = React.useState<Date>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="h-[470px] sm:max-w-[905px]">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-8 py-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="first-name" className="mb-2 text-left">
                First Name
              </Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
                required
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="last-name" className="mb-2 text-left">
                Last Name
              </Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="email" className="mb-2 text-left">
                Personal Email
              </Label>
              <Input
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="personal@mail.com"
                required
                type="email"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="company-email" className="mb-2 text-left">
                Company Email
              </Label>
              <Input
                id="company-email"
                value={companyEmail}
                onChange={e => setCompanyEmail(e.target.value)}
                placeholder="company@mail.com"
                required
                type="email"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="contact" className="mb-2 text-left">
                Contact
              </Label>
              <Input
                id="contact"
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="03XXXXXXXXX"
                required
                type="tel"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="basic-salary" className="mb-2 text-left">
                Basic Salary
              </Label>
              <Input
                id="basic-salary"
                value={basicSalary}
                onChange={e => setBasicSalary(e.target.value)}
                placeholder="10000"
                required
                type="number"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-8 sm:max-w-[570px]">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="joining-date" className="mb-2 text-left">
                Joining Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[263.664px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="z-10 mt-6 rounded-md border bg-white dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-1 flex-col">
              <Label htmlFor="designation" className="mb-2 text-left">
                Designation
              </Label>
              <Select>
                <SelectTrigger className="relative z-50 w-[263.664px] rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem
                      value="apple"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Assistant
                    </SelectItem>
                    <SelectItem
                      value="banana"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      CEO
                    </SelectItem>
                    <SelectItem
                      value="blueberry"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      CTO
                    </SelectItem>
                    <SelectItem
                      value="grapes"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      HR
                    </SelectItem>
                    <SelectItem
                      value="pineapple"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Intern
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute ml-[240px] mt-8 size-4" />
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Add Employee</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
