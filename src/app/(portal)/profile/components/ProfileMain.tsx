'use client';
import { useSearchParams } from 'next/navigation';

import { useStores } from '@/providers/Store.Provider';

import { useReadEmployeeRecordQuery } from '@/hooks/employee/useEmployeeList.hook';
import { AuthStoreType } from '@/stores/auth';

import ProfileComponent from './Profile.component';

export default function ProfileMain() {
  const searchParams = useSearchParams();
  const userIdFromParams =
    typeof window !== 'undefined' ? searchParams.get('userId') : null;

  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;

  const userId = userIdFromParams || user?.id;

  const { data, refetch } = useReadEmployeeRecordQuery(userId as string, {
    enabled: !!userId,
  });

  return (
    <>
      {user && (
        <ProfileComponent user={data} currentUser={user} refetch={refetch} />
      )}
    </>
  );
}
