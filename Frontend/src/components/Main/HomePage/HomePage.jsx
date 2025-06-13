import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProfileDiv from './ProfileDiv';
import placeHolderAvatar from '../../../assets/Images/Avatars/avatar8.png';
import CirclesContainer from './CircleContainer';
import { useUser } from '../../Utils/UserContext';
import ShadowedTitle from '../../Utils/ShadowedTitle';

function HomePage() {
    const { user } = useUser();
    return (
        <div className="background-image playful-font pt-5 pb-4 flex-grow w-full h-full flex flex-row justify-center items-center ">

            {/* Avatar section */}
            <div className="mt-5 pt-5 mb-4 hidden lg:flex w-1/3 h-full justify-end items-center relative">
                <div className="flex w-full h-full items-center justify-end" >
                    <img
                        src={user?.avatar || placeHolderAvatar}
                        alt="Avatar"
                        className="object-contain max-h-92 w-auto translate-y-4 -mr-6"
                    />
                </div>
                <div className="absolute -top-8 right-10 bg-yellow-200 cursor-default rounded-xl p-4 shadow-lg border-4 border-yellow-400 text-yellow-700 font-bold text-lg whitespace-nowrap animate-bounce">
                    Are you ready to learn math?
                    <div className="absolute -bottom-4 left-4 w-6 h-6 bg-yellow-200 border-4 border-yellow-400 rounded-bl-xl rotate-45"></div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col items-center justify-start gap-4 w-full lg:w-2/3 h-full">
                <ShadowedTitle text="Welcome To Path2Math!"/>
                <ProfileDiv />
                <CirclesContainer />
            </div>
        </div>
    );
}

export default HomePage;
