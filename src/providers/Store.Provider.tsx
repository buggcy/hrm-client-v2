'use client';

import React, { createContext, ReactNode, useContext } from 'react';

import { useAttendanceHistoryStore } from '@/stores/employee/attendance-history';
import { useEmployeePayrollStore } from '@/stores/employee/employeePayroll';
import { useLeaveHistoryStore } from '@/stores/employee/leave-history';
import { usePerkStore } from '@/stores/employee/perks';
import { useAttendanceListStore } from '@/stores/hr/attendance-list';
import { useEmployeeStore } from '@/stores/hr/employee';
import { useHrEventsStore } from '@/stores/hr/hrEvents';
import { useLeaveListStore } from '@/stores/hr/leave-list';
import { usePerkListStore } from '@/stores/hr/perk-list';

import { useAuthStore } from '../stores/auth';
import { usePolicyStore } from '../stores/hr-policies.Store';
import { useNotificationStore } from '../stores/useNotificationStore';

interface StoreContextType {
  authStore: ReturnType<typeof useAuthStore>;
  employeeStore: ReturnType<typeof useEmployeeStore>;
  perkStore: ReturnType<typeof usePerkStore>;
  employeePayrollStore: ReturnType<typeof useEmployeePayrollStore>;
  hrEventsStore: ReturnType<typeof useHrEventsStore>;
  attendanceHistoryStore: ReturnType<typeof useAttendanceHistoryStore>;
  leaveHistoryStore: ReturnType<typeof useLeaveHistoryStore>;
  notificationStore: ReturnType<typeof useNotificationStore>;
  policyStore: ReturnType<typeof usePolicyStore>;
  attendanceListStore: ReturnType<typeof useAttendanceListStore>;
  leaveListStore: ReturnType<typeof useLeaveListStore>;
  perkListStore: ReturnType<typeof usePerkListStore>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();
  const employeeStore = useEmployeeStore();
  const perkStore = usePerkStore();
  const employeePayrollStore = useEmployeePayrollStore();
  const hrEventsStore = useHrEventsStore();
  const attendanceHistoryStore = useAttendanceHistoryStore();
  const leaveHistoryStore = useLeaveHistoryStore();
  const notificationStore = useNotificationStore();
  const policyStore = usePolicyStore();
  const attendanceListStore = useAttendanceListStore();
  const leaveListStore = useLeaveListStore();
  const perkListStore = usePerkListStore();

  return (
    <StoreContext.Provider
      value={{
        authStore,
        employeeStore,
        employeePayrollStore,
        hrEventsStore,
        attendanceHistoryStore,
        leaveHistoryStore,
        perkStore,
        notificationStore,
        attendanceListStore,
        policyStore,
        leaveListStore,
        perkListStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};
