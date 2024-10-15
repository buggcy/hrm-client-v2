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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent } from '@/components/ui/select';

import { cn } from '@/utils';
interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
}) => (
  <div className="flex flex-col">
    <Label htmlFor={id} className="mb-2 text-left">
      {label}
    </Label>
    <Input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      type={type}
    />
  </div>
);

// const FormField = ({
//   id,
//   label,
//   value,
//   onChange,
//   placeholder,
//   required = false,
//   type = 'text',
// }) => (
//   <div className="flex flex-col">
//     <Label htmlFor={id} className="mb-2 text-left">
//       {label}
//     </Label>
//     <Input
//       id={id}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       required={required}
//       type={type}
//     />
//   </div>
// );

export function Details() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyEmail: '',
    contact: '',
    basicSalary: '',
    joiningDate: null,
    dateOfBirth: null,
    maritalStatus: '',
    bloodGroup: '',
    gender: '',
    nationality: '',
    familyLastName: '',
    familyEmail: '',
    familyContact: '',
    occupation: '',
    street: '',
    landmark: '',
    country: '',
    province: '', // New field
    postalCode: '', // New field
    description: '', // New field
    city: '', // New field
  });

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (field: string) => (value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(formData);
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      companyEmail: '',
      contact: '',
      basicSalary: '',
      joiningDate: null,
      dateOfBirth: null,
      maritalStatus: '',
      bloodGroup: '',
      gender: '',
      nationality: '',
      familyLastName: '',
      familyEmail: '',
      familyContact: '',
      occupation: '',
      street: '',
      landmark: '',
      country: '',
      province: '',
      postalCode: '',
      description: '',
      city: '',
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-8 py-4">
          {/* Personal Info Section */}
          <div className="flex flex-col flex-wrap gap-8 md:flex-row">
            <FormField
              id="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
            <FormField
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
            <FormField
              id="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="personal@mail.com"
              type="email"
              required
            />
            <FormField
              id="companyEmail"
              label="Company Email"
              value={formData.companyEmail}
              onChange={handleInputChange}
              placeholder="company@mail.com"
              type="email"
              required
            />
          </div>

          {/* Additional Info Section */}
          <div className="flex flex-col flex-wrap gap-8 md:flex-row">
            <FormField
              id="contact"
              label="Emergency Contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="03XXXXXXXXX"
              type="tel"
              required
            />
            <div className="flex flex-1 flex-col">
              <Label htmlFor="dateOfBirth" className="mb-2 text-left">
                Date of Birth
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'justify-start text-left font-normal',
                      !formData.dateOfBirth && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {formData.dateOfBirth ? (
                      format(formData.dateOfBirth, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={date =>
                      setFormData({ ...formData, dateOfBirth: date })
                    }
                    className="z-50 mt-6 rounded-md border bg-white dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Dropdown Selections */}
            <div className="relative flex flex-1 flex-col">
              <Label htmlFor="maritalStatus" className="mb-2 text-left">
                Marital Status
              </Label>
              <Select onValueChange={handleSelectChange('maritalStatus')}>
                <SelectTrigger className="z-50 rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem
                      value="married"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Married
                    </SelectItem>
                    <SelectItem
                      value="unmarried"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Unmarried
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute right-2 mt-8 size-4" />
              </Select>
            </div>
            <div className="relative flex flex-1 flex-col">
              <Label htmlFor="bloodGroup" className="mb-2 text-left">
                Blood Group
              </Label>
              <Select onValueChange={handleSelectChange('bloodGroup')}>
                <SelectTrigger className="z-50 rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem
                      value="a+"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      A+
                    </SelectItem>
                    <SelectItem
                      value="b+"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      B+
                    </SelectItem>
                    <SelectItem
                      value="o+"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      O+
                    </SelectItem>
                    <SelectItem
                      value="ab+"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      AB+
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute right-2 mt-8 size-4" />
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:w-full md:flex-row md:pr-0 lg:w-6/12 lg:pr-4">
            <div className="relative flex flex-1 flex-col">
              <Label htmlFor="gender" className="mb-2 text-left">
                Gender
              </Label>
              <Select onValueChange={handleSelectChange('gender')}>
                <SelectTrigger className="z-50 rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem
                      value="male"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="female"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Female
                    </SelectItem>
                    <SelectItem
                      value="other"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Other
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute right-2 mt-8 size-4" />
              </Select>
            </div>
            <FormField
              id="nationality"
              label="Nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              placeholder="Nationality"
              required
            />
          </div>

          {/* Family Details Section */}
          <CardHeader className="p-0">
            <CardTitle>Family Details</CardTitle>
          </CardHeader>
          <div className="flex flex-col flex-wrap gap-8 md:flex-row">
            <FormField
              id="familyLastName"
              label="Last Name"
              value={formData.familyLastName}
              onChange={handleInputChange}
              placeholder="Family Last Name"
              required
            />
            <FormField
              id="familyEmail"
              label="Family Email"
              value={formData.familyEmail}
              onChange={handleInputChange}
              placeholder="family@mail.com"
              type="email"
              required
            />
            <FormField
              id="familyContact"
              label="Family Contact"
              value={formData.familyContact}
              onChange={handleInputChange}
              placeholder="03XXXXXXXXX"
              type="tel"
              required
            />
            <FormField
              id="occupation"
              label="Occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              placeholder="Occupation"
              required
            />
          </div>

          {/* Address Section */}
          <CardHeader className="p-0">
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <div className="flex flex-col flex-wrap gap-8 md:flex-row">
            <FormField
              id="street"
              label="Street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Street"
              required
            />
            <FormField
              id="landmark"
              label="Landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              placeholder="Landmark"
              required
            />
            <FormField
              id="country"
              label="Country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Country"
              required
            />
            <FormField
              id="city"
              label="City"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              required
            />
          </div>
          <div className="flex flex-col flex-wrap gap-8 md:flex-row">
            <FormField
              id="province"
              label="Province" // New field
              value={formData.province}
              onChange={handleInputChange}
              placeholder="Province"
            />
            <FormField
              id="postalCode"
              label="Postal Code"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="Postal Code"
            />
            <FormField
              id="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            <div className="flex flex-1 flex-col">
              <Label htmlFor="dateOfBirth" className="mb-2 text-left">
                Joining of Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'justify-start text-left font-normal',
                      !formData.dateOfBirth && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {formData.dateOfBirth ? (
                      format(formData.dateOfBirth, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={date =>
                      setFormData({ ...formData, dateOfBirth: date })
                    }
                    className="z-50 mt-6 rounded-md border bg-white dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* <div className="flex flex-1 flex-col">
              <Label htmlFor="joining-date" className="mb-2 text-left">
                Date of Birth
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'justify-start text-left font-normal',
                      !joiningOfDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {joiningOfDate ? (
                      format(joiningOfDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 w-auto p-0" align="start">
<Calendar
  mode="single"
  selected={joiningOfDate}
  onSelect={setjoiningOfDate}
  className="z-50 mt-6 rounded-md border bg-white dark:bg-gray-800"
/>
                </PopoverContent>
              </Popover>
            </div> */}
            {/* <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="joiningDate" className="mb-2 text-left">
                Joining Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'justify-start text-left font-normal',
                      !formData.joiningDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {formData.joiningDate ? (
                      format(formData.joiningDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="z-50 w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.joiningDate}
                    onSelect={date =>
                      setFormData({ ...formData, joiningDate: date })
                    }
                    className="z-50 mt-6 rounded-md border bg-white dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div> */}
          </div>

          {/* <Button type="submit">Submit</Button> */}
          {/* <Button type="submit"  className="mt-4">Submit</Button> */}
          {/* <Button type="submit" size="sm" className="mt-4">Submit</Button> */}
          <div className="flex justify-end pt-8">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
