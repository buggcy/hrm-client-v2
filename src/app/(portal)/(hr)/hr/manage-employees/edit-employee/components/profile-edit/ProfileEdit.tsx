'use client';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EmployeeDataApiResponse } from '@/libs/validations/edit-employee';

import Additional from './forms/Additional';
import Address from './forms/Address';
import EducationExperiences from './forms/EducationExperiences';
import KYC from './forms/KYC';
import Personal from './forms/Personal';
import Profile from './forms/Profile';

interface ProfileEditProps {
  data?: EmployeeDataApiResponse;
}

const ProfileEdit = ({ data }: ProfileEditProps) => {
  return (
    <Tabs defaultValue="profile">
      <TabsList className="flex size-full flex-col justify-start lg:flex-row">
        <TabsTrigger value="profile" className="w-full px-3.5 lg:w-fit">
          Profile
        </TabsTrigger>
        <TabsTrigger value="personal" className="w-full px-3.5 lg:w-fit">
          Personal
        </TabsTrigger>
        <TabsTrigger value="address" className="w-full px-3.5 lg:w-fit">
          Address
        </TabsTrigger>
        <TabsTrigger value="kyc" className="w-full px-3.5 lg:w-fit">
          KYC
        </TabsTrigger>
        <TabsTrigger
          value="education-experience"
          className="w-full px-3.5 lg:w-fit"
        >
          Education & Experiences
        </TabsTrigger>
        <TabsTrigger
          value="additional-documents"
          className="w-full px-3.5 lg:w-fit"
        >
          Additional Documents
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Profile
          data={data?.output?.employee}
          empId={data?.output?.employee?._id}
        />
      </TabsContent>
      <TabsContent value="personal">
        <Personal
          data={data?.output?.employee}
          empId={data?.output?.employee?._id}
        />
      </TabsContent>
      <TabsContent value="address">
        <Address
          data={data?.output?.employee?.Address}
          empId={data?.output?.employee?._id}
        />
      </TabsContent>
      <TabsContent value="kyc">
        <KYC data={data?.output?.kyc[0]} empId={data?.output?.employee?._id} />
      </TabsContent>
      <TabsContent value="education-experience">
        <EducationExperiences
          data={data?.output?.educationExperiences}
          empId={data?.output?.employee?._id}
        />
      </TabsContent>
      <TabsContent value="additional-documents">
        <Additional
          data={data?.output?.additionalDocuments}
          empId={data?.output?.employee?._id}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileEdit;
