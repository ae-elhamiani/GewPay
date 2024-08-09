import React, { useRef, useEffect, useState } from 'react';
import { useProfile } from '../../contexts/profileContext';
import useWalletAuth from '../../hooks/auth/useWalletAuth';
import bgImage from '../../assets/1.png';


const CardData = ({isVisible}) => {
  const { name, uploadedImage, country, email, avatarSvg } = useProfile();
  const { address: walletAddress } = useWalletAuth();
  const { showCardData } = useProfile();
  const cardRef = useRef(null);

  

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.classList.add('expand');
    }
  }, []);

  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 10)}.....${address.slice(-10)}`;
  };
  const formattedWalletAddress = formatWalletAddress(walletAddress);

  if (!showCardData) {
    return null;
  }

  return (
    <div className=" relative mt-12 ml-12 w-96 " ref={cardRef}>
      {/* Blurred background */}
      <div className="absolute inset-0 rounded-3xl opacity-75 blur-sm   "></div>

      {/* Card content */}
      <div className="relative bg-opacity-45 backdrop-blur-sm rounded-3xl shadow-xl p-8 overflow-hidden bg-violet-200 ">
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 bg-white rounded-full shadow-lg "></div>
            <div className="relative w-full h-full border-solid border-2 border-white   opacity-100 rounded-full overflow-hidden ">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                src="https://api.dicebear.com/9.x/rings/svg?seed=Samantha"
                alt="avatar" />
              )}
            </div>
          </div>

          <h1 className="text-center text-3xl font-bold text-gray-900 my-8">
            {name || (
              <div className="h-3 bg-violet-400 rounded-full w-full"></div>
            )}
          </h1>

          <div className="border-b border-black my-4"></div>

          <div className="text-center text-lg font-semibold text-gray-800 my-4">
            {formattedWalletAddress ? (
              formattedWalletAddress
            ) : (
              <div className="h-3 bg-violet-400 rounded-full w-full"></div>
            )}
          </div>

          <div className="text-center text-lg font-semibold text-gray-800 mb-4">
            {country || (
              <div className="h-3 bg-violet-400 rounded-full w-full"></div>
            )}
          </div>

          <div className="text-center text-lg font-semibold text-gray-800 mb-4">
            {email || (
              <div className="h-3 bg-violet-400 rounded-full w-full"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardData;
