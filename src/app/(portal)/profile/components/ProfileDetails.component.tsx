/* eslint-disable tailwindcss/no-custom-classname */
'use client';
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import moment from 'moment';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { EmployeeById } from '@/types/employee.types';

interface ProfileDetailsProps {
  user: EmployeeById;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const searchParams = useSearchParams();
  const userIdFromParams = searchParams.get('userId');

  return (
    <>
      <Card>
        <CardContent>
          <div className="my-3 flex justify-center">
            <Avatar className="size-16">
              {user?.Avatar ? (
                <AvatarImage src={user?.Avatar} alt="User Avatar" />
              ) : (
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="mb-4 text-center">
            <a
              className="text-lg font-semibold text-gray-800 hover:underline dark:text-white"
              href="#"
            >
              {user?.firstName || '-'} {user?.lastName || '-'}
            </a>
            <div className="mt-2 text-center text-gray-600 dark:text-gray-300">
              {user?.Designation || ''}
            </div>
          </div>
          {!userIdFromParams && (
            <Link href="/profile-setting">
              <Button
                variant="ghost"
                className="w-full border border-gray-300 bg-transparent text-black"
              >
                Edit Profile
              </Button>
            </Link>
          )}

          <div className="my-4 border-b border-gray-300" />

          <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
            Summary
          </div>
          <p className="dark:text-gray-300">
            {user?.profileDescription || 'No Summary available'}
          </p>

          <div className="my-4 border-b border-gray-300" />
          <div className="flex justify-between">
            <div className="mt-1 text-sm font-bold dark:text-white">
              Current Status
            </div>
            <div className="text-left">
              <Badge>{user?.Current_Status || 'unknown'}</Badge>
            </div>
          </div>
          <div className="my-4 border-b border-gray-300" />

          <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
            Contact
          </div>
          <dl className="grid grid-cols-1 gap-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Phone</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.contactNo || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Email</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.email || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Gender</dt>
              <dd className="capitalize leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Gender || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">DOB</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.DOB
                  ? moment(user.DOB as string | number | Date).format(
                      'YYYY-MM-DD',
                    )
                  : '-'}
              </dd>
            </div>
          </dl>
          <div className="my-4 border-b border-gray-300" />

          <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
            Address
          </div>
          <dl className="grid grid-cols-1 gap-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Country</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.country || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Province</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.province || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">City</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.city || '-'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium">Street</dt>
              <dd className="text-right leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.street || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Land Mark</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.landMark || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Postal Code</dt>
              <dd className="leading-relaxed text-gray-600 dark:text-gray-300">
                {user?.Address?.zip || '-'}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-nowrap font-medium">Full Address</dt>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <dd className="truncate text-right leading-relaxed text-gray-600 dark:text-gray-300">
                      {user?.Address?.full || '-'}
                    </dd>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user?.Address?.full || 'No address available'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </dl>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileDetails;
