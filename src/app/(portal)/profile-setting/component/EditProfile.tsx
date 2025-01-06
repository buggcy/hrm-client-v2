'use client';
import React, { useState } from 'react';

import { KeyRound, Pencil, UserMinus } from 'lucide-react';

import Header from '@/components/Header/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AccountTab from './AccountTab';
import ProfileTab from './ProfileTab';
import ResignationTab from './ResignationTab';

import { User } from '@/types/user.types';
interface UserProps {
  user: User;
}
const EditProfileComponent: React.FC<UserProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <>
      {' '}
      <Header subheading="Your Profile, Your Way — Manage Your Settings with Ease!"></Header>
      <div>
        <div className="mt-3 flex flex-wrap">
          <div className="mb-2 w-full px-0 py-1 md:w-3/12 md:px-4 lg:w-3/12 lg:px-4">
            {' '}
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="col-span-3"
            >
              <TabsList className="flex w-full justify-between bg-transparent p-0 md:flex-col md:space-y-4">
                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="profile"
                >
                  <Pencil className="mr-2 size-4" />
                  <span className="capitalize">Profile Edit</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="account"
                >
                  <KeyRound className="mr-2 size-4" />
                  <span className="capitalize">Account Edit</span>
                </TabsTrigger>
                {user?.roleId === 2 && (
                  <TabsTrigger
                    className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                    value="resignation"
                  >
                    <UserMinus className="mr-2 size-4" />
                    <span className="capitalize">Apply Resignation</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </div>
          <div className="w-full px-0 md:w-9/12 md:px-4 lg:w-9/12 lg:px-4">
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
              {activeTab === 'resignation' && (
                <CardContent>
                  <ResignationTab user={user} />
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
