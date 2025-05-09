'use client';
import React, { FunctionComponent, useState } from 'react';

import Header from '@/components/Header/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [activeTab, setActiveTab] = useState<string>('Designation Type');
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <>
      <Header subheading="Easily Add and Manage Configuration Types!"></Header>
      <div>
        <div className="mt-3 flex flex-wrap">
          <div className="mb-2 w-full px-0 py-1 md:w-3/12 md:px-4 lg:w-3/12 lg:px-4">
            {' '}
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="col-span-3"
            >
              <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="Designation Type"
                >
                  <span className="capitalize">Designation Type</span>
                </TabsTrigger>

                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="Education Type"
                >
                  <span className="capitalize">Education Type</span>
                </TabsTrigger>

                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="Experience Type"
                >
                  <span className="capitalize">Experience Type</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="Feedback Type"
                >
                  <span className="capitalize">Feedback Type</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="Time Cut Off"
                >
                  <span className="capitalize">Time Cut Off</span>
                </TabsTrigger>
                <TabsTrigger
                  className="flex-1 p-3 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-500 sm:w-full sm:justify-start"
                  value="Tax Calculation"
                >
                  <span className="capitalize">Tax Calculation</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="w-full px-0 md:w-9/12 md:px-4 lg:w-9/12 lg:px-4">
            <Card className="py-4">
              {activeTab === 'Designation Type' && (
                <CardContent>
                  <DesignationTypeTable />
                </CardContent>
              )}
              {activeTab === 'Education Type' && (
                <CardContent>
                  <EducationTypeTable />
                </CardContent>
              )}
              {activeTab === 'Experience Type' && (
                <CardContent>
                  <ExperienceTypeTable />
                </CardContent>
              )}
              {activeTab === 'Feedback Type' && (
                <CardContent>
                  <FeedbackTypeTable />
                </CardContent>
              )}
              {activeTab === 'Time Cut Off' && (
                <CardContent>
                  <TimeCutOffTable />
                </CardContent>
              )}
              {activeTab === 'Tax Calculation' && (
                <CardContent>
                  <TaxTable />
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigurationTypeTable;
