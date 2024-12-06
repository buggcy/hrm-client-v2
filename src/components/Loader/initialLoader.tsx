'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';

const InitialLoader: React.FC = () => {
  useEffect(() => {
    const bodyElement = document.querySelector('body');
    bodyElement?.classList.add('loading');

    const handleReadyStateChange = () => {
      if (document.readyState === 'complete') {
        const loaderElement = document.querySelector('.initial-loader-wrap');
        bodyElement?.classList.add('loaded');
        setTimeout(() => {
          loaderElement?.remove();
          bodyElement?.classList.remove('loading', 'loaded');
        }, 200);
      }
    };

    document.addEventListener('readystatechange', handleReadyStateChange);
    return () =>
      document.removeEventListener('readystatechange', handleReadyStateChange);
  }, []);

  return (
    <div className="loaded:opacity-0 fixed inset-0 z-[99999] flex items-center justify-center bg-white opacity-100 transition-opacity duration-200 ease-out">
      <div className="min-w-[240px] text-sm text-[#212529]">
        <div className="flex items-center justify-between py-2">
          <Image
            src="/images/buggcy/logo-buggcy.png"
            alt="Buggcy Logo"
            width={100}
            height={32}
            priority
          />
          <svg
            id="loader-circle"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 40 40"
            width="30px"
            height="30px"
            className="animate-spin"
          >
            <g>
              <path
                fill="#e7e7e7"
                d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
              />
              <path
                fill="#1EB7FF"
                d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0C22.32,8.481,24.301,9.057,26.013,10.047z"
              />
            </g>
          </svg>
        </div>
        <div className="flex items-center justify-between border-t border-[#e2e2e2] py-2">
          Please Wait. Loading...
        </div>
      </div>
    </div>
  );
};

export default InitialLoader;
