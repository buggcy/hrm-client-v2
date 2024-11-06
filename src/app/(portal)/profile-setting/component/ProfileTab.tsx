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
});

export type EditPasswordFormData = z.infer<typeof FormSchema>;

const ProfileTab: React.FC<UserProps> = ({ user }) => {
  const userId: string | undefined = user?.id;

  const { data, refetch } = useReadEmployeeRecordQuery(userId, {
    enabled: !!userId,
  });
  const [updatedImg, setUpdatedImg] = useState<string | null>(null);
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
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        personalEmail: data.output.employee.email,
        contactNo: data.output.employee.contactNo,
        availability: data.output.employee.Current_Status,
        profileDescription: data.output.employee.profileDescription,
        address: {
          country: data.output.employee.Address?.country || '',
          city: data.output.employee.Address?.city || '',
          street: data.output.employee.Address?.street || '',
          province: data.output.employee.Address?.province || '',
          landMark: data.output.employee.Address?.landMark || '',
          zip: data.output.employee.Address?.zip || '',
          full: data.output.employee.Address?.full || '',
        },
      });
    }
  }, [data, reset]);

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

    const avatar = file || updatedImg;

    if (avatar) {
      formData.append('Avatar', avatar);
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
              <DialogDescription className="text-center">
                Please select a clear, high-resolution image.
              </DialogDescription>
            </DialogHeader>
            <div className="mx-auto grid gap-4 py-4">
              <ImageUpload
                initialAvatar={data?.output.employee.Avatar ?? ''}
                onSave={image => {
                  setUpdatedImg(image);
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
        {user?.roleId === 2 && (
          <>
            <h2 className="mb-2 mt-4 pl-5 text-sm font-semibold text-muted-foreground">
              Address Details
            </h2>

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
                      value={
                        field.value || data?.output?.employee?.Address?.country
                      }
                      onValueChange={value => field.onChange(value)}
                    >
                      <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="text-sm">
                          <SelectItem
                            value="Pakistan"
                            className="cursor-pointer rounded px-8 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            Pakistan
                          </SelectItem>
                          <SelectItem
                            value="India"
                            className="cursor-pointer rounded px-8 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            India
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.address?.country && (
                  <span className="text-red-500">
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
                        field.value || data?.output?.employee?.Address?.province
                      }
                      onValueChange={value => field.onChange(value)}
                    >
                      <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                        <SelectValue placeholder="Select Province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="text-sm">
                          <SelectItem
                            value="Punjab"
                            className="cursor-pointer rounded px-8 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            Punjab
                          </SelectItem>
                          <SelectItem
                            value="Sindh"
                            className="cursor-pointer rounded px-8 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            Sindh
                          </SelectItem>
                          <SelectItem
                            value="Khyber Pakhtunkhwa"
                            className="cursor-pointer rounded px-8 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            Khyber Pakhtunkhwa
                          </SelectItem>
                          <SelectItem
                            value="Gilgit-Baltistan"
                            className="cursor-pointer rounded px-8 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            Gilgit-Baltistan
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.address?.province && (
                  <span className="text-red-500">
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
                    <Input {...field} id="address.city" placeholder="City" />
                  )}
                />
                {errors.address?.city && (
                  <span className="text-red-500">
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
                    <Input
                      {...field}
                      id="address.street"
                      placeholder="Street"
                    />
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
          </>
        )}

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
