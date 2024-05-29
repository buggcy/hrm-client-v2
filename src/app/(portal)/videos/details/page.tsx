'use client';

import { useSearchParams } from 'next/navigation';

export default function VideoDetailsPage() {
  const searchParams = useSearchParams();
  console.log('params', searchParams);
  return (
    <div>
      Video Details for <strong>{searchParams.get('id')}</strong> TBD...
    </div>
  );
}
