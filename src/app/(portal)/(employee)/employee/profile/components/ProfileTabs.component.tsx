import React, { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';

import AdditionalTab from './AdditionalTab';
import EducationTab from './EducationTab';
import KycTab from './KycTab';
import OverviewTab from './OverviewTab';

const ProfileTabs = ({ user }) => {
  const [activeTab, setActiveTab] = useState<string>('Overview');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-2 h-9 p-0.5">
          <TabsTrigger className="h-8" value="Overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="h-8" value="Kyc">
            Kyc
          </TabsTrigger>
          <TabsTrigger className="h-8" value="Education">
            Education & Experience
          </TabsTrigger>
          <TabsTrigger className="h-8" value="Additional">
            Additional
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Card>
        {activeTab === 'Overview' && (
          <CardContent>
            <OverviewTab user={user} />
          </CardContent>
        )}
        {activeTab === 'Kyc' && (
          <CardContent>
            <TooltipProvider>
              <KycTab user={user} />
            </TooltipProvider>
          </CardContent>
        )}
        {activeTab === 'Education' && (
          <CardContent>
            <div className="mb-2 mt-4 text-sm font-bold">Education</div>
            {user?.educationExperiences?.length > 0 ? (
              <EducationTab user={user} type={'education'} />
            ) : (
              <p className="mt-3 text-center text-gray-600">
                {'Currently No Education Available!'}
              </p>
            )}
            <div className="mb-2 mt-4 text-sm font-bold">Experience</div>
            {user?.educationExperiences?.length > 0 ? (
              <EducationTab user={user} type={'experience'} />
            ) : (
              <p className="mt-3 text-center text-gray-600">
                {'Currently No Experience Available!'}
              </p>
            )}
          </CardContent>
        )}
        {activeTab === 'Additional' && (
          <CardContent>
            <AdditionalTab user={user} />
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default ProfileTabs;
