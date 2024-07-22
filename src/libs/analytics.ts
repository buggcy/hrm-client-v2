'use client';

import * as Sentry from '@sentry/react';
import LogRocket from 'logrocket';

import { isProd, LOG_ROCKET_ID, SENTRY_DSN } from '@/constants';

import packageJson from '../../package.json';

console.info(`v:${packageJson.version}`);

if (isProd && LOG_ROCKET_ID && typeof window !== 'undefined') {
  LogRocket.init(LOG_ROCKET_ID);
}

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

export { LogRocket, Sentry };
