import React from 'react';
import { useLoginStatus } from '../../Utils/LoginStatusComponent';
import ProfileCard from './ProfileCard';
import ChooseGrade from './ChooseGradeComponent';
import profile from "../../../assets/Images/NavbarIcons/profile.png"; 
import {useUser} from '../../Utils/UserContext'
import { useNavigate } from 'react-router-dom';

function ProfileDiv() {
    const isLoggedIn = useLoginStatus();
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center w-full max-w-4xl">
            
            {/* Avatar Card */}
            <ProfileCard 
                label={isLoggedIn.isLoggedIn ? `Hello ${user?.name}` : "Hello Guest!"}
                icon={profile} 
                buttonLabel={isLoggedIn.isLoggedIn ? "Edit Profile" : "Log In"} 
                buttonColor="bg-blue-400" 
                buttonTextColor="text-white"
                buttonAction={() => isLoggedIn.isLoggedIn ? navigate("/profile"): navigate("/login")}
            />
            {/* Grade Selector Section */}
                <ChooseGrade />
            
        </div>
    );
}

export default ProfileDiv;
