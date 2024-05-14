import { renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/utils';

import { useUserQuery } from './useUser.hook';

test('useUserQuery.hook.test', async () => {
  const { result } = renderHook(() => useUserQuery(), { wrapper });

  await waitFor(() =>
    expect(result.current.data).toEqual({
      id: 'TEST_USER_ID',
      email: 'TEST_USER_EMAIL',
    }),
  );
});
