'use client';

import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EmployeeDataApiResponse } from '@/libs/validations/edit-employee';

import Additional from './forms/Additional';
import Address from './forms/Address';
import EducationExperiences from './forms/EducationExperiences';
import KYC from './forms/KYC';
import Personal from './forms/Personal';

interface ProfileEditProps {
  data?: EmployeeDataApiResponse;
}

const ProfileEdit = ({ data }: ProfileEditProps) => {
  return (
    <Tabs defaultValue="personal">
      <TabsList className="flex size-full flex-col justify-start md:flex-row">
        <TabsTrigger value="personal" className="w-full md:w-fit">
          Personal
        </TabsTrigger>
        <TabsTrigger value="address" className="w-full md:w-fit">
          Address
        </TabsTrigger>
        <TabsTrigger value="kyc" className="w-full md:w-fit">
          KYC
        </TabsTrigger>
        <TabsTrigger value="education-experience" className="w-full md:w-fit">
          Education & Experiences
        </TabsTrigger>
        <TabsTrigger value="additional-documents" className="w-full md:w-fit">
          Additional Documents
        </TabsTrigger>
      </TabsList>
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
