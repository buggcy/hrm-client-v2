'use client';

import React, { createContext, ReactNode, useContext } from 'react';

import { usePerkStore } from '@/stores/employee/perks';
import { useEmployeeStore } from '@/stores/hr/employee';

import { useAuthStore } from '../stores/auth';

interface StoreContextType {
  authStore: ReturnType<typeof useAuthStore>;
  employeeStore: ReturnType<typeof useEmployeeStore>;
  perkStore: ReturnType<typeof usePerkStore>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();
  const employeeStore = useEmployeeStore();
  const perkStore = usePerkStore();

  return (
    <StoreContext.Provider value={{ authStore, employeeStore, perkStore }}>
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
