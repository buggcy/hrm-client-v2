import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useStores } from '@/providers/Store.Provider';

import {
  useCitiesQuery,
  useCountriesQuery,
  useStatesQuery,
} from '@/hooks/employeeEdit/useEmployeeEdit.hook';
import { AddressType } from '@/libs/validations/edit-employee';
import { updateEmployeeAddress } from '@/services/hr/edit-employee.service';
import { EditEmployeeStoreType } from '@/stores/hr/edit-employee';

import { MessageErrorResponse } from '@/types';

interface EmployeeAddressProps {
  empId?: string;
  data?: AddressType;
}

const employeeAddressSchema = z.object({
  empId: z.string(),
  street: z.string().min(1, { message: 'Street name is required' }),
  landmark: z.string().min(1, { message: 'Landmark is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  province: z.string().min(1, { message: 'Province is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  zip: z.coerce.string().optional(),
  full: z.string().optional(),
});

export type EmployeeAddressFormData = z.infer<typeof employeeAddressSchema>;

const Address = ({ data, empId }: EmployeeAddressProps) => {
  const router = useRouter();
  const { editEmployeeStore } = useStores() as {
    editEmployeeStore: EditEmployeeStoreType;
  };
  const { setRefetchEditEmployeeData } = editEmployeeStore;
  const [selectedCountry, setSelectedCountry] = useState<string>('PK');
  const [selectedProvince, setSelectedProvince] = useState<string>('PB');

  const { data: countries } = useCountriesQuery();
  const { data: states } = useStatesQuery({ countryId: selectedCountry });
  const { data: cities } = useCitiesQuery({
    countryId: selectedCountry,
    stateId: selectedProvince,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeAddressFormData>({
    resolver: zodResolver(employeeAddressSchema),
    defaultValues: {
      empId: empId || '',
      street: data?.street || '',
      landmark: data?.landMark || '',
      country: data?.country || '',
      province: data?.province || '',
      city: data?.city || '',
      zip: data?.zip || '',
      full: data?.full || '',
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: updateEmployeeAddress,
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Error on adding employee!',
        variant: 'error',
      });
    },
    onSuccess: response => {
      toast({
        title: 'Success',
        description: response?.message,
        variant: 'success',
      });
      setRefetchEditEmployeeData(true);
      reset();
      router.push('/hr/manage-employees');
    },
  });
  const onSubmit = (data: EmployeeAddressFormData) => {
    mutate({
      id: data.empId,
      data: {
        street: data.street,
        landMark: data.landmark,
        country: data.country,
        province: data.province,
        city: data.city,
        zip: data.zip || '',
        full: data.full || '',
      },
    });
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-4">
      <div className="mb-4 flex flex-col gap-8">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col">
            <Label htmlFor="street" className="mb-2 text-left">
              Street <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="street"
              control={control}
              render={({ field }) => (
                <Input {...field} id="street" placeholder="Street" />
              )}
            />
            {errors.street && (
              <span className="text-sm text-red-500">
                {errors.street.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="landmark" className="mb-2 text-left">
              Landmark <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="landmark"
              control={control}
              render={({ field }) => (
                <Input {...field} id="landmark" placeholder="Landmark" />
              )}
            />
            {errors.landmark && (
              <span className="text-sm text-red-500">
                {errors.landmark.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="country" className="mb-2 text-left">
              Country <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={value => {
                    field.onChange(value);
                    setSelectedCountry(() => {
                      const onecountry = countries?.find(
                        country => country.name === value,
                      );
                      return onecountry?.iso2 || '';
                    });
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                    <SelectValue placeholder="Select Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="text-sm">
                      <SelectItem value="Select Country" disabled>
                        Select Country
                      </SelectItem>
                      {countries?.map(country => (
                        <SelectItem key={country.id} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <span className="text-sm text-red-500">
                {errors.country.message}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="province" className="mb-2 text-left">
              Province <span className="text-destructive/90">*</span>
            </Label>
            <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={value => {
                    field.onChange(value);
                    setSelectedProvince(() => {
                      const onestate = states?.find(
                        state => state.name === value,
                      );
                      return onestate?.iso2 || '';
                    });
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="text-sm">
                      <SelectItem value="No Province" disabled>
                        Select Province
                      </SelectItem>
                      {states?.map(state => (
                        <SelectItem key={state.id} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.province && (
              <span className="text-sm text-red-500">
                {errors.province.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <Label htmlFor="city" className="mb-2 text-left">
                City <span className="text-destructive/90">*</span>
              </Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No City" disabled>
                          Select city
                        </SelectItem>
                        {cities?.map(city => (
                          <SelectItem key={city.id} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.city && (
                <span className="text-sm text-red-500">
                  {errors.city.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <Label htmlFor="zip" className="mb-2 text-left">
                Zip
              </Label>
              <Controller
                name="zip"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="zip"
                    placeholder="57400"
                    type="number"
                  />
                )}
              />
              {errors.zip && (
                <span className="text-sm text-red-500">
                  {errors.zip.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <Label htmlFor="full" className="mb-2 text-left">
              Description
            </Label>
            <Controller
              name="full"
              control={control}
              render={({ field }) => (
                <Input {...field} id="full" placeholder="Description" />
              )}
            />
            {errors.full && (
              <span className="text-sm text-red-500">
                {errors.full.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </DialogFooter>
    </form>
  );
};

export default Address;
