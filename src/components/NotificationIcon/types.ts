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
}
export interface NotificationStore {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}
