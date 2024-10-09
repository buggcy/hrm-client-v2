'use client';

import { FunctionComponent } from 'react';
import Link from 'next/link';

import { Eye } from 'lucide-react';

import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const cardData = [
  {
    id: 1,
    startDate: '01/01/2021',
    endDate: '01/01/2021',
    noOfDays: 1,
    leaveType: 'Sick Leave',
    proofDocumentURL: 'https://randomuser.me/api/portraits',
    requestedOn: '01/01/2021',
  },
  {
    id: 2,
    startDate: '01/01/2021',
    endDate: '01/01/2021',
    noOfDays: 1,
    leaveType: 'Sick Leave',
    proofDocumentURL: 'https://randomuser.me/api/portraits',
    requestedOn: '01/01/2021',
  },
  {
    id: 3,
    startDate: '01/01/2021',
    endDate: '01/01/2021',
    noOfDays: 1,
    leaveType: 'Sick Leave',
    proofDocumentURL: 'https://randomuser.me/api/portraits',
    requestedOn: '01/01/2021',
  },
  {
    id: 4,
    startDate: '01/01/2021',
    endDate: '01/01/2021',
    noOfDays: 1,
    leaveType: 'Sick Leave',
    proofDocumentURL: 'https://randomuser.me/api/portraits',
    requestedOn: '01/01/2021',
  },
  {
    id: 5,
    startDate: '01/01/2021',
    endDate: '01/01/2021',
    noOfDays: 1,
    leaveType: 'Sick Leave',
    proofDocumentURL: 'https://randomuser.me/api/portraits',
    requestedOn: '01/01/2021',
  },
  {
    id: 6,
    startDate: '01/01/2021',
    endDate: '01/01/2021',
    noOfDays: 1,
    leaveType: 'Sick Leave',
    proofDocumentURL: 'https://randomuser.me/api/portraits',
    requestedOn: '01/01/2021',
  },
  {
    id: 7,
    startDate: '01/01/2021',
    endDate: '01/01/2021',
    noOfDays: 1,
    leaveType: 'Sick Leave',
    proofDocumentURL: 'https://randomuser.me/api/portraits',
    requestedOn: '01/01/2021',
  },
  {
    id: 8,
    startDate: '01/01/2021',
    endDate: '01/01/2021',
    noOfDays: 1,
    leaveType: 'Sick Leave',
    proofDocumentURL: 'https://randomuser.me/api/portraits',
    requestedOn: '01/01/2021',
  },
];

interface HrLeaveRequestsProps {}

const HrLeaveRequests: FunctionComponent<HrLeaveRequestsProps> = () => {
  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Attendance">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-12 px-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cardData.map(data => (
            <Card key={data.id}>
              <CardHeader className="border-b-2 p-4">
                <CardTitle className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://randomuser.me/api/portraits" />
                    <AvatarFallback className="text-base">HR</AvatarFallback>
                  </Avatar>
                  <CardDescription>Employee Name</CardDescription>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-4">
                <p>
                  <strong>Start Date:</strong> {data.startDate}
                </p>
                <p>
                  <strong>End Date:</strong> {data.endDate}
                </p>
                <p>
                  <strong>No of Days:</strong> {data.noOfDays}
                </p>
                <p>
                  <strong>Leave Type:</strong> {data.leaveType}
                </p>
                <p className="flex items-center">
                  <strong>Proof Document:</strong>{' '}
                  <Button variant="ghostSecondary" className="size-2">
                    <Link href={data.proofDocumentURL}>
                      <Eye size={16} />
                    </Link>
                  </Button>
                </p>
                <p>
                  <strong>Requested On:</strong> {data.requestedOn}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-4 border-t-2 p-4">
                <Button variant="destructiveOutline">Reject</Button>
                <Button variant="default">Approve</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </LayoutWrapper>
    </Layout>
  );
};

export default HrLeaveRequests;
