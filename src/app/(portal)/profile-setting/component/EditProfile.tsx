'use client';
import React, { useState } from 'react';

import { KeyRound, Pencil } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AccountTab from './AccountTab';
import ProfileTab from './ProfileTab';

import { User } from '@/types/user.types';
interface UserProps {
  user: User;
}
const EditProfileComponent: React.FC<UserProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const username = `${user?.firstName} ${user?.lastName}`;
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <>
      {' '}
      <div>
        <div className="ml-3 flex items-center gap-2.5">
          <Avatar className="size-16">
            {user?.Avatar ? (
              <AvatarImage src={user?.Avatar || ''} alt="User Avatar" />
            ) : (
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="dark:text-white">{username}</span>
            <span className="dark:text-gray-300">{user?.Designation}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap">
          <div className="mb-2 w-full px-0 py-1 md:w-4/12 md:px-4 lg:w-4/12 lg:px-4">
            {' '}
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="col-span-3"
            >
              <TabsList className="flex w-full justify-between bg-transparent p-0 md:flex-col md:space-y-4">
                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="profile"
                >
                  <Pencil className="mr-2 size-4" />
                  <span className="capitalize">Profile Edit</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="account"
                >
                  <KeyRound className="mr-2 size-4" />
                  <span className="capitalize">Account Edit</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="w-full px-0 md:w-8/12 md:px-4 lg:w-8/12 lg:px-4">
            <Card>
              {activeTab === 'profile' && (
                <CardContent>
                  <ProfileTab user={user} />
                </CardContent>
              )}
              {activeTab === 'account' && (
                <CardContent>
                  <AccountTab user={user} />
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileComponent;
