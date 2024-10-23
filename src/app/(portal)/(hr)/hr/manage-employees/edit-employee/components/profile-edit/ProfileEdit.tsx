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
        <Personal />
      </TabsContent>
      <TabsContent value="address">
        <Address
          data={data?.output?.employee?.Address}
          empId={data?.output?.employee?._id}
        />
      </TabsContent>
      <TabsContent value="kyc">
        <KYC />
      </TabsContent>
      <TabsContent value="education-experience">
        <EducationExperiences />
      </TabsContent>
      <TabsContent value="additional-documents">
        <Additional />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileEdit;
