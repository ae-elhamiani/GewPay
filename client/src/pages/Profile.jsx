import React from 'react';
import ProfileData from '../components/Profile/ProfileData';
import CardData from '../components/Profile/CardData';
import { useProfile } from '../contexts/profileContext';

const Profile = () => {
  const { showCardData } = useProfile();

  return (
    <div className="  flex flex-col w-full">
    <main className="flex-grow container mx-auto px-4 ">
      <h1 className="text-2xl font-bold mb-8 ">
        Hey! Get set to elevate your profile - we're about to make it stand
        out!
      </h1>
      <div className="flex justify-between">
        <div>
          <ProfileData />
          <div className="mt-6 flex justify-between"></div>
        </div>
      </div>
    </main>
  </div>
  );
};

export default Profile;
