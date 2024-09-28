import React from 'react';

import moment from 'moment';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ProfileDetails = ({ user }) => {
  return (
    <>
      <Card>
        <CardContent>
          <div className="my-3 flex justify-center">
            <Avatar className="size-16">
              <AvatarImage src="" alt="User Avatar" />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mb-4 text-center">
            <a
              className="text-lg font-semibold text-gray-800 hover:underline"
              href="#"
            >
              {user?.firstName || '-'} {user?.lastName || '-'}
            </a>
            <div className="mt-2 text-center text-gray-600">
              {user?.Designation || ''}
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full border border-gray-300 bg-transparent text-black"
          >
            Edit Profile
          </Button>

          <div className="my-4 border-b border-gray-300" />

          <div className="mb-2 mt-4 text-base font-bold">Summary</div>
          <p>{user?.profileDescription || 'No Summary available'}</p>

          <div className="my-4 border-b border-gray-300" />

          <div className="mb-2 mt-4 text-base font-bold">Current Status</div>
          <div className="mb-4 text-left">
            <Badge>{user?.Current_Status || 'unknown'}</Badge>
          </div>
          <div className="my-4 border-b border-gray-300" />

          <div className="mb-2 mt-4 text-base font-bold">Contact</div>
          <dl className="grid grid-cols-1 gap-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Phone:</dt>
              <dd className="text-gray-600">{user?.contactNo || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Email:</dt>
              <dd className="text-gray-600">{user?.email || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Gender:</dt>
              <dd className="capitalize text-gray-600">
                {user?.Gender || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">DOB:</dt>
              <dd className="text-gray-600">
                {user?.DOB
                  ? moment(user.DOB as string | number | Date).format(
                      'YYYY-MM-DD',
                    )
                  : '-'}
              </dd>
            </div>
          </dl>
          <div className="my-4 border-b border-gray-300" />
          <div className="mb-2 mt-4 text-base font-bold">Address</div>
          <dl className="grid grid-cols-1 gap-y-2">
            <div className="flex justify-between">
              <dt className="font-medium">Full Address:</dt>
              <dd className="text-gray-600">{user?.Address?.full || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Country:</dt>
              <dd className="text-gray-600">{user?.Address?.country || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Province:</dt>
              <dd className="text-gray-600">
                {user?.Address?.province || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">City:</dt>
              <dd className="text-gray-600">{user?.Address?.city || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Street:</dt>
              <dd className="text-gray-600">{user?.Address?.street || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Land Mark:</dt>
              <dd className="text-gray-600">
                {user?.Address?.landMark || '-'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Postal Code:</dt>
              <dd className="text-gray-600">{user?.Address?.zip || '-'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileDetails;
