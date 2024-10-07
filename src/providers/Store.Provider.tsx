'use client';

import React, { createContext, ReactNode, useContext } from 'react';

import { useAttendanceHistoryStore } from '@/stores/employee/attendance-history';
import { useEmployeePayrollStore } from '@/stores/employee/employeePayroll';
import { useLeaveHistoryStore } from '@/stores/employee/leave-history';
import { useEmployeeStore } from '@/stores/hr/employee';

import { useAuthStore } from '../stores/auth';
import { usePolicyStore } from '@/stores/employee/policies';
import { useNotificationStore } from '../stores/useNotificationStore';

interface StoreContextType {
  authStore: ReturnType<typeof useAuthStore>;
  employeeStore: ReturnType<typeof useEmployeeStore>;
  policyStore: ReturnType<typeof usePolicyStore>;
  employeePayrollStore: ReturnType<typeof useEmployeePayrollStore>;
  attendanceHistoryStore: ReturnType<typeof useAttendanceHistoryStore>;
  leaveHistoryStore: ReturnType<typeof useLeaveHistoryStore>;
  notificationStore: ReturnType<typeof useNotificationStore>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();
  const employeeStore = useEmployeeStore();
  const employeePayrollStore = useEmployeePayrollStore();
  const attendanceHistoryStore = useAttendanceHistoryStore();
  const leaveHistoryStore = useLeaveHistoryStore();
  const notificationStore = useNotificationStore();
  const policyStore = usePolicyStore();

  return (
    <StoreContext.Provider
      value={{
        authStore,
        employeeStore,
        employeePayrollStore,
        attendanceHistoryStore,
        leaveHistoryStore,
        notificationStore,
        policyStore,
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
