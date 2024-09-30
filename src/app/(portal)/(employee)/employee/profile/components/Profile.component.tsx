'use client';
import React from 'react';

import ProfileDetails from './ProfileDetails.component';
import ProfileTabs from './ProfileTabs.component';

import {
  AdditionalDocuments,
  EducationExperiences,
  Employee,
  Kyc,
} from '@/types/employee.types';

interface ProfileComponentProps {
  user:
    | {
        output: {
          employee: Employee;
          kyc: Kyc[];
          educationExperiences: EducationExperiences[];
          additionalDocuments: AdditionalDocuments[];
        };
      }
    | undefined;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ user }) => {
  if (!user) return null;

  const { employee, kyc, educationExperiences, additionalDocuments } =
    user.output;
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full p-4 md:w-4/12 lg:w-4/12">
          <ProfileDetails user={employee} />
        </div>
        <div className="w-full p-4 md:w-8/12 lg:w-8/12">
          <ProfileTabs
            user={employee}
            kyc={kyc}
            educationExperiences={educationExperiences}
            additionalDocuments={additionalDocuments}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileComponent;
