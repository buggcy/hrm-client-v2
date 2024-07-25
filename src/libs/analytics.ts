'use client';

import * as Sentry from '@sentry/react';
import LogRocket from 'logrocket';

import { isProd, LOG_ROCKET_ID, SENTRY_DSN } from '@/constants';

import packageJson from '../../package.json';

import { IUser } from '@/types';

const version = `v:${packageJson.version}`;
console.info(version);

if (isProd && LOG_ROCKET_ID && typeof window !== 'undefined') {
  LogRocket.init(LOG_ROCKET_ID, {
    release: version,
  });
}

function isUserAlreadyIdentified() {
  return localStorage.getItem('isUserIdentified') === 'true';
}

const identifyLogRocket = (user: IUser) => {
  if (LOG_ROCKET_ID && typeof window !== 'undefined') {
    if (!isUserAlreadyIdentified()) {
      LogRocket.identify(user.uuid, {
        name: `${user.first_name} ${user.last_name}`,
        email: user?.email,
      });
      localStorage.setItem('isUserIdentified', 'true');
    }
  }
};

if (isProd && SENTRY_DSN && typeof window !== 'undefined') {
  Sentry.init({
    beforeSend(event) {
      const logRocketSession = LogRocket.sessionURL;
      if (logRocketSession !== null) {
        if (!event.extra) {
          event.extra = {};
        }
        event.extra['LogRocket'] = logRocketSession;
      }
      return event;
    },
    dsn: SENTRY_DSN,
  });
}

export { LogRocket, Sentry, identifyLogRocket };
