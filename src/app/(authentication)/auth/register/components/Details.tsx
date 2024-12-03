/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';

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

import {
  useCities,
  useCountries,
  useStates,
} from '@/hooks/country/useCountryOption.hook';
import { cn } from '@/utils';

import { MainFormData } from './VerifyCodeForm';

import { CityType, CountryType } from '@/types/country.types';

export function Details({ onNext }: { onNext: () => void }) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    setError,
  } = useFormContext<MainFormData>();
  const DEFAULT_COUNTRY_CODE = 'PK';

  const [selectedCountry, setSelectedCountry] =
    useState<string>(DEFAULT_COUNTRY_CODE);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const { data: countries } = useCountries();
  const { data: states } = useStates(selectedCountry);
  const { data: cities } = useCities(selectedCountry, selectedState);

  const cutoffDate = subYears(new Date(), 18);
  const dateOfBirth = watch('additionalInfo.DOB');
  const maritalStatus = watch('additionalInfo.Marital_Status');
  const bloodGroup = watch('additionalInfo.Blood_Group');
  const gender = watch('additionalInfo.Gender');
  const country = watch('additionalInfo.Address.country');
  const province = watch('additionalInfo.Address.province');
  const city = watch('additionalInfo.Address.city');

  useEffect(() => {
    if (countries && countries.length > 0 && !country) {
      const defaultCountry = countries.find(
        (country: CountryType) => country.iso2 === DEFAULT_COUNTRY_CODE,
      );

      if (defaultCountry && defaultCountry.iso2) {
        setSelectedCountry(defaultCountry.iso2);
        setValue('additionalInfo.Address.country', defaultCountry.name);
      }
    }
  }, [countries, setValue, country]);

  const handleCountryChange = (value: string) => {
    const selected = countries.find(
      (country: CountryType) => country.iso2 === value,
    );
    if (selected) {
      setSelectedCountry(value);
      setSelectedState('');
      setSelectedCity('');
      setValue('additionalInfo.Address.country', selected.name);
    }
  };

  const handleStateChange = (value: string) => {
    const selected = states.find((state: CountryType) => state.iso2 === value);
    if (selected) {
      setSelectedState(value);
      setSelectedCity('');
      setValue('additionalInfo.Address.province', selected.name);
    }
  };

  const handleCityChange = (value: string) => {
    const selected = cities.find((city: CityType) => city.name === value);
    if (selected) {
      setSelectedCity(value);
      setValue('additionalInfo.Address.city', selected.name);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Add Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="firstName" className="mb-2 text-left">
              First Name <span className="text-red-600">*</span>
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
              Last Name <span className="text-red-600">*</span>
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
              Email Address <span className="text-red-600">*</span>
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
              Phone Number <span className="text-red-600">*</span>
            </Label>
            <Input
              id="contactNo"
              {...register('additionalInfo.contactNo')}
              placeholder="03XXXXXXXXX"
              disabled
              onBlur={() => {
                const phone = watch('additionalInfo.contactNo');
                const strippedVal = phone.replace(/^(03|\+923)/, '');
                const isDigit = /^\d+$/.test(strippedVal);
                if (phone && (strippedVal.length !== 9 || !isDigit)) {
                  setError('additionalInfo.contactNo', {
                    type: 'manual',
                    message:
                      'Phone number must have exactly 9 digits after 03 or +923',
                  });
                }
              }}
            />
            {errors.additionalInfo?.contactNo && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.contactNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="Emergency_Phone" className="mb-2 text-left">
              Emergency <span className="text-red-600">*</span>
            </Label>
            <Input
              id="Emergency_Phone"
              {...register('additionalInfo.Emergency_Phone')}
              placeholder="03XXXXXXXXX"
              type="tel"
              onBlur={() => {
                const phone = watch('additionalInfo.Emergency_Phone');
                const strippedVal = phone.replace(/^(03|\+923)/, '');
                const isDigit = /^\d+$/.test(strippedVal);
                if (phone && (strippedVal.length !== 9 || !isDigit)) {
                  setError('additionalInfo.Emergency_Phone', {
                    type: 'manual',
                    message:
                      'Phone number must have exactly 9 digits after 03 or +923',
                  });
                }
              }}
            />
            {errors.additionalInfo?.Emergency_Phone && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Emergency_Phone.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="DOB" className="mb-2 text-left">
              Date of Birth <span className="text-red-600">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-normal',
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
              <PopoverContent className="z-50 w-auto p-0" align="start">
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
                <ChevronDown className="absolute right-2 top-0 size-4 translate-y-1/2" />
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
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {bloodGroup ? bloodGroup : 'Select blood group'}
                </SelectValue>
                <ChevronDown className="absolute right-2 top-0 size-4 translate-y-1/2" />
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
            </Select>
            {errors.additionalInfo?.Blood_Group && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Blood_Group.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="gender" className="mb-2 text-left">
              Gender <span className="text-red-600">*</span>
            </Label>
            <Select
              value={gender || 'Select Gender'}
              onValueChange={(value: 'male' | 'female') => {
                if (value) {
                  setValue('additionalInfo.Gender', value);
                }
              }}
            >
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {gender
                    ? gender.charAt(0).toUpperCase() + gender.slice(1)
                    : 'Select Gender'}
                </SelectValue>
                <ChevronDown className="absolute right-2 top-0 size-4 translate-y-1/2" />
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
            </Select>
            {errors.additionalInfo?.Gender && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Gender.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="nationality" className="mb-2 text-left">
              Nationality <span className="text-red-600">*</span>
            </Label>
            <Input
              id="Nationality"
              {...register('additionalInfo.Nationality')}
              placeholder="Nationality"
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
              Name <span className="text-red-600">*</span>
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
              Relation <span className="text-red-600">*</span>
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
              Phone Number <span className="text-red-600">*</span>
            </Label>
            <Input
              id="Family_PhoneNo"
              {...register('additionalInfo.Family_PhoneNo')}
              placeholder="03XXXXXXXXX"
              onBlur={() => {
                const phone = watch('additionalInfo.Family_PhoneNo');
                const strippedVal = phone.replace(/^(03|\+923)/, '');
                const isDigit = /^\d+$/.test(strippedVal);
                if (phone && (strippedVal.length !== 9 || !isDigit)) {
                  setError('additionalInfo.Family_PhoneNo', {
                    type: 'manual',
                    message:
                      'Phone number must have exactly 9 digits after 03 or +923',
                  });
                }
              }}
            />
            {errors.additionalInfo?.Family_PhoneNo && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Family_PhoneNo.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="Family_Occupation" className="mb-2 text-left">
              Occupation <span className="text-red-600">*</span>
            </Label>
            <Input
              id="Family_Occupation"
              {...register('additionalInfo.Family_Occupation')}
              placeholder="Occupation"
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
              Street <span className="text-red-600">*</span>
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
              Country <span className="text-red-600">*</span>
            </Label>
            <Select
              value={country || selectedCountry || 'Select country'}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {/* {selectedCountry
                    ? countries?.find(
                        (country: CountryType) =>
                          country.iso2 === selectedCountry,
                      )?.name
                    : 'Select country'} */}
                  {country
                    ? country
                    : selectedCountry
                      ? countries?.find(
                          (country: CountryType) =>
                            country.iso2 === selectedCountry,
                        )?.name
                      : 'Select country'}
                </SelectValue>
                <ChevronDown className="absolute right-2 top-0 size-4 translate-y-1/2" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="text-sm">
                  {countries?.map((country: CountryType) => (
                    <SelectItem
                      key={country.iso2}
                      value={country.iso2}
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {errors.additionalInfo?.Address?.country && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Address.country.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="province" className="mb-2 text-left">
              Province <span className="text-red-600">*</span>
            </Label>
            <Select
              value={province || selectedState || 'Select province'}
              onValueChange={handleStateChange}
              disabled={!selectedCountry}
            >
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {/* {selectedState
                    ? states.find(
                        (state: CountryType) => state.iso2 === selectedState,
                      )?.name || 'Select province'
                    : 'Select province'} */}
                  {province
                    ? province
                    : selectedState
                      ? states.find(
                          (state: CountryType) => state.iso2 === selectedState,
                        )?.name || 'Select province'
                      : 'Select province'}
                </SelectValue>
                <ChevronDown className="absolute right-2 top-0 size-4 translate-y-1/2" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="text-sm">
                  {states?.map((state: CountryType) => (
                    <SelectItem
                      key={state.iso2}
                      value={state.iso2}
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {errors.additionalInfo?.Address?.province && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Address.province.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="city" className="mb-2 text-left">
              City <span className="text-red-600">*</span>
            </Label>
            <Select
              value={selectedCity || 'Select city'}
              onValueChange={handleCityChange}
              disabled={!selectedState}
            >
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>
                  {/* {selectedCity
                    ? cities?.find(
                        (city: CityType) => city.name === selectedCity,
                      )?.name
                    : 'Select city'} */}
                  {city
                    ? city
                    : selectedCity
                      ? cities?.find(
                          (city: CityType) => city.name === selectedCity,
                        )?.name
                      : 'Select city'}
                </SelectValue>
                <ChevronDown className="absolute right-2 top-0 size-4 translate-y-1/2" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="text-sm">
                  {cities?.map((city: CityType) => (
                    <SelectItem
                      key={city.id}
                      value={city.name}
                      className="cursor-pointer rounded px-3 py-2 hover:bg-gray-200 dark:bg-gray-800"
                    >
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.additionalInfo?.Address?.city && (
              <span className="text-xs text-red-500">
                {errors.additionalInfo.Address.city.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="zip" className="mb-2 text-left">
              Postal Code <span className="text-red-600">*</span>
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
