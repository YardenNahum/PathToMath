import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProfileDiv from './ProfileDiv';
import CirclesContainer from './CircleContainer';
import { useUser } from '../../Utils/UserContext';
import ShadowedTitle from '../../Utils/ShadowedTitle';
import avatar1 from '../../../assets/Images/Avatars/avatar1.png';
import avatar2 from '../../../assets/Images/Avatars/avatar2.png';
import avatar3 from '../../../assets/Images/Avatars/avatar3.png';
import avatar4 from '../../../assets/Images/Avatars/avatar4.png';
import avatar5 from '../../../assets/Images/Avatars/avatar5.png';
import avatar6 from '../../../assets/Images/Avatars/avatar6.png';
import avatar7 from '../../../assets/Images/Avatars/avatar7.png';
import placeHolderAvatar from '../../../assets/Images/Avatars/avatar8.png';
import GetSuggestions from './GetSuggestions';
const avatarMap = {
  avatar1: avatar1,
  avatar2: avatar2,
  avatar3: avatar3,
  avatar4: avatar4,
  avatar5: avatar5,
  avatar6: avatar6,
  avatar7: avatar7,
};
/**
 * HomePage component
 * @returns {JSX.Element} - The rendered HomePage component.
 * This component serves as the main landing page for the application,
 * displaying a welcome message, user profile, and various interactive circles.
 */
function HomePage() {
    const { user } = useUser();
    return (
        <div className="background-image playful-font pt-5 pb-4 flex-grow w-full h-full flex flex-row justify-center items-center ">

            {/* Avatar section */}
            <div className="mt-5 pt-5 mb-4 hidden lg:flex w-1/3 h-full justify-end items-center relative">
                <div className="flex w-full h-full items-center justify-end" >
                    <img
                        src={avatarMap[user?.avatar] || placeHolderAvatar}
                        alt="Avatar"
                        className="object-contain max-h-92 w-auto translate-y-4 -mr-6"
                    />
                </div>
                <div>
                    <GetSuggestions user={user} />
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col items-center justify-start gap-4 w-full lg:w-2/3 h-full">
                <ShadowedTitle text="Welcome To Path2Math!" textColor='#fcc612'/>
                <ProfileDiv />
                <CirclesContainer />
            </div>
        </div>
    );
}

export default HomePage;
