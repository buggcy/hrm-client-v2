'use client';

import React, { createContext, ReactNode, useContext } from 'react';

import { useAttendanceHistoryStore } from '@/stores/employee/attendance-history';
import { useLeaveHistoryStore } from '@/stores/employee/leave-history';
import { usePerkStore } from '@/stores/employee/perks';
import { useEmployeeStore } from '@/stores/hr/employee';

import { useAuthStore } from '../stores/auth';

interface StoreContextType {
  authStore: ReturnType<typeof useAuthStore>;
  employeeStore: ReturnType<typeof useEmployeeStore>;
  perkStore: ReturnType<typeof usePerkStore>;
  attendanceHistoryStore: ReturnType<typeof useAttendanceHistoryStore>;
  leaveHistoryStore: ReturnType<typeof useLeaveHistoryStore>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();
  const employeeStore = useEmployeeStore();
  const perkStore = usePerkStore();
  const attendanceHistoryStore = useAttendanceHistoryStore();
  const leaveHistoryStore = useLeaveHistoryStore();
  return (
    <StoreContext.Provider
      value={{
        authStore,
        employeeStore,
        attendanceHistoryStore,
        leaveHistoryStore,
        perkStore,
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
