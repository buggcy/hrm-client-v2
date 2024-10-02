'use client';
import { useMemo } from 'react';

import { FREE } from '@/constants/replicas';

import { useUserQuery } from '../useUser';

const DeveloperPlanIds = {
  FREE: 'free_plan_id',
};

export const useReplicaQueryParams = () => {
  const { data: user } = useUserQuery();

  const userPlanId = user?.billingAccount?.plan_id as string;

  const params = useMemo(() => {
    if (userPlanId === DeveloperPlanIds.FREE) {
      return {
        replica_ids: FREE.join(','),
      };
    }
    // TODO: Add other plans

    return {};
  }, [userPlanId]);

  return { params };
};
