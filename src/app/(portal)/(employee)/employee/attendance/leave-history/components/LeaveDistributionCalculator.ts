import { EmployeeLeavesDataApiResponse } from '@/types/leave-history.types';

function getTotalDays(start: Date, end: Date): number {
  const startDate = new Date(start.toISOString().slice(0, 10));
  const endDate = new Date(end.toISOString().slice(0, 10));

  const diffTime = endDate.getTime() - startDate.getTime();
  const days = diffTime / (1000 * 60 * 60 * 24) + 1;

  return days;
}

function getPaidAnnualLeavesThisCycle(
  leaveData: EmployeeLeavesDataApiResponse,
  joiningDate: Date,
  currentDate: Date,
): number {
  const joiningYear = joiningDate.getFullYear();
  const joiningMonth = joiningDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const totalMonthsSinceJoining =
    (currentYear - joiningYear) * 12 + (currentMonth - joiningMonth);
  const cycleStartMonth = totalMonthsSinceJoining % 12;
  const cycleStartYear = currentYear - Math.ceil(cycleStartMonth / 12);

  const paidAnnualLeavesTaken = leaveData.annualLeavesRecords
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

  return paidAnnualLeavesTaken;
}

function getAvailableAnnualLeaves(
  joiningDate: Date,
  leaveData: EmployeeLeavesDataApiResponse,
  currentDate: Date,
): number {
  const joiningYear = joiningDate.getFullYear();
  const joiningMonth = joiningDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const annualLeaveGatheringRate = leaveData.annualLeavesAllowed / 12;
  const totalMonthsSinceJoining =
    (currentYear - joiningYear) * 12 + (currentMonth - joiningMonth);
  const monthsInCurrentCycle = totalMonthsSinceJoining % 12;

  return Math.floor(annualLeaveGatheringRate * monthsInCurrentCycle);
}

function distributeLeaves(
  type: 'Casual' | 'Sick' | 'Annual',
  start: Date,
  end: Date,
  leaveData: EmployeeLeavesDataApiResponse,
  joiningDate: Date,
) {
  if (type === 'Annual') {
    const daysRequested =
      start.toISOString() === end.toISOString()
        ? 1
        : getTotalDays(start, end) + 1;
    const daysAllowed = getAvailableAnnualLeaves(joiningDate, leaveData, start);
    const daysTakenThisCycle = getPaidAnnualLeavesThisCycle(
      leaveData,
      joiningDate,
      end,
    );
    const leaves = Math.min(
      daysRequested,
      daysAllowed - daysTakenThisCycle > 0
        ? daysAllowed - daysTakenThisCycle
        : 0,
    );
    const unpaidLeaves = daysRequested - leaves;
    return {
      leaves: 0,
      unpaidLeaves,
      annualLeaves: leaves,
    };
  } else {
    const monthlyLeavesAllowed = leaveData.monthlyLeavesAllowed;
    const monthlyLeaveRecords = leaveData.monthlyLeaveRecords;

    const totalDaysRequested = start === end ? 1 : getTotalDays(start, end) + 1;
    let paidLeaves = 0;
    let annualLeavesUsed = 0;
    let unpaidLeaves = 0;
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

      paidLeaves = Math.min(totalDaysRequested, remainingLeaves);
      const remainingUnpaid = totalDaysRequested - paidLeaves;

      const availableAnnualLeaves = getAvailableAnnualLeaves(
        joiningDate,
        leaveData,
        start,
      );
      const takenAnnualLeaves = getPaidAnnualLeavesThisCycle(
        leaveData,
        joiningDate,
        start,
      );
      annualLeavesUsed = Math.min(
        remainingUnpaid,
        availableAnnualLeaves - takenAnnualLeaves > 0
          ? availableAnnualLeaves - takenAnnualLeaves
          : 0,
      );
      unpaidLeaves = remainingUnpaid - annualLeavesUsed;
      return {
        leaves: paidLeaves,
        unpaidLeaves,
        annualLeaves: annualLeavesUsed,
      };
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

      const endMonthTaken =
        (endMonthRecord?.casualLeaves || 0) + (endMonthRecord?.sickLeaves || 0);
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

      paidLeaves = startMonthPaid + endMonthPaid;
      const totalUnpaid = startMonthUnpaid + endMonthUnpaid;

      const availableAnnualLeaves = getAvailableAnnualLeaves(
        joiningDate,
        leaveData,
        end,
      );
      const takenAnnualLeaves = getPaidAnnualLeavesThisCycle(
        leaveData,
        joiningDate,
        end,
      );
      annualLeavesUsed = Math.min(
        totalUnpaid,
        availableAnnualLeaves - takenAnnualLeaves > 0
          ? availableAnnualLeaves - takenAnnualLeaves
          : 0,
      );
      unpaidLeaves = totalUnpaid - annualLeavesUsed;
      return {
        leaves: paidLeaves,
        unpaidLeaves,
        annualLeaves: annualLeavesUsed,
      };
    }
  }
}

export default distributeLeaves;
