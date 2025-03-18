import { EmployeeLeavesDataApiResponse } from '@/types/leave-history.types';

function getTotalDays(start: Date, end: Date): number {
  const startDate = new Date(start.toISOString().slice(0, 10));
  const endDate = new Date(end.toISOString().slice(0, 10));

  const diffTime = endDate.getTime() - startDate.getTime();
  const days = diffTime / (1000 * 60 * 60 * 24) + 1;

  return days;
}

function getPaidAnnualLeavesThisCycle(
  joiningDate: Date,
  currentDate: Date,
  leaveData?: EmployeeLeavesDataApiResponse,
): number {
  const joiningYear = joiningDate.getFullYear();
  const joiningMonth = joiningDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const totalMonthsSinceJoining =
    (currentYear - joiningYear) * 12 + (currentMonth - joiningMonth);
  const cycleStartMonth = totalMonthsSinceJoining % 12;
  const cycleStartYear = currentYear - Math.ceil(cycleStartMonth / 12);

  const paidAnnualLeavesTaken = leaveData?.annualLeavesRecords
    .filter(record => {
      if (
        (record.year === cycleStartYear && record.month >= cycleStartMonth) ||
        (record.year === cycleStartYear + 1 && record.month < cycleStartMonth)
      ) {
        return true;
      }
      return false;
    })
    .reduce((sum, record) => sum + record.paidLeaves, 0);

  return paidAnnualLeavesTaken || 0;
}

function getAvailableAnnualLeaves(
  joiningDate: Date,
  currentDate: Date,
  leaveData?: EmployeeLeavesDataApiResponse,
): number {
  const joiningYear = joiningDate.getFullYear();
  const joiningMonth = joiningDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const annualLeaveGatheringRate = (leaveData?.annualLeavesAllowed || 14) / 12;
  const totalMonthsSinceJoining =
    (currentYear - joiningYear) * 12 + (currentMonth - joiningMonth);
  const monthsInCurrentCycle = totalMonthsSinceJoining % 12;

  return Math.floor(annualLeaveGatheringRate * monthsInCurrentCycle);
}

function distributeLeaves(
  type: 'Casual' | 'Sick' | 'Annual',
  start: Date,
  end: Date,
  joiningDate: Date,
  leaveData?: EmployeeLeavesDataApiResponse,
  allowAnnual?: boolean,
) {
  const leaveDistribution: {
    date: Date;
    isPaid: boolean;
    isAnnual: boolean;
  }[] = [];
  const totalDaysRequested =
    start.toISOString() === end.toISOString() ? 1 : getTotalDays(start, end);

  if (type === 'Annual') {
    const daysAllowed = getAvailableAnnualLeaves(joiningDate, end, leaveData);
    const daysTakenThisCycle = getPaidAnnualLeavesThisCycle(
      joiningDate,
      end,
      leaveData,
    );
    const paidLeaves = Math.min(
      totalDaysRequested,
      daysAllowed - daysTakenThisCycle > 0
        ? daysAllowed - daysTakenThisCycle
        : 0,
    );

    for (let i = 0; i < totalDaysRequested; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      leaveDistribution.push({
        date,
        isPaid: i < paidLeaves,
        isAnnual: true,
      });
    }
  } else {
    const monthlyLeavesAllowed = leaveData?.monthlyLeavesAllowed || 0;
    const monthlyLeaveRecords = leaveData?.monthlyLeaveRecords || [];

    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      const monthRecord = monthlyLeaveRecords.find(
        record =>
          record.year === start.getFullYear() &&
          record.month === start.getMonth() + 1,
      );
      const takenLeaves = monthRecord?.paidLeaves || 0;
      const remainingLeaves = Math.max(monthlyLeavesAllowed - takenLeaves, 0);
      const paidLeaves = Math.min(totalDaysRequested, remainingLeaves);
      const unpaidLeaves = totalDaysRequested - paidLeaves;
      let availableAnnualLeaves =
        getAvailableAnnualLeaves(joiningDate, start, leaveData) || 0;
      if (!allowAnnual) {
        availableAnnualLeaves = 0;
      }
      const takenAnnualLeaves = getPaidAnnualLeavesThisCycle(
        joiningDate,
        start,
        leaveData,
      );
      const annualLeavesUsed = Math.min(
        unpaidLeaves,
        availableAnnualLeaves - takenAnnualLeaves > 0
          ? availableAnnualLeaves - takenAnnualLeaves
          : 0,
      );

      for (let i = 0; i < totalDaysRequested; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        leaveDistribution.push({
          date,
          isPaid: i < paidLeaves + annualLeavesUsed,
          isAnnual: i >= paidLeaves && i < paidLeaves + annualLeavesUsed,
        });
      }
    } else {
      const startMonthRecord = monthlyLeaveRecords.find(
        record =>
          record.year === start.getFullYear() &&
          record.month === start.getMonth() + 1,
      );
      const endMonthRecord = monthlyLeaveRecords.find(
        record =>
          record.year === end.getFullYear() &&
          record.month === end.getMonth() + 1,
      );

      const startMonthTaken = startMonthRecord?.paidLeaves || 0;
      const startMonthRemaining = Math.max(
        monthlyLeavesAllowed - startMonthTaken,
        0,
      );
      const startMonthDays = getTotalDays(
        start,
        new Date(start.getFullYear(), start.getMonth() + 1, 0),
      );
      const startMonthPaid = Math.min(startMonthDays, startMonthRemaining);
      const startMonthUnpaid = startMonthDays - startMonthPaid;

      const endMonthTaken = endMonthRecord?.paidLeaves || 0;
      const endMonthRemaining = Math.max(
        monthlyLeavesAllowed - endMonthTaken,
        0,
      );
      const endMonthDays = getTotalDays(
        new Date(end.getFullYear(), end.getMonth(), 1),
        end,
      );
      const endMonthPaid = Math.min(endMonthDays, endMonthRemaining);
      const endMonthUnpaid = endMonthDays - endMonthPaid;

      const totalUnpaid = startMonthUnpaid + endMonthUnpaid;
      const availableAnnualLeaves = getAvailableAnnualLeaves(
        joiningDate,
        end,
        leaveData,
      );
      const takenAnnualLeaves = getPaidAnnualLeavesThisCycle(
        joiningDate,
        end,
        leaveData,
      );
      const annualLeavesUsed = Math.min(
        totalUnpaid,
        availableAnnualLeaves - takenAnnualLeaves > 0
          ? availableAnnualLeaves - takenAnnualLeaves
          : 0,
      );
      let annualLeavesUsedCount = 0;

      for (let i = 0; i < startMonthDays; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        leaveDistribution.push({
          date,
          isPaid: i < startMonthPaid + annualLeavesUsedCount,
          isAnnual:
            i >= startMonthPaid && annualLeavesUsedCount++ < annualLeavesUsed,
        });
      }

      for (let i = 0; i < endMonthDays; i++) {
        const date = new Date(end.getFullYear(), end.getMonth(), i + 1);
        leaveDistribution.push({
          date,
          isPaid: i < endMonthPaid + annualLeavesUsedCount,
          isAnnual:
            i >= endMonthPaid && annualLeavesUsedCount++ < annualLeavesUsed,
        });
      }
    }
  }
  return leaveDistribution;
}

export default distributeLeaves;
