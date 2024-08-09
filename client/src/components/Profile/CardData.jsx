import React, { useRef, useEffect } from 'react';
import { useProfile } from '../../hooks/ProfileProvider';
import useWalletAuth from '../../hooks/auth/useWalletAuth';


const CardData = ({isVisible}) => {
  const { name, uploadedImage, businessActivity, email, showCardData } = useProfile();
  const { address: walletAddress } = useWalletAuth();
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
<div className="relative mb-12 ml-28 w-96 min-h-[500px]" ref={cardRef}>
  {/* Blurred background */}
  <div className="absolute inset-0 rounded-3xl opacity-75 blur-sm"></div>

  {/* Card content */}
  <div className="relative bg-opacity-45 backdrop-blur-sm rounded-3xl shadow-xl p-8 overflow-hidden bg-violet-200  ml-5 min-h-[500px]">
    <div className="mb-6 ">
      <div className="w-32 h-32 mt-5 mx-auto relative ">
        <div className="absolute inset-0 bg-white rounded-full shadow-lg"></div>
        <div className="relative w-full h-full border-solid border-8 border-violet-300 opacity-100 rounded-full overflow-hidden ">
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="https://raw.githubusercontent.com/Volosh1n/github-avatars/master/examples/image.png"
              alt="avatar"
            />
          )}
        </div>
      </div>

      <h1 className="text-center text-3xl font-bold text-gray-900 my-8 mt-12">
        {name || (
          <div className="h-4 bg-violet-400 rounded w-full"></div>
        )}
      </h1>

      <div className=" h- border-b border-mooove "></div>

      <div className=" text-center text-lg font-semibold text-gray-800 my-4">
        {formattedWalletAddress ? (
          formattedWalletAddress
        ) : (
          <div className="h-4 bg-violet-400 rounded w-full"></div>
        )}
      </div>

      <div className="text-center text-lg font-semibold text-gray-800 mb-4">
        {businessActivity || (
          <div className="h-4 bg-violet-400 rounded w-full"></div>
        )}
      </div>

      <div className="text-center text-lg font-semibold text-gray-800 mb-4">
        {email || (
          <div className="h-4 bg-violet-400 rounded w-full"></div>
        )}
      </div>
    </div>
  </div>
</div>


  );
};

export default CardData;
