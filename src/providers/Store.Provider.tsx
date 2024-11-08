'use client';

import React, { createContext, ReactNode, useContext } from 'react';

import { useAttendanceHistoryStore } from '@/stores/employee/attendance-history';
import { useComplaintStore } from '@/stores/employee/complaint';
import { useEmployeePayrollStore } from '@/stores/employee/employeePayroll';
import { useLeaveHistoryStore } from '@/stores/employee/leave-history';
import { usePerkStore } from '@/stores/employee/perks';
import { useManageAnnouncementsStore } from '@/stores/hr/announcements';
import { useAttendanceListStore } from '@/stores/hr/attendance-list';
import { useConfigurationStore } from '@/stores/hr/configuration';
import { useEditEmployeeStore } from '@/stores/hr/edit-employee';
import { useEmployeeStore } from '@/stores/hr/employee';
import { useEmployeeAnniversaryStore } from '@/stores/hr/employeeAnniversary';
import { useEmployeeDobStore } from '@/stores/hr/employeeDob';
import { useHrEventsStore } from '@/stores/hr/hrEvents';
import { useManageLeaveStore } from '@/stores/hr/leave';
import { useLeaveListStore } from '@/stores/hr/leave-list';
import { useLogStore } from '@/stores/hr/logs';
import { usePerkListStore } from '@/stores/hr/perk-list';

import { useAuthStore } from '../stores/auth';
import { usePolicyStore } from '../stores/hr-policies.Store';
import { useNotificationStore } from '../stores/useNotificationStore';

interface StoreContextType {
  authStore: ReturnType<typeof useAuthStore>;
  employeeStore: ReturnType<typeof useEmployeeStore>;
  employeeDobStore: ReturnType<typeof useEmployeeDobStore>;
  employeeAnniversaryStore: ReturnType<typeof useEmployeeAnniversaryStore>;
  perkStore: ReturnType<typeof usePerkStore>;
  employeePayrollStore: ReturnType<typeof useEmployeePayrollStore>;
  hrEventsStore: ReturnType<typeof useHrEventsStore>;
  attendanceHistoryStore: ReturnType<typeof useAttendanceHistoryStore>;
  leaveHistoryStore: ReturnType<typeof useLeaveHistoryStore>;
  notificationStore: ReturnType<typeof useNotificationStore>;
  policyStore: ReturnType<typeof usePolicyStore>;
  manageLeaveStore: ReturnType<typeof useManageLeaveStore>;
  attendanceListStore: ReturnType<typeof useAttendanceListStore>;
  leaveListStore: ReturnType<typeof useLeaveListStore>;
  perkListStore: ReturnType<typeof usePerkListStore>;
  configurationStore: ReturnType<typeof useConfigurationStore>;
  logStore: ReturnType<typeof useLogStore>;
  editEmployeeStore: ReturnType<typeof useEditEmployeeStore>;
  manageAnnouncementsStore: ReturnType<typeof useManageAnnouncementsStore>;
  complaintStore: ReturnType<typeof useComplaintStore>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();
  const employeeStore = useEmployeeStore();
  const employeeDobStore = useEmployeeDobStore();
  const employeeAnniversaryStore = useEmployeeAnniversaryStore();
  const perkStore = usePerkStore();
  const employeePayrollStore = useEmployeePayrollStore();
  const hrEventsStore = useHrEventsStore();
  const attendanceHistoryStore = useAttendanceHistoryStore();
  const leaveHistoryStore = useLeaveHistoryStore();
  const notificationStore = useNotificationStore();
  const policyStore = usePolicyStore();
  const manageLeaveStore = useManageLeaveStore();
  const attendanceListStore = useAttendanceListStore();
  const leaveListStore = useLeaveListStore();
  const perkListStore = usePerkListStore();
  const configurationStore = useConfigurationStore();
  const logStore = useLogStore();
  const editEmployeeStore = useEditEmployeeStore();

  const manageAnnouncementsStore = useManageAnnouncementsStore();
  const complaintStore = useComplaintStore();
  return (
    <StoreContext.Provider
      value={{
        authStore,
        employeeStore,
        employeeDobStore,
        employeeAnniversaryStore,
        employeePayrollStore,
        hrEventsStore,
        attendanceHistoryStore,
        leaveHistoryStore,
        perkStore,
        notificationStore,
        attendanceListStore,
        policyStore,
        manageLeaveStore,
        leaveListStore,
        perkListStore,
        configurationStore,
        logStore,
        editEmployeeStore,
        manageAnnouncementsStore,
        complaintStore,
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
