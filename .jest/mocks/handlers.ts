import { http, HttpResponse } from 'msw';

import { API_BASE_URL } from '../../src/constants';

export const handlers = [
  http.get(API_BASE_URL + '/v3/users/me', () =>
    HttpResponse.json({
      id: 'TEST_USER_ID',
      email: 'TEST_USER_EMAIL',
    }),
  ),
];
