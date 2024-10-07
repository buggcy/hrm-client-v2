'use client';
import React from 'react';

import { Employee } from '@/types/employee.types';
interface OverviewTabProps {
  user: Employee;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ user }) => {
  return (
    <>
      <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
        Basic Information
      </div>

      <dl className="grid grid-cols-1 gap-y-4 md:grid-cols-3">
        <dt className="font-medium">Emergency Number</dt>
        <dd className="col-span-2 text-gray-600 dark:text-gray-300">
          {user?.Emergency_Phone || '-'}
        </dd>

        <dt className="font-medium">Company Email</dt>
        <dd className="col-span-2 text-gray-600 dark:text-gray-300">
          <a href="#" className="hover:underline">
            {user?.companyEmail || '-'}
          </a>
        </dd>

        <dt className="font-medium">Blood Group</dt>
        <dd className="col-span-2 text-gray-600 dark:text-gray-300">
          {user?.Blood_Group || '-'}
        </dd>

        <dt className="font-medium">Marital Status</dt>
        <dd className="col-span-2 capitalize text-gray-600 dark:text-gray-300">
          {user?.Marital_Status || '-'}
        </dd>

        <dt className="font-medium">Nationality</dt>
        <dd className="col-span-2 capitalize text-gray-600 dark:text-gray-300">
          {user?.Nationality || '-'}
        </dd>

        <dt className="font-medium">Date of Joining</dt>
        <dd className="col-span-2 text-gray-600 dark:text-gray-300">
          {user?.Joining_Date
            ? new Date(user.Joining_Date).toDateString()
            : '-'}
        </dd>
      </dl>

      <div className="my-4 border-b border-gray-300" />

      <div className="mb-2 mt-4 text-sm font-bold dark:text-white">
        Family Details
      </div>
      <dl className="grid grid-cols-1 gap-y-4 md:grid-cols-3">
        <dt className="font-medium">Name</dt>
        <dd className="col-span-2 capitalize text-gray-600 dark:text-gray-300">
          {user?.Family_Name || '-'}
        </dd>

        <dt className="font-medium">Relation</dt>
        <dd className="col-span-2 capitalize text-gray-600 dark:text-gray-300">
          {user?.Family_Relation || '-'}
        </dd>

        <dt className="font-medium">Occupation</dt>
        <dd className="col-span-2 capitalize text-gray-600 dark:text-gray-300">
          {user?.Family_Occupation || '-'}
        </dd>

        <dt className="font-medium">Phone Number</dt>
        <dd className="col-span-2 text-gray-600 dark:text-gray-300">
          {user?.Family_PhoneNo || '-'}
        </dd>
      </dl>
    </>
  );
};

export default OverviewTab;
