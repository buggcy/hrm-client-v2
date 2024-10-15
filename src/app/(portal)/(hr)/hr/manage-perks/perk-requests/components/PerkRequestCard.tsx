import React from 'react';
import Link from 'next/link';

import { Eye, Mail, Phone } from 'lucide-react';

import CopyToClipboard from '@/components/CopyToClipboard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { HrPerkRequests } from '@/types/hr-perks-list.types';

interface PerkRequestCardProps {
  perkRequest: HrPerkRequests;
  isApproving: boolean;
  isRejecting: boolean;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
}

const PerkRequestCard = ({
  perkRequest,
  isApproving,
  isRejecting,
  handleApprove,
  handleReject,
}: PerkRequestCardProps) => {
  const date = new Date(perkRequest.dateApplied);
  return (
    <Card className="min-w-[320px] p-4 md:max-w-[400px]" key={perkRequest._id}>
      <CardHeader className="flex flex-row justify-between p-0">
        <div>
          <Avatar>
            <AvatarImage
              src={perkRequest.userId.Avatar}
              alt={`${perkRequest.userId.firstName.charAt(0)} ${perkRequest.userId.lastName.charAt(0)}`}
            />
            <AvatarFallback>
              {perkRequest.userId.firstName.charAt(0)}
              {perkRequest.userId.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-row gap-2">
          <Badge variant="label" className="w-fit truncate text-sm">
            {date.toDateString()}
          </Badge>
          <CopyToClipboard
            text={perkRequest.userId.companyEmail}
            icon={<Mail size={12} />}
            type="Email address"
          />
          <CopyToClipboard
            text={perkRequest.userId.contactNo}
            icon={<Phone size={12} />}
            type="Contact number"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <CardTitle className="text-lg">
          {perkRequest.userId.firstName} {perkRequest.userId.lastName}
        </CardTitle>
        <CardDescription className="text-sm font-medium">
          {perkRequest.userId.companyEmail}
        </CardDescription>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <p>
              <strong>Perk: </strong>
            </p>
            <p>{perkRequest.perksId.name}</p>
          </div>
          <div className="flex justify-between">
            <p>
              <strong>Increment Assigned: </strong>
            </p>
            <p>{perkRequest.assignedIncrementAmount}</p>
          </div>
          <div className="flex justify-between">
            <p>
              <strong>Increment Requested: </strong>
            </p>
            <p>{perkRequest.incrementAmount}</p>
          </div>
          <div className="flex justify-between">
            <p className="flex items-center gap-4">
              <strong>Proof Document: </strong>
            </p>
            <Link
              href={perkRequest.Proof_Document}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Eye
                size={16}
                className="transition-colors duration-200 hover:text-blue-500"
              />
            </Link>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end gap-4 p-0 pt-6">
        <Button
          variant="destructiveOutline"
          size="sm"
          disabled={isApproving || isRejecting}
          onClick={() => handleReject(perkRequest._id)}
        >
          Reject
        </Button>
        <Button
          variant="default"
          size="sm"
          disabled={isApproving || isRejecting}
          onClick={() => handleApprove(perkRequest._id)}
        >
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PerkRequestCard;
