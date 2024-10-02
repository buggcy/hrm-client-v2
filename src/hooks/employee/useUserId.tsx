import { useEffect, useState } from 'react';

export const useUserId = (): string | null => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      const parsedStorage = JSON.parse(authStorage);
      const user = parsedStorage.state?.user;
      const userId: string | null = user?.Tahometer_ID;
      console.log('userId:', userId);
      setUserId(userId);
    }
  }, []);

  return userId;
};
