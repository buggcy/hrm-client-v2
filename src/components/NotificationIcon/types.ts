export interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  senderId: {
    firstName: string;
    lastName: string;
    Avatar?: string;
  };
  roleId: number;
}
export interface NotificationStore {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

export interface NotificationQueryResult {
  data?: Notification[];
  isLoading: boolean;
  error?: Error | null; // Allow error to be null as well
}
