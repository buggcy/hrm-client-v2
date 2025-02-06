import { useEffect, useState } from 'react';

import { useStores } from '@/providers/Store.Provider';

import { AuthStoreType } from '@/stores/auth';

export const useUserId = (): string | null => {
  const [userId, setUserId] = useState<string | null>(null);
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  useEffect(() => {
    if (user) {
      const userId: string = user?.Tahometer_ID || '';
      setUserId(userId);
    }
  }, [user]);

  return userId;
};
