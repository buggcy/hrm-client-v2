'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white p-8">
      <div>
        <div className="flex items-center space-x-16">
          <Image
            src="/images/buggcy/logo-buggcy.png"
            alt="Logo"
            width={150}
            height={150}
            className="object-contain"
          />
          <div className="size-6 animate-spin rounded-full border-2 border-t-blue-700" />
        </div>
        <div className="my-4 border-t border-gray-200" />
        <div className="flex items-center">
          <p className="text-lg text-gray-700">Please Wait. Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
