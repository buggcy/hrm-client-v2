export interface Permission {
  _id: string;
  name: string;
  allowed: boolean;
}

export interface UserPermission {
  _id: string;
  roleId: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}
