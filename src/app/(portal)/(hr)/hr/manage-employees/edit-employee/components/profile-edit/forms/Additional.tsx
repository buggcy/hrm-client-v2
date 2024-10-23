'use client';

import React from 'react';

import { AdditionalDocumentType } from '@/libs/validations/edit-employee';

import AdditionalDocumentsTable from '../components/AdditionalDocumentsTable.component';

interface AdditionalProps {
  empId?: string;
  data?: AdditionalDocumentType[];
}

const Additional = ({ empId, data }: AdditionalProps) => {
  return (
    <AdditionalDocumentsTable empId={empId} additionalDocumentsData={data} />
  );
};

export default Additional;
