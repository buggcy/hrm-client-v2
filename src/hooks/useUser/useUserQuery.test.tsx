import { renderHook, waitFor } from '@testing-library/react';

import { wrapper } from '@/utils';

import { useUserQuery } from './useUserQuery.hook';

test('useUserQuery.hook.test', async () => {
  const { result } = renderHook(() => useUserQuery(), { wrapper });

  await waitFor(() => expect(result.current.data).not.toBeUndefined());
});
