import * as React from 'react';
import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Additional } from './Additional';
import { Details } from './Details';
import { ExperienceTable } from './Experience';
import { KYC } from './KYC';
import { Profile } from './Profile';

export function VerifyCodeForm() {
  const [setActiveTab] = useState('verify-code');

  return (
    <div className="flex w-full border-none shadow-none">
      <div className="flex w-full flex-col">
        <Tabs
          defaultValue="profile"
          className="flex w-full flex-col items-center"
          onValueChange={value => setActiveTab(value)}
        >
          <TabsList className="flex w-[600px] justify-between">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="personal-details">Personal Details</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="educational-document">
              Education & Experience
            </TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Profile />
          </TabsContent>

          <TabsContent value="personal-details">
            <Details />
          </TabsContent>

          <TabsContent value="kyc">
            <div className="flex flex-col space-y-1.5">
              <KYC />
            </div>
          </TabsContent>

          <TabsContent value="educational-document">
            <div className="flex flex-col space-y-1.5">
              <ExperienceTable />
            </div>
          </TabsContent>

          <TabsContent value="additional">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Additional />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
