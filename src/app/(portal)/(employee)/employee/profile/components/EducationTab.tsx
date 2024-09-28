import React from 'react';

import moment from 'moment';

import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';

const EducationTab = ({ user, type }) => {
  const filteredExperiences = user?.educationExperiences?.filter(
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
              {filteredExperiences?.map((experience, index) => (
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
                      onClick={() =>
                        window.open(String(experience?.Document), '_blank')
                      }
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
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
              {filteredExperiences?.map((experience, index) => (
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
                      onClick={() =>
                        window.open(String(experience?.Document), '_blank')
                      }
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default EducationTab;
