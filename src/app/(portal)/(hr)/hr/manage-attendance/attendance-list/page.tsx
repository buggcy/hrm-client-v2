'use client';

import { FunctionComponent, Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  ClipboardList,
  Clock,
  EllipsisVertical,
  Plus,
  RefreshCw,
} from 'lucide-react';

import { DateRangePicker, useTimeRange } from '@/components/DateRangePicker';
import Header from '@/components/Header/Header';
import { HighTrafficBanner } from '@/components/HighTrafficBanner';
import {
  Layout,
  LayoutHeader,
  LayoutHeaderButtonsBlock,
  LayoutWrapper,
} from '@/components/Layout';
import { Notification } from '@/components/NotificationIcon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAttendanceRequestsQuery } from '@/hooks/attendanceList/useAttendanceList.hook';
import { useOvertimeRequestsQuery } from '@/hooks/overtime/useOvertime.hook';
import { formatedDate } from '@/utils';

import AttendanceCharts from './components/AttendanceCharts';
import { AttendanceDialog } from './components/AttendanceDialog';
import AttendanceListTable from './components/AttendanceListTable.component';
import { RefreshAttendanceDialog } from './components/RefreshAttendanceDialog';

interface HrAttendanceListProps {}

const HrAttendanceList: FunctionComponent<HrAttendanceListProps> = () => {
  const path = usePathname();
  const { timeRange, selectedDate, setTimeRange, handleSetDate } =
    useTimeRange();

  const { data: pendingAttendanceRequests } = useAttendanceRequestsQuery({
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
  });
  const { data: pendingList } = useOvertimeRequestsQuery({
    from: formatedDate(selectedDate?.from),
    to: formatedDate(selectedDate?.to),
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [RefreshDialogOpen, setRefreshDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRefreshDialogOpen = () => {
    setRefreshDialogOpen(true);
  };

  const handleRefreshDialogClose = () => {
    setRefreshDialogOpen(false);
  };

  return (
    <Layout>
      <HighTrafficBanner />
      <LayoutHeader title="Attendance">
        <LayoutHeaderButtonsBlock>
          <Notification />
        </LayoutHeaderButtonsBlock>
      </LayoutHeader>
      <LayoutWrapper className="flex flex-col gap-8 px-2">
        <Header subheading="Track and Manage Attendance Seamlessly for Every User!">
          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
            <DateRangePicker
              timeRange={timeRange}
              selectedDate={selectedDate}
              setTimeRange={setTimeRange}
              setDate={handleSetDate}
            />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="relative px-2 py-1">
                  {Array.isArray(pendingAttendanceRequests?.requests) &&
                    pendingAttendanceRequests.requests.length > 0 && (
                      <Link
                        href={`${path.startsWith('/manager') ? '/manager' : 'hr'}/manage-attendance/attendance-requests`}
                        className="absolute right-0 top-0 z-10 ml-2 flex size-6 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border bg-white text-black shadow-md"
                      >
                        {pendingAttendanceRequests.requests.length +
                          (pendingList?.totalCount || 0)}
                      </Link>
                    )}

                  <EllipsisVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem
                  onClick={handleRefreshDialogOpen}
                  className="flex flex-row gap-1"
                >
                  <RefreshCw size={16} />
                  <span className="hidden lg:block">Refresh Attendance</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDialogOpen}
                  className="flex flex-row gap-1"
                >
                  <Plus size={16} />
                  <span className="hidden sm:block">Add Attendance</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-row gap-1">
                  <ClipboardList size={16} />
                  <Link
                    href={`${path.startsWith('/manager') ? '/manager' : 'hr'}/manage-attendance/attendance-requests`}
                    className="flex items-center"
                  >
                    Attendance Requests
                    <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                      {pendingAttendanceRequests?.requests.length || 0}
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-row gap-1">
                  <Clock size={16} />
                  <Link
                    href={`/hr/manage-attendance/overtime-request`}
                    className="flex items-center"
                  >
                    Overtime Requests
                    <span className="ml-2 flex size-6 items-center justify-center rounded-full bg-muted">
                      {pendingList?.totalCount || 0}
                    </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Header>
        <AttendanceCharts dates={selectedDate} />
        <Suspense fallback={<div>Loading...</div>}>
          <AttendanceListTable dates={selectedDate} />
        </Suspense>
      </LayoutWrapper>
      <AttendanceDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onCloseChange={handleDialogClose}
        type={'add'}
      />
      <RefreshAttendanceDialog
        open={RefreshDialogOpen}
        onOpenChange={handleRefreshDialogClose}
        onCloseChange={handleRefreshDialogClose}
      />
    </Layout>
  );
};

export default HrAttendanceList;
