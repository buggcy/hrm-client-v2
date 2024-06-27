'use client';

import * as Sentry from '@sentry/react';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

import { isProd, LOG_ROCKET_ID, SENTRY_DSN } from '@/constants';

import packageJson from '../../package.json';

console.info(`v:${packageJson.version}`);

if (isProd && LOG_ROCKET_ID) {
  LogRocket.init(LOG_ROCKET_ID);
  setupLogRocketReact(LogRocket);
}

if (isProd && SENTRY_DSN) {
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
