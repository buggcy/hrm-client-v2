import * as React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Details } from './Details';
import { ExperienceTable } from './Experience';
import { KYC } from './KYC';

export function VerifyCodeForm() {
  const [activeTab, setActiveTab] = useState('verify-code');
  return (
    <Card className="min-w-[700px]">
      <CardHeader>
        <Tabs
          defaultValue="verify-code"
          className="flex w-full flex-col items-center"
          onValueChange={value => setActiveTab(value)}
        >
          <TabsList className="flex w-[500px] justify-between">
            <TabsTrigger value="verify-code">Verify Code</TabsTrigger>
            <TabsTrigger value="personal-details">Personal Details</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="educational-document">
              Educational Document
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal-details">
            <div className="mx-auto grid w-full items-center gap-4">
              <Details />
            </div>
          </TabsContent>

          <TabsContent value="kyc">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <KYC />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="educational-document">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <ExperienceTable />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>

      <CardFooter className="flex flex-col justify-between">
        {activeTab === 'verify-code' && (
          <>
            <div className="mx-auto mb-8 grid w-9/12 items-center gap-4">
              <CardTitle className="pt-8 text-center">Verify Code</CardTitle>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="code">Enter your code</Label>
                <Input id="code" placeholder="Enter your code" />
              </div>
            </div>
            <Button className="mx-auto w-9/12" type="submit">
              Verify Code
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
