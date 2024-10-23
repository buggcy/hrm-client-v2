import React from 'react';

import { EducationExperienceType } from '@/libs/validations/edit-employee';

import EducationExperienceTable from '../components/EducationExperienceTable.component';

interface EducationExperiencesProps {
  empId?: string;
  data?: EducationExperienceType[];
}

const EducationExperiences = ({ empId, data }: EducationExperiencesProps) => {
  return (
    <div>
      <EducationExperienceTable empId={empId} eduExpData={data} />
    </div>
  );
};

export default EducationExperiences;
