'use client';
import React, { FunctionComponent, useState } from 'react';

import Header from '@/components/Header/Header';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import DesignationTypeTable from './DesignationTypeTable';
import EducationTypeTable from './EducationTypeTable';
import ExperienceTypeTable from './ExperienceTypeTable';
import FeedbackTypeTable from './FeedbackTypeTable';
import TaxTable from './TaxTable';
import TimeCutOffTable from './TimeCutOffTable';

interface ConfigurationTypeTableProps {}
const ConfigurationTypeTable: FunctionComponent<
  ConfigurationTypeTableProps
> = () => {
  const [selectedType, setSelectedType] = useState<string>('Designation Type');
  return (
    <>
      <Header subheading="Easily Add and Manage Configuration Types!">
        <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 md:max-w-[64%]">
              <SelectTrigger className="relative z-50 rounded-md border px-3 py-2 text-left text-sm">
                <SelectValue>{selectedType}</SelectValue>
              </SelectTrigger>
            </div>
            <SelectContent>
              <SelectGroup className="text-sm">
                <SelectItem value="Designation Type">
                  Designation Type
                </SelectItem>
                <SelectItem value="Education Type">Education Type</SelectItem>
                <SelectItem value="Experience Type">Experience Type</SelectItem>
                <SelectItem value="Feedback Type">Feedback Type</SelectItem>
                <SelectItem value="Time Cut Off">Time Cut Off</SelectItem>
                <SelectItem value="Tax Calculation">Tax Calculation</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Header>
      <div className="mt-4">
        {selectedType === 'Designation Type' && (
          <div>
            <DesignationTypeTable />
          </div>
        )}
        {selectedType === 'Education Type' && (
          <div>
            <EducationTypeTable />
          </div>
        )}
        {selectedType === 'Experience Type' && (
          <div>
            <ExperienceTypeTable />
          </div>
        )}
        {selectedType === 'Feedback Type' && (
          <div>
            <FeedbackTypeTable />
          </div>
        )}
        {selectedType === 'Time Cut Off' && (
          <div>
            <TimeCutOffTable />
          </div>
        )}
        {selectedType === 'Tax Calculation' && (
          <div>
            <TaxTable />
          </div>
        )}
      </div>
    </>
  );
};

export default ConfigurationTypeTable;
