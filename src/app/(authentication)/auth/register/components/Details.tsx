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

export function Details() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [contact, setContact] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [designation, setDesignation] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [maritalStatus, setMaritalStatus] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');

  const [occupation, setOccupation] = useState('');
  const [familyLastName, setFamilyLastName] = useState('');
  const [familyEmail, setFamilyEmail] = useState('');
  const [familyContact, setFamilyContact] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({
      firstName,
      lastName,
      email,
      companyEmail,
      contact,
      basicSalary,
      joiningDate,
      designation,
      emergencyContact,
      dateOfBirth,
      maritalStatus,
      bloodGroup,
      gender,
      nationality,
    });
    // Clear form fields
    setFirstName('');
    setLastName('');
    setEmail('');
    setCompanyEmail('');
    setContact('');
    setBasicSalary('');
    setJoiningDate('');
    setDesignation('');
    setEmergencyContact('');
    setDateOfBirth(undefined);
    setMaritalStatus('');
    setBloodGroup('');
    setGender('');
    setNationality('');
    setFamilyLastName('');
    setFamilyEmail('');
    setFamilyContact('');
  };

  return (
    <Card className="w-[1110px] border-none shadow-none">
      <CardHeader>
        <CardTitle>Add Employee</CardTitle>
      </CardHeader>
      <CardContent>
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
                Email Address
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
            <div className="flex flex-1 flex-col">
              <Label htmlFor="contact" className="mb-2 text-left">
                Phone Number
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
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="contact" className="mb-2 text-left">
                Emergency Phone
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
              <Label htmlFor="joining-date" className="mb-2 text-left">
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
                    selected={dateOfBirth}
                    onSelect={setDateOfBirth}
                    className="z-50 mt-6 rounded-md border bg-white dark:bg-gray-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="marital-status" className="mb-2 text-left">
                Marital Status
              </Label>
              <Select>
                <SelectTrigger className="relative z-50 w-[241.5px] rounded-md border px-3 py-2 text-left text-sm">
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
                <ChevronDown className="absolute ml-[220px] mt-8 size-4" />
              </Select>
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="blood-group" className="mb-2 text-left">
                Blood Group
              </Label>
              <Select>
                <SelectTrigger className="relative z-50 w-[241.5px] rounded-md border px-3 py-2 text-left text-sm">
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
                <ChevronDown className="absolute ml-[220px] mt-8 size-4" />
              </Select>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col">
              <Label htmlFor="gender" className="mb-2 text-left">
                Gender
              </Label>
              <Select>
                <SelectTrigger className="relative z-50 w-[241.5px] rounded-md border px-3 py-2 text-left text-sm">
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
                  </SelectGroup>
                </SelectContent>
                <ChevronDown className="absolute ml-[220px] mt-8 size-4" />
              </Select>
            </div>

            <div className="flex flex-1 flex-col">
              <Label htmlFor="nationality" className="mb-2 text-left">
                Nationality
              </Label>
              <Input
                id="nationality"
                value={nationality}
                onChange={e => setNationality(e.target.value)}
                placeholder="Nationality"
                className="w-[241.5px]"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardHeader>
        <CardTitle>Family Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-8 py-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-1 flex-col">
              <Label htmlFor="family-last-name" className="mb-2 text-left">
                Name
              </Label>
              <Input
                id="family-last-name"
                value={familyLastName}
                onChange={e => setFamilyLastName(e.target.value)}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="family-email" className="mb-2 text-left">
                Relation
              </Label>
              <Input
                id="family-email"
                value={familyEmail}
                onChange={e => setFamilyEmail(e.target.value)}
                placeholder="family@mail.com"
                required
                type="email"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="family-contact" className="mb-2 text-left">
                Phone Number
              </Label>
              <Input
                id="family-contact"
                value={familyContact}
                onChange={e => setFamilyContact(e.target.value)}
                placeholder="03XXXXXXXXX"
                required
                type="tel"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="occupation" className="mb-2 text-left">
                Occupation
              </Label>
              <Input
                id="occupation"
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                placeholder="Occupation"
                className="w-[241.5px]" // Adjust width as necessary
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardHeader>
        <CardTitle>Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-8 py-4">
          <div className="flex flex-wrap gap-8">
            {/* New Address Fields */}
            <div className="flex flex-1 flex-col">
              <Label htmlFor="street" className="mb-2 text-left">
                Street
              </Label>
              <Input id="street" placeholder="Street Address" required />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="landmark" className="mb-2 text-left">
                Landmark
              </Label>
              <Input id="landmark" placeholder="Landmark" />
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="marital-status" className="mb-2 text-left">
                Country
              </Label>
              <Select>
                <SelectTrigger className="relative z-50 w-[241.5px] rounded-md border px-3 py-2 text-left text-sm">
                  <SelectValue placeholder="Select  Country" />
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
              </Select>
            </div>
            <div className="flex flex-1 flex-col">
              <Label htmlFor="marital-status" className="mb-2 text-left">
                province
              </Label>
              <Select>
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
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex w-[241.5px] flex-col">
              <Label htmlFor="city" className="mb-2 text-left">
                City
              </Label>
              <Input id="city" placeholder="City" required />
            </div>
            <div className="flex w-[241.5px] flex-col">
              <Label htmlFor="postal-code" className="mb-2 text-left">
                Postal Code
              </Label>
              <Input
                id="postal-code"
                placeholder="Postal Code"
                required
                type="text"
              />
            </div>
            <div className="flex w-[241.5px] flex-col">
              <Label htmlFor="description" className="mb-2 text-left">
                Description
              </Label>
              <Input id="description" placeholder="Description" required />
            </div>
          </div>
          <div className="flex justify-end pt-8">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
