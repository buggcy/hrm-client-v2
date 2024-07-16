export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL;

export const RQH_API_BASE_URL = process.env.NEXT_PUBLIC_RQH_API_BASE_URL;
export const PORTAL_API_BASE_URL = process.env.NEXT_PUBLIC_PORTAL_API_BASE_URL;

export const isProd = process.env.APP_ENV === 'production';

export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
export const LOG_ROCKET_ID = process.env.NEXT_PUBLIC_LOG_ROCKET_ID;

export const INTERCOM_APP_ID = process.env.NEXT_PUBLIC__INTERCOM_APP_ID;
export const INTERCOM_API_BASE_URL =
  process.env.NEXT_PUBLIC__INTERCOM_API_BASE_URL;
