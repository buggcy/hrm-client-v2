'use client';

import React, { createContext, ReactNode, useContext } from 'react';

import { useEmployeeStore } from '@/stores/hr/employee';

import { useAuthStore } from '../stores/auth';

interface StoreContextType {
  authStore: ReturnType<typeof useAuthStore>;
  employeeStore: ReturnType<typeof useEmployeeStore>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();
  const employeeStore = useEmployeeStore();

  return (
    <StoreContext.Provider value={{ authStore, employeeStore }}>
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
