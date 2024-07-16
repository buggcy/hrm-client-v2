'use client';
import { useEffect } from 'react';

import IntercomInit from '@intercom/messenger-js-sdk';
import { create, StoreApi } from 'zustand';

import {
  DEVELOPER_SUPPORT_LINK,
  INTERCOM_API_BASE_URL,
  INTERCOM_APP_ID,
} from '@/constants';
import { useUserQuery } from '@/hooks';

interface IntercomStore {
  initialized: boolean;
  open: boolean;
  set: StoreApi<IntercomStore>['setState'];
}

export const useIntercomStore = create<IntercomStore>(set => ({
  initialized: false,
  open: false,
  set,
}));

export const Intercom = () => {
  const { data: user } = useUserQuery();
  const { set } = useIntercomStore(state => ({
    set: state.set,
  }));

  useEffect(() => {
    if (!user) {
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
      return;
    }
    if (!INTERCOM_APP_ID) return;
    try {
      IntercomInit({
        app_id: INTERCOM_APP_ID,
        api_base: INTERCOM_API_BASE_URL,
        user_id: user.uuid,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      });

      window.Intercom?.('onHide', function () {
        set({ open: false });
      });
      window.Intercom?.('onShow', function () {
        set({ open: true });
      });
    } catch (e) {
      console.error('Error initializing intercom', e);
    }

    return () => {
      window.Intercom?.('shutdown');
    };
  }, [set, user]);

  return null;
};

export const toggleIntercom = (): void => {
  if (window.Intercom) {
    const { open } = useIntercomStore.getState();
    window.Intercom(open ? 'hide' : 'show');
  } else {
    window.open(DEVELOPER_SUPPORT_LINK, '_blank');
  }
};
