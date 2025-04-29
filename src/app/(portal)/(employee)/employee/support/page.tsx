'use client';
import React, { useState } from 'react';

import InitialLoader from '@/components/Loader/initialLoader';

const Support = () => {
  const [isIframeLoaded, setIframeLoaded] = useState(false);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  return (
    <div>
      {!isIframeLoaded && <InitialLoader />}
      <iframe
        src="https://scribehow.com/embed/Employee_Manual_HRMS__sq9-I0VxQ5qANFG7Rpum3Q?as=scrollable"
        title="Employee Manual HRMS"
        width="100%"
        height="100%"
        allowFullScreen
        frameBorder="0"
        onLoad={handleIframeLoad}
        style={{
          display: isIframeLoaded ? 'block' : 'none',
          height: '100vh',
        }}
      ></iframe>
    </div>
  );
};

export default Support;
