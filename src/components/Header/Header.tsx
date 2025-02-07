'use client';

import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStores } from '@/providers/Store.Provider';

import { AuthStoreType } from '@/stores/auth';

interface HeaderProps {
  subheading?: string;
  children?: React.ReactNode;
}

const Header = ({ subheading, children }: HeaderProps) => {
  const { authStore } = useStores() as { authStore: AuthStoreType };
  const { user } = authStore;
  const size = 64;
  return (
    <div className="flex w-full flex-col items-center justify-between gap-y-4 md:flex-row">
      <div className="relative ml-2 flex items-center justify-center gap-4">
        <div className="relative inline-block">
          <div
            className="absolute inset-0 rounded-full bg-primary"
            style={{
              padding: `${size * 0.04}px`,
            }}
          >
            <Avatar className="size-full border-4 border-background">
              <AvatarImage src={user?.Avatar || ''} alt={user?.firstName} />
              <AvatarFallback className="uppercase">
                {`${user?.firstName?.charAt(0) || ''} ${user?.lastName?.charAt(0) || ''}`}
              </AvatarFallback>
            </Avatar>
          </div>
          <div
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          />
        </div>
        <div>
          <h1 className="text-xl capitalize">
            <span className="font-bold">Welcome Back,</span> {user?.firstName}{' '}
            {user?.lastName} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-gray-500">{subheading}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">{children}</div>
    </div>
  );
};

export default Header;
