'use client';
import React, { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';

import AdditionalTab from './AdditionalTab';
import EducationTab from './EducationTab';
import KycTab from './KycTab';
import OverviewTab from './OverviewTab';

import {
  AdditionalDocuments,
  EducationExperiences,
  Employee,
  Kyc,
} from '@/types/employee.types';
import { User } from '@/types/user.types';

interface ProfileTabsProps {
  currentUser: User;
  user: Employee;
  kyc: Kyc[];
  educationExperiences: EducationExperiences[];
  additionalDocuments: AdditionalDocuments[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  currentUser,
  user,
  kyc,
  educationExperiences,
  additionalDocuments,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-2 flex h-9 p-0.5">
          <TabsTrigger className="h-8 w-1/4 sm:w-1/5" value="Overview">
            Overview
          </TabsTrigger>
          {currentUser?.roleId === 2 ? (
            <>
              <TabsTrigger className="h-8 w-1/4 sm:w-1/5" value="Kyc">
                Kyc
              </TabsTrigger>
              <TabsTrigger className="h-8 grow sm:w-2/5" value="Education">
                Education & Experience
              </TabsTrigger>
              <TabsTrigger className="h-8 w-1/4 sm:w-1/5" value="Additional">
                Additional
              </TabsTrigger>
            </>
          ) : null}
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
              <KycTab kyc={kyc} />
            </TooltipProvider>
          </CardContent>
        )}
        {activeTab === 'Education' && (
          <CardContent>
            <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
              Education
            </div>
            {educationExperiences?.length > 0 ? (
              <EducationTab
                educationExperiences={educationExperiences}
                type={'education'}
              />
            ) : (
              <p className="mt-3 text-center text-gray-600 dark:text-gray-300">
                {'Currently No Education Available!'}
              </p>
            )}
            <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
              Experience
            </div>
            {educationExperiences?.length > 0 ? (
              <EducationTab
                educationExperiences={educationExperiences}
                type={'experience'}
              />
            ) : (
              <p className="mt-3 text-center text-gray-600 dark:text-gray-300">
                {'Currently No Experience Available!'}
              </p>
            )}
          </CardContent>
        )}
        {activeTab === 'Additional' && (
          <CardContent>
            <AdditionalTab additionalDocuments={additionalDocuments} />
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default ProfileTabs;
