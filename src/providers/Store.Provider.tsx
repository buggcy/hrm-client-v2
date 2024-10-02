'use client';

import React, { createContext, ReactNode, useContext } from 'react';

import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/useNotificationStore';

interface StoreContextType {
  authStore: ReturnType<typeof useAuthStore>;
  notificationStore: ReturnType<typeof useNotificationStore>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const authStore = useAuthStore();
  const notificationStore = useNotificationStore();

  return (
    <StoreContext.Provider value={{ authStore, notificationStore }}>
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
