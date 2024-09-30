'use client';
import React from 'react';

import moment from 'moment';

import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';

import { EducationExperiences } from '@/types/employee.types';
interface EducationTabProps {
  educationExperiences: EducationExperiences[];
  type: 'education' | 'experience';
}
const EducationTab: React.FC<EducationTabProps> = ({
  educationExperiences,
  type,
}) => {
  const filteredExperiences = educationExperiences?.filter(
    experience => experience.type === type,
  );
  return (
    <>
      {type === 'education' && (
        <div className="overflow-x-auto">
          <Table className="mb-0 w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b p-2 text-left">Degree</th>
                <th className="border-b p-2 text-left">Institute</th>
                <th className="border-b p-2 text-left">Duration</th>
                <th className="border-b p-2 text-left">Document Type</th>
                <th className="border-b p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExperiences && filteredExperiences.length > 0 ? (
                filteredExperiences.map((experience, index) => (
                  <tr key={index}>
                    <td className="border-b p-2">
                      {experience?.Position || '-'}
                    </td>
                    <td className="border-b p-2">
                      {experience?.Institute || '-'}
                    </td>
                    <td className="border-b p-2">
                      {moment(
                        experience?.Start_Date as string | number | Date,
                      ).format('DD-MM-YYYY') || '-'}{' '}
                      -{' '}
                      {moment(
                        experience?.End_Date as string | number | Date,
                      ).format('DD-MM-YYYY') || '-'}
                    </td>
                    <td className="border-b p-2">
                      {experience?.documentType || '-'}
                    </td>
                    <td className="border-b p-2">
                      <Button
                        size={'sm'}
                        onClick={() =>
                          window.open(String(experience?.Document), '_blank')
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border-b p-2 text-center text-gray-500"
                  >
                    No Education Provided!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
      {type === 'experience' && (
        <div className="overflow-x-auto">
          <Table className="mb-0 w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b p-2 text-left">Position</th>
                <th className="border-b p-2 text-left">Company</th>
                <th className="border-b p-2 text-left">Duration</th>
                <th className="border-b p-2 text-left">Reference</th>
                <th className="border-b p-2 text-left">Document Type</th>
                <th className="border-b p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExperiences && filteredExperiences.length > 0 ? (
                filteredExperiences.map((experience, index) => (
                  <tr key={index}>
                    <td className="border-b p-2">
                      {experience?.Position || '-'}
                    </td>
                    <td className="border-b p-2">
                      {experience?.Institute || '-'}
                    </td>
                    <td className="border-b p-2">
                      {moment(
                        experience?.Start_Date as string | number | Date,
                      ).format('DD-MM-YYYY') || '-'}{' '}
                      -{' '}
                      {moment(
                        experience?.End_Date as string | number | Date,
                      ).format('DD-MM-YYYY') || '-'}
                    </td>
                    <td className="border-b p-2">
                      {experience?.referenceNumber || '-'}
                    </td>
                    <td className="border-b p-2">
                      {experience?.documentType || '-'}
                    </td>
                    <td className="border-b p-2">
                      <Button
                        size={'sm'}
                        onClick={() =>
                          window.open(String(experience?.Document), '_blank')
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border-b p-2 text-center text-gray-500"
                  >
                    No Experience Provided!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default EducationTab;
