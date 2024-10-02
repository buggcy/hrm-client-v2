import React from 'react';

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
import { format, isAfter, subYears } from 'date-fns';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectContent } from '@/components/ui/select';

import { cn } from '@/utils';

import { MainFormData } from './VerifyCodeForm';

export function Details({ onNext }: { onNext: () => void }) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<MainFormData>();

  const cutoffDate = subYears(new Date(), 18);
  const dateOfBirth = watch('additionalInfo.DOB');
  const maritalStatus = watch('additionalInfo.Marital_Status');
  const bloodGroup = watch('additionalInfo.Blood_Group');
  const gender = watch('additionalInfo.Gender');

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Add Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="firstName" className="mb-2 text-left">
              First Name
            </Label>
            <Input
              id="firstName"
              {...register('additionalInfo.firstName')}
              placeholder="First Name"
              disabled
            />
            {errors.additionalInfo?.firstName && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.firstName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="lastName" className="mb-2 text-left">
              Last Name
            </Label>
            <Input
              id="lastName"
              {...register('additionalInfo.lastName')}
              placeholder="Last Name"
              disabled
            />
            {errors.additionalInfo?.lastName && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.lastName.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="emailAddress" className="mb-2 text-left">
              Email Address
            </Label>
            <Input
              id="emailAddress"
              {...register('additionalInfo.emailAddress')}
              placeholder="personal@mail.com"
              disabled
            />
            {errors.additionalInfo?.emailAddress && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.emailAddress.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="contactNo" className="mb-2 text-left">
              Phone Number
            </Label>
            <Input
              id="contactNo"
              {...register('additionalInfo.contactNo')}
              placeholder="03XXXXXXXXX"
              disabled
            />
            {errors.additionalInfo?.contactNo && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.contactNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Emergency_Phone" className="mb-2 text-left">
              Emergency Phone
            </Label>
            <Input
              id="Emergency_Phone"
              {...register('additionalInfo.Emergency_Phone')}
              placeholder="03XXXXXXXXX"
              type="tel"
            />
            {errors.additionalInfo?.Emergency_Phone && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Emergency_Phone.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="DOB" className="mb-2 text-left">
              Date of Birth
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[241.5px] justify-start text-left font-normal',
                    !dateOfBirth && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {dateOfBirth ? (
                    format(dateOfBirth, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateOfBirth || cutoffDate}
                  defaultMonth={dateOfBirth}
                  onSelect={date => {
                    if (date && !isAfter(date, cutoffDate)) {
                      setValue('additionalInfo.DOB', date);
                    }
                  }}
                  className="z-50 mt-6 rounded-md border bg-white dark:bg-gray-800"
                  disabled={date => isAfter(date, cutoffDate)}
                />
              </PopoverContent>
            </Popover>
            {errors.additionalInfo?.DOB && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.DOB.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="marital-status" className="mb-2 text-left">
              Marital Status
            </Label>
            <Select
              value={maritalStatus || 'Select marital status'}
              onValueChange={(value: 'married' | 'unmarried') => {
                if (value === 'married' || value === 'unmarried') {
                  setValue('additionalInfo.Marital_Status', value);
                }
              }}
            >
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {maritalStatus
                    ? maritalStatus.charAt(0).toUpperCase() +
                      maritalStatus.slice(1)
                    : 'Select marital status'}
                </SelectValue>
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
              <ChevronDown className="absolute ml-[220px] mt-8 size-4" />
            </Select>
            {errors.additionalInfo?.Marital_Status && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Marital_Status.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="blood-group" className="mb-2 text-left">
              Blood Group
            </Label>
            <Select
              value={bloodGroup || 'Select blood group'}
              onValueChange={(
                value: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-',
              ) => {
                if (value) {
                  setValue('additionalInfo.Blood_Group', value);
                }
              }}
            >
              <SelectTrigger className="relative z-50 w-[241.5px] rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {bloodGroup ? bloodGroup : 'Select blood group'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="text-sm">
                  <SelectItem
                    value="A+"
                    className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                  >
                    A+
                  </SelectItem>
                  <SelectItem
                    value="A-"
                    className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                  >
                    A-
                  </SelectItem>
                  <SelectItem
                    value="B+"
                    className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                  >
                    B+
                  </SelectItem>
                  <SelectItem
                    value="B-"
                    className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                  >
                    B-
                  </SelectItem>
                  <SelectItem
                    value="O+"
                    className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                  >
                    O+
                  </SelectItem>
                  <SelectItem
                    value="O-"
                    className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                  >
                    O-
                  </SelectItem>
                  <SelectItem
                    value="AB+"
                    className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                  >
                    AB+
                  </SelectItem>
                  <SelectItem
                    value="AB-"
                    className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                  >
                    AB-
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
              <ChevronDown className="absolute ml-[220px] mt-8 size-4" />
            </Select>
            {errors.additionalInfo?.Blood_Group && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Blood_Group.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="gender" className="mb-2 text-left">
              Gender
            </Label>
            <Select
              value={gender || 'Select Gender'}
              onValueChange={(value: 'male' | 'female') => {
                if (value) {
                  setValue('additionalInfo.Gender', value);
                }
              }}
            >
              <SelectTrigger className="relative z-50 w-[241.5px] rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {gender
                    ? gender.charAt(0).toUpperCase() + gender.slice(1)
                    : 'Select Gender'}
                </SelectValue>
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
                  </SelectGroup>
                </SelectContent>
              </SelectTrigger>

              <ChevronDown className="absolute ml-[220px] mt-8 size-4" />
            </Select>
            {errors.additionalInfo?.Gender && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Gender.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="nationality" className="mb-2 text-left">
              Nationality
            </Label>
            <Input
              id="Nationality"
              {...register('additionalInfo.Nationality')}
              placeholder="Nationality"
              className="w-[241.5px]"
            />
            {errors.additionalInfo?.Nationality && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Nationality.message}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle>Family Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="Family_Name" className="mb-2 text-left">
              Name
            </Label>
            <Input
              id="Family_Name"
              {...register('additionalInfo.Family_Name')}
              placeholder="Family Member Name"
            />
            {errors.additionalInfo?.Family_Name && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Family_Name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="Family_Relation" className="mb-2 text-left">
              Relation
            </Label>
            <Input
              id="Family_Relation"
              {...register('additionalInfo.Family_Relation')}
              placeholder="Relation"
            />
            {errors.additionalInfo?.Family_Relation && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Family_Relation.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="Family_PhoneNo" className="mb-2 text-left">
              Phone Number
            </Label>
            <Input
              id="Family_PhoneNo"
              {...register('additionalInfo.Family_PhoneNo')}
              placeholder="03XXXXXXXXX"
            />
            {errors.additionalInfo?.Family_PhoneNo && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Family_PhoneNo.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="Family_Occupation" className="mb-2 text-left">
              Occupation
            </Label>
            <Input
              id="Family_Occupation"
              {...register('additionalInfo.Family_Occupation')}
              placeholder="Occupation"
              className="w-[241.5px]"
            />
            {errors.additionalInfo?.Family_Occupation && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Family_Occupation.message}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle>Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="street" className="mb-2 text-left">
              Street
            </Label>
            <Input
              id="street"
              {...register('additionalInfo.Address.street')}
              placeholder="Street Address"
            />
            {errors.additionalInfo?.Address?.street && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Address.street.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="landMark" className="mb-2 text-left">
              Landmark
            </Label>
            <Input
              id="landMark"
              {...register('additionalInfo.Address.landMark')}
              placeholder="Landmark"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="country" className="mb-2 text-left">
              Country
            </Label>
            {/* <Select
                onValueChange={value =>
                  setValue('additionalInfo.Address.country', value)
                }
              >
                <SelectTrigger className="relative z-50 w-[241.5px] rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem
                      value="Pakistan"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Pakistan
                    </SelectItem>
                    <SelectItem
                      value="India"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      India
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute ml-[220px] mt-8 size-4" />
              </Select> */}
            <Input
              id="country"
              {...register('additionalInfo.Address.country')}
              placeholder="Country"
            />
            {errors.additionalInfo?.Address?.country && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Address.country.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="province" className="mb-2 text-left">
              Province
            </Label>
            {/* <Select
                onValueChange={value =>
                  setValue('additionalInfo.Address.province', value)
                }
              >
                <SelectTrigger className="relative z-50 w-[241.5px] rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="text-sm">
                    <SelectItem
                      value="Punjab"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Punjab
                    </SelectItem>
                    <SelectItem
                      value="Sindh"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Sindh
                    </SelectItem>
                    <SelectItem
                      value="Khyber Pakhtunkhwa"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Khyber Pakhtunkhwa
                    </SelectItem>
                    <SelectItem
                      value="Gilgit-Baltistan"
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      Gilgit-Baltistan
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute ml-[220px] mt-8 size-4" />
              </Select> */}
            <Input
              id="province"
              {...register('additionalInfo.Address.province')}
              placeholder="Province"
            />
            {errors.additionalInfo?.Address?.province && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Address.province.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="city" className="mb-2 text-left">
              City
            </Label>
            <Input
              id="city"
              {...register('additionalInfo.Address.city')}
              placeholder="City"
            />
            {errors.additionalInfo?.Address?.city && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Address.city.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="zip" className="mb-2 text-left">
              Postal Code
            </Label>
            <Input
              id="zip"
              {...register('additionalInfo.Address.zip')}
              placeholder="Postal Code"
            />
            {errors.additionalInfo?.Address?.zip && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Address.zip.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="full" className="mb-2 text-left">
              Description
            </Label>
            <Input
              id="full"
              {...register('additionalInfo.Address.full')}
              placeholder="Description"
            />
          </div>
        </div>
      </CardContent>
      <div className="flex justify-end pt-8">
        <Button onClick={onNext}>Next</Button>
      </div>
    </Card>
  );
}
