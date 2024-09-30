'use client';
import React from 'react';

import { FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';

import { AdditionalDocuments } from '@/types/employee.types';

interface AdditionalTabsProps {
  additionalDocuments: AdditionalDocuments[];
}
const AdditionalTab: React.FC<AdditionalTabsProps> = ({
  additionalDocuments,
}) => {
  return (
    <>
      <div className="mb-2 mt-4 text-sm font-bold">Additional Document</div>
      {additionalDocuments?.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="mb-0 min-w-full">
            <thead>
              <tr>
                <th className="border-t-0 p-2 text-left align-middle">
                  Documents
                </th>
                <th className="border-t-0 p-2 text-right align-middle">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {additionalDocuments?.map((documentGroup, index) =>
                documentGroup?.Document?.map((documentUrl, docIndex) => (
                  <tr key={`${index}-${docIndex}`}>
                    <td className="p-2 align-middle">
                      <div className="flex items-center">
                        {documentUrl?.split('.')?.pop() === 'pdf' ? (
                          <FileText className="mr-3 text-red-500" size={35} />
                        ) : (
                          <img
                            src={documentUrl}
                            alt="Document_Img"
                            className="mr-3 size-8 rounded-full border border-gray-300 object-cover"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-800">
                            {decodeURIComponent(
                              String(documentUrl)
                                ?.split('/')
                                .pop()
                                ?.split('.')[0] || '',
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {documentUrl?.split('.')?.pop()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-right align-middle">
                      <Button
                        size={'sm'}
                        onClick={() =>
                          window.open(String(documentUrl), '_blank')
                        }
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className="mt-3 text-center text-gray-600">
          Currently No Additional Documents Available!
        </p>
      )}
    </>
  );
};

export default AdditionalTab;
