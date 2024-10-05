import { create } from 'zustand';

import { NotificationStore } from '@/components/NotificationIcon/types';

export const useNotificationStore = create<NotificationStore>(set => ({
  notifications: [],
  setNotifications: notifications => set({ notifications }),
}));
