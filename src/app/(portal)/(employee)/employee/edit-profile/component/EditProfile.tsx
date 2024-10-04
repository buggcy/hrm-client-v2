'use client';
import React, { useState } from 'react';

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
          <div
            className="mb-2 w-full px-4 md:w-4/12 lg:w-4/12"
            style={{ height: '100px' }}
          >
            {' '}
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="flex h-full flex-col"
            >
              <TabsList className="mb-2 flex size-full flex-col border-r p-0.5">
                <TabsTrigger
                  className="mb-2 h-12 w-full text-left"
                  value="profile"
                >
                  Profile Edit
                </TabsTrigger>
                <TabsTrigger className="h-12 w-full text-left" value="account">
                  Account Edit
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="w-full px-4 md:w-8/12 lg:w-8/12">
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
