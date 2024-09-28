import React, { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { maskedAccountNumber } from '@/utils';

const KycTab = ({ user }) => {
  const [showFullAccountNumber, setShowFullAccountNumber] = useState(false);
  const [showFullIban, setShowFullIban] = useState(false);
  return (
    <TooltipProvider>
      <>
        <div className="mb-2 mt-4 text-sm font-bold">CNIC Details</div>
        <dl className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <dt className="font-medium">CNIC Number</dt>
          <dd className="tracking-wide text-gray-700">
            {user?.cnic?.number || '41303-0000000-0'}
          </dd>
          <dt className="font-medium">Front Of CNIC Image</dt>
          <dd className="text-gray-700">
            {user?.cnic?.frontPicture ? (
              <span>
                {typeof user?.cnic?.frontPicture === 'string' &&
                  decodeURIComponent(
                    String(user.cnic.frontPicture)
                      .split('/')
                      .pop()
                      ?.split('.')[0] || '',
                  )}
                <Eye
                  className="ml-2 inline cursor-pointer"
                  onClick={() =>
                    user?.cnic?.frontPicture &&
                    window.open(String(user.cnic.frontPicture), '_blank')
                  }
                  size={18}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2 inline cursor-pointer">
                      <Eye />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Click to Preview Image</TooltipContent>
                </Tooltip>
              </span>
            ) : (
              '-'
            )}
          </dd>
          <dt className="font-medium">Back Of CNIC Image</dt>
          <dd className="text-gray-700">
            {user?.cnic?.backPicture ? (
              <span>
                {typeof user?.cnic?.backPicture === 'string' &&
                  decodeURIComponent(
                    String(user.cnic.backPicture)
                      .split('/')
                      .pop()
                      ?.split('.')[0] || '',
                  )}
                <Eye
                  className="ml-2 inline cursor-pointer"
                  onClick={() =>
                    user?.cnic?.backPicture &&
                    window.open(String(user.cnic.backPicture), '_blank')
                  }
                  size={18}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2 inline cursor-pointer">
                      <Eye />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Click to Preview Image</TooltipContent>
                </Tooltip>
              </span>
            ) : (
              '-'
            )}
          </dd>
        </dl>

        <div className="my-4 border-b border-gray-300" />

        <div className="mb-2 mt-4 text-sm font-bold">Bank Details</div>
        <dl className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <dt className="font-medium">Account Number</dt>
          <dd className="tracking-wider text-gray-700">
            {showFullAccountNumber
              ? user?.bankDetails?.accountNumber || ''
              : maskedAccountNumber(String(user?.bankDetails?.iban || ''))}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() =>
                    setShowFullAccountNumber(!showFullAccountNumber)
                  }
                >
                  {showFullAccountNumber ? (
                    <EyeOff className="ml-2 inline" size={18} />
                  ) : (
                    <Eye className="ml-2 inline" size={18} />
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {showFullAccountNumber
                  ? 'Privacy Mode On'
                  : 'Reveal the Number!'}
              </TooltipContent>
            </Tooltip>
          </dd>
          <dt className="font-medium">Account Name</dt>
          <dd className="text-gray-700">
            {user?.bankDetails?.accountHolderName || '-'}
          </dd>
          <dt className="font-medium">Bank Name</dt>
          <dd className="text-gray-700">
            {user?.bankDetails?.branchName || '-'}
          </dd>
          <dt className="font-medium">IBAN Number</dt>
          <dd className="capitalize tracking-wider text-gray-700">
            {showFullIban
              ? user?.bankDetails?.iban || ''
              : maskedAccountNumber(String(user?.bankDetails?.iban || ''))}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="ml-2 cursor-pointer"
                  onClick={() => setShowFullIban(!showFullIban)}
                >
                  {showFullIban ? (
                    <EyeOff className="ml-2 inline" size={18} />
                  ) : (
                    <Eye className="ml-2 inline" size={18} />
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {showFullIban ? 'Privacy Mode On' : 'Reveal the IBAN!'}
              </TooltipContent>
            </Tooltip>
          </dd>
        </dl>
      </>
    </TooltipProvider>
  );
};

export default KycTab;
