'use client';
import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Pencil } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioInput } from '@/components/ui/radio';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

import { useReadEmployeeRecordQuery } from '@/hooks/employee/useEmployeeList.hook';
import {
  useCitiesQuery,
  useCountriesQuery,
  useStatesQuery,
} from '@/hooks/employeeEdit/useEmployeeEdit.hook';
import { useTypesQuery } from '@/hooks/types.hook';
import { EditProfile } from '@/services/hr/employee.service';
import { useAuthStore } from '@/stores/auth';
import { validateFile } from '@/utils/fileValidation.utils';

import ImageUpload from './uploadImage';

import { MessageErrorResponse } from '@/types';
import { User } from '@/types/user.types';
interface UserProps {
  user: User;
}

const FormSchema = z.object({
  personalEmail: z.string().email('Invalid email address'),
  contactNo: z.string().regex(/^03\d{9}$/, 'Invalid contact number'),
  file: z.string().optional(),
  availability: z.string(),
  profileDescription: z.string(),
  address: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    street: z.string().optional(),
    province: z.string().optional(),
    landMark: z.string().optional(),
    zip: z.string().optional(),
    full: z.string().optional(),
  }),
  Family_Name: z.string(),
  Family_Relation: z.string(),
  Family_Occupation: z.string(),
  Family_PhoneNo: z.string(),
  Emergency_Phone: z.string(),
  Marital_Status: z.string(),
});

export type EditPasswordFormData = z.infer<typeof FormSchema>;

const ProfileTab: React.FC<UserProps> = ({ user }) => {
  const userId: string | undefined = user?.id;
  const [selectedCountry, setSelectedCountry] = useState<string>('PK');
  const [selectedProvince, setSelectedProvince] = useState<string>('PB');
  const { data: countries } = useCountriesQuery();
  const { data: states } = useStatesQuery({ countryId: selectedCountry });
  const { data: cities } = useCitiesQuery({
    countryId: selectedCountry,
    stateId: selectedProvince,
  });

  const { data, refetch } = useReadEmployeeRecordQuery(userId, {
    enabled: !!userId,
  });

  const [previousAvatar, setPreviousAvatar] = useState(
    data?.output?.employee?.Avatar,
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const { isLoading } = useTypesQuery();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPasswordFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      file: '',
      personalEmail: '',
      contactNo: '',
      availability: '',
      profileDescription: '',
      Family_Name: '',
      Family_Occupation: '',
      Family_PhoneNo: '',
      Emergency_Phone: '',
      Marital_Status: '',
      // country:'',
    },
  });

  useEffect(() => {
    if (data && data.output.employee.Address) {
      if (data.output.employee.Avatar !== previousAvatar) {
        setPreviousAvatar(data.output.employee.Avatar);
      }

      reset({
        personalEmail: data.output.employee.email,
        contactNo: data.output.employee.contactNo,
        availability: data.output.employee.Current_Status,
        profileDescription: data.output.employee.profileDescription,
        address: {
          country: data.output.employee.Address?.country,
          city: data.output.employee.Address?.city,
          street: data.output.employee.Address?.street,
          province: data.output.employee.Address?.province,
          landMark: data.output.employee.Address?.landMark,
          zip: data.output.employee.Address?.zip,
          full: data.output.employee.Address?.full,
        },
        Family_Name: data.output.employee?.Family_Name || '',
        Family_Relation: data.output.employee?.Family_Relation || '',
        Family_Occupation: data.output.employee?.Family_Occupation || '',
        Family_PhoneNo: data.output.employee?.Family_PhoneNo,
        Emergency_Phone: data.output.employee?.Emergency_Phone,
        Marital_Status: data.output.employee?.Marital_Status,
      });
    }
  }, [data, reset, previousAvatar]);

  const { setUser } = useAuthStore();
  const { mutate, isPending } = useMutation({
    mutationFn: EditProfile,
    onSuccess: response => {
      const token = response?.token;
      if (token) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setUser(token);
      }
      toast({
        title: 'Success',
        description: response?.message || 'Profile Edit Successfully!',
        variant: 'success',
      });
      void (async () => {
        await refetch();
      })();
      reset();
    },
    onError: (err: AxiosError<MessageErrorResponse>) => {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Error on Edit Profile!',
        variant: 'error',
      });
    },
  });
  const handleAvatarSave = (image: File) => {
    const formData = new FormData();
    formData.append('Avatar', image);

    const payload = { id: user.id, formData };
    mutate(payload);
  };

  const onSubmit = (data: EditPasswordFormData) => {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    const file = fileInput?.files ? fileInput.files[0] : null;

    const fileError = validateFile(file);
    if (fileError) {
      toast({
        title: 'File Error',
        description: fileError,
        variant: 'error',
      });
      return;
    }

    const formData = new FormData();
    formData.append('personalEmail', data.personalEmail);
    formData.append('contactNo', data.contactNo);
    formData.append('availability', data.availability);
    formData.append('profileDescription', data.profileDescription);
    formData.append('country', data.address.country || '');
    formData.append('city', data.address.city || '');
    formData.append('street', data.address.street || '');
    formData.append('province', data.address.province || '');
    formData.append('landMark', data.address.landMark || '');
    formData.append('zip', data.address.zip || '');
    formData.append('full', data.address.full || '');
    formData.append('Family_Name', data.Family_Name || '');
    formData.append('Family_Relation', data.Family_Relation || '');
    formData.append('Family_Occupation', data.Family_Occupation || '');
    formData.append('Family_PhoneNo', data.Family_PhoneNo);
    formData.append('Marital_Status', data.Marital_Status || '');
    formData.append('Emergency_Phone', data.Emergency_Phone || '');

    if (file) {
      formData.append('Avatar', file);
    }

    const payload = {
      id: user.id,
      formData,
    };
    mutate(payload);
  };

  return (
    <>
      <div className="mb-2 mt-6 flex items-center justify-between text-base font-normal dark:text-white">
        <h2 className="pl-3 text-lg font-semibold">Profile Edit</h2>
        <div className="flex flex-wrap space-x-4 space-y-2 md:flex-nowrap md:space-y-0">
          <Controller
            name="availability"
            control={control}
            render={({ field }) => (
              <>
                <RadioInput
                  id="available"
                  label="Available"
                  value="Available"
                  checked={field.value === 'Available'}
                  onChange={event => field.onChange(event.target.value)}
                />
                <RadioInput
                  id="inactive"
                  label="Inactive"
                  value="Inactive"
                  checked={field.value === 'Inactive'}
                  onChange={event => field.onChange(event.target.value)}
                />
                <RadioInput
                  id="busy"
                  label="Busy"
                  value="Busy"
                  checked={field.value === 'Busy'}
                  onChange={event => field.onChange(event.target.value)}
                />
                <RadioInput
                  id="offline"
                  label="Offline"
                  value="Offline"
                  checked={field.value === 'Offline'}
                  onChange={event => field.onChange(event.target.value)}
                />

                <RadioInput
                  id="break"
                  label="Break"
                  value="Break"
                  checked={field.value === 'Break'}
                  onChange={event => field.onChange(event.target.value)}
                />
              </>
            )}
          />
        </div>
      </div>
      <div className="relative inline-block transition-opacity hover:opacity-75">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div
              className="absolute inset-0 cursor-pointer rounded-full bg-primary"
              style={{
                padding: `${120 * 0.04}px`,
              }}
            >
              <Avatar className="size-full border-4 border-background">
                <AvatarImage
                  src={data?.output?.employee?.Avatar || ''}
                  alt={user?.firstName}
                />
                <AvatarFallback className="uppercase">
                  {`${user?.firstName?.charAt(0) || ''} ${user?.lastName?.charAt(0) || ''}`}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100">
                <Pencil className="rounded-full bg-black p-2 text-white" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="mb-2 text-center">
                Upload your Photo
              </DialogTitle>
              <DialogDescription className="text-center text-muted-foreground">
                Please select a clear, high-resolution image.
              </DialogDescription>
            </DialogHeader>
            <div className="mx-auto grid gap-4 py-4">
              <ImageUpload
                initialAvatar={data?.output.employee.Avatar ?? ''}
                onSave={(image: File) => {
                  handleAvatarSave(image);
                  setDialogOpen(false);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
        <div
          style={{
            width: `${120}px`,
            height: `${120}px`,
          }}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="mb-2 mt-4 pl-5 text-sm font-semibold text-muted-foreground">
          Personal Info
        </h2>

        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="personalEmail"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            Personal Email
          </Label>
          <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
            <Controller
              name="personalEmail"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="personalEmail"
                  placeholder="personal@mail.com"
                  type="email"
                />
              )}
            />
          </div>
        </div>
        {errors.personalEmail && (
          <span className="text-sm text-red-500">
            {errors.personalEmail.message}
          </span>
        )}
        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="contactNo"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            Contact No.
          </Label>
          <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
            <Controller
              name="contactNo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="contactNo"
                  placeholder="03XXXXXXXXX"
                  type="tel"
                />
              )}
            />
          </div>
        </div>
        {errors.contactNo && (
          <span className="text-sm text-red-500">
            {errors.contactNo.message}
          </span>
        )}
        <>
          <h2 className="mb-2 mt-4 pl-5 text-sm font-semibold text-muted-foreground">
            Address Details
          </h2>

          {/* <div className="flex flex-col">
              <Label htmlFor="address.country" className="mb-2 text-left">
                Country <span className="text-destructive/90">*</span>
              </Label> */}
          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="address.country"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Country
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="address.country"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={value => {
                      field.onChange(value);
                      setSelectedCountry(() => {
                        const oneCountry = countries?.find(
                          country => country.name === value,
                        );
                        return oneCountry?.iso2 || '';
                      });
                    }}
                    value={
                      field.value || data?.output?.employee?.Address?.country
                    }
                  >
                    <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="Select Country" disabled>
                          Select Country
                        </SelectItem>
                        {countries?.map(country => (
                          <SelectItem
                            key={country.id}
                            value={country.name}
                            className="cursor-pointer rounded px-8 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.address?.country && (
                <span className="text-sm text-red-500">
                  {errors.address.country.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="address.province"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Province
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="address.province"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={
                      field.value ||
                      data?.output?.employee?.Address?.province ||
                      'Select Province'
                    }
                    onValueChange={value => {
                      field.onChange(value);
                      setSelectedProvince(() => {
                        const selectedProvince = states?.find(
                          state => state.name === value,
                        );
                        return selectedProvince?.iso2 || '';
                      });
                    }}
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
                          <SelectItem
                            key={state.id}
                            value={state.name}
                            className="cursor-pointer rounded px-8 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.address?.province && (
                <span className="text-sm text-red-500">
                  {errors.address.province.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="address.city"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              City
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="address.city"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={
                      field.value ||
                      data?.output?.employee?.Address?.city ||
                      'Select City'
                    }
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="No City" disabled>
                          Select City
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
              {errors.address?.city && (
                <span className="text-sm text-red-500">
                  {errors.address.city.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="address.street"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Street
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="address.street" placeholder="Street" />
                )}
              />
              {errors.address?.street && (
                <span className="text-red-500">
                  {errors.address.street.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="address.landMark"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Landmark
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="address.landMark"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="address.landMark"
                    placeholder="Landmark"
                  />
                )}
              />
              {errors.address?.landMark && (
                <span className="text-red-500">
                  {errors.address.landMark.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="address.zip"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Postal Code
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="address.zip"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="address.zip"
                    placeholder="Postal Code"
                  />
                )}
              />
              {errors.address?.zip?.message && (
                <span className="text-red-500">
                  {errors.address.zip.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="address.fullAddress"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Full Address
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="address"
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Textarea
                    id="address.fullAddress"
                    placeholder="Full Address"
                    value={value?.full || ''}
                    onChange={e => {
                      const fullAddress = e.target.value;
                      onChange({ ...value, full: fullAddress });
                    }}
                    onBlur={onBlur}
                    ref={ref}
                  />
                )}
              />
              {errors.address?.full && (
                <span className="text-red-500">
                  {errors.address.full.message}
                </span>
              )}
            </div>
          </div>

          <h2 className="mb-2 mt-4 pl-5 text-sm font-semibold text-muted-foreground">
            Basic Information
          </h2>
          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="Emergency_Phone"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Emergency Phone Number
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="Emergency_Phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="Emergency_Phone"
                    placeholder="Emergency Phone Number"
                    type="tel"
                    value={
                      field.value ||
                      data?.output?.employee?.Emergency_Phone ||
                      ''
                    }
                  />
                )}
              />
              {errors?.Emergency_Phone && (
                <span className="text-red-500">
                  {errors?.Emergency_Phone.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="Marital_Status"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Marital Status
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="Marital_Status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={
                      field.value || data?.output?.employee?.Marital_Status
                    }
                  >
                    <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                      <SelectValue placeholder="Select Marital Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="text-sm">
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="unmarried">Unmarried</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.Marital_Status && (
                <span className="text-red-500">
                  {errors?.Marital_Status.message}
                </span>
              )}
            </div>
          </div>

          <h2 className="mb-2 mt-4 pl-5 text-sm font-semibold text-muted-foreground">
            Family Details
          </h2>
          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="Family_Name"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Family Name
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="Family_Name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="Family_Name"
                    placeholder="Family Name"
                    value={
                      field.value || data?.output?.employee?.Family_Name || ''
                    }
                  />
                )}
              />
              {errors?.Family_Name && (
                <span className="text-red-500">
                  {errors?.Family_Name.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="Family_Relation"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Family Relation
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="Family_Relation"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="Family_Relation"
                    placeholder="Family Relation"
                    value={
                      field.value ||
                      data?.output?.employee?.Family_Relation ||
                      ''
                    }
                  />
                )}
              />
              {errors?.Family_Relation && (
                <span className="text-red-500">
                  {errors?.Family_Relation.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="Family_Occupation"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Family Occupation
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="Family_Occupation"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="Family_Occupation"
                    placeholder="Family Occupation"
                    value={
                      field.value ||
                      data?.output?.employee?.Family_Occupation ||
                      ''
                    }
                  />
                )}
              />
              {errors?.Family_Occupation && (
                <span className="text-red-500">
                  {errors?.Family_Occupation.message}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4 grid grid-cols-12 gap-4">
            <Label
              htmlFor="Family_PhoneNo"
              className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
            >
              Family Phone Number
            </Label>
            <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
              <Controller
                name="Family_PhoneNo"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="Family_PhoneNo"
                    placeholder="Family Phone Number"
                    type="tel"
                    value={
                      field.value ||
                      data?.output?.employee?.Family_PhoneNo ||
                      ''
                    }
                  />
                )}
              />
              {errors?.Family_PhoneNo && (
                <span className="text-red-500">
                  {errors?.Family_PhoneNo.message}
                </span>
              )}
            </div>
          </div>
        </>

        <div className="mb-4 grid grid-cols-12 gap-4">
          <Label
            htmlFor="profileDescription"
            className="col-span-12 mt-3 text-right md:col-span-4 lg:col-span-4"
          >
            Profile Description
          </Label>
          <div className="relative col-span-12 md:col-span-8 lg:col-span-8">
            <Controller
              name="profileDescription"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="profileDescription"
                  placeholder="Enter Profile Description...."
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button size={'sm'} type="submit" disabled={isLoading || isPending}>
            Update Profile {isPending && '...'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileTab;
