import React from 'react';

import ProfileDetails from './ProfileDetails.component';
import ProfileTabs from './ProfileTabs.component';

const ProfileComponent = ({ user }) => {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full p-4 md:w-4/12 lg:w-4/12">
          <ProfileDetails user={user} />
        </div>
        <div className="w-full p-4 md:w-8/12 lg:w-8/12">
          <ProfileTabs user={user} />
        </div>
      </div>
    </>
  );
};

export default ProfileComponent;
