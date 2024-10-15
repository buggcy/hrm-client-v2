'use client';
import React from 'react';

import { TabsList } from '@radix-ui/react-tabs';
import { Bell } from 'lucide-react';

import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';

import { Additional } from './components/Additional';
import { Details } from './components/Details';
import { ExperienceTable } from './components/Experience';
import { KYC } from './components/KYC';
import { Profile } from './components/Profile';

export default function EditProfile() {
  return (
    <Layout className="flex w-full flex-col">
      <LayoutHeader title="Edit Details">
        <LayoutHeaderButtonsBlock>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="size-5" />
          </Button>
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>

      <LayoutWrapper wrapperClassName="flex flex-1" className="max-w-full">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-[19.125rem,1fr]">
          <Card className="flex w-full flex-col gap-4 rounded-md p-4 xl:p-6">
            <Card className="flex flex-col gap-2 rounded-md p-4">
              <h2 className="font-medium">Profile Edit</h2>
            </Card>

            <Card className="flex flex-col gap-2 rounded-md p-4">
              <h2 className="font-medium">Salary Increment</h2>
            </Card>

            <Card className="flex flex-col gap-2 rounded-md p-4">
              <h2 className="font-medium">Edit Designation</h2>
            </Card>
          </Card>

          <Card className="flex w-full flex-col gap-4 rounded-md p-4 sm:p-0 xl:p-6">
            <Card className="flex flex-col gap-2 rounded-md border-none p-4 shadow-none">
              {/* <VerifyCodeForm /> */}
              <div className="flex w-full flex-col">
                <Tabs
                  defaultValue="profile"
                  className="flex w-full flex-col items-center overflow-scroll"
                  //   onValueChange={value => setActiveTab(value)}
                >
                  <TabsList className="flex justify-between rounded-md bg-muted p-1">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="personal-details">
                      Personal Details
                    </TabsTrigger>
                    <TabsTrigger value="kyc">KYC</TabsTrigger>
                    <TabsTrigger value="educational-document">
                      Education & Experience
                    </TabsTrigger>
                    <TabsTrigger value="additional">Additional</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile">
                    <div className="flex flex-col space-y-1.5">
                      <Profile />
                    </div>
                  </TabsContent>

                  <TabsContent value="personal-details">
                    <Details />
                  </TabsContent>

                  <TabsContent value="kyc">
                    {/* <div className="flex flex-col space-y-1.5"> */}
                    <KYC />
                    {/* </div> */}
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
            </Card>
          </Card>
        </div>
      </LayoutWrapper>
    </Layout>
  );
}
