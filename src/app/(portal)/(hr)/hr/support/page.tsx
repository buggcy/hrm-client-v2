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
        src="https://scribehow.com/embed/HR_Guide_for_Buggcy_HRMS__4VDfjRsnSGyvKbUxtnvdeg?as=scrollable"
        title="HR Manual HRMS"
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
