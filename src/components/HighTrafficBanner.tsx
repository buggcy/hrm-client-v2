import { AlertTriangle } from 'lucide-react';

export const HighTrafficBanner = () => (
  <div className="flex items-center justify-center bg-primary p-3 text-center text-white">
    <AlertTriangle className="mr-1.5 inline-block size-5" />
    <p>
      We are experiencing extremely high traffic to our digital twins. They
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      need a little breather, but we're working on it!
    </p>
  </div>
);
