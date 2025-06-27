import React from 'react';
import { useNavigate } from "react-router-dom";
import ShadowedTitle from '../../Utils/ShadowedTitle';
import BadgesBg from '../../../assets/Images/Background/badgesBg.jpg';

/**
 * Rewards list for the guest prompt
 */
const rewardsList = [
  { title: "Addition Master", icon: "👑" },
  { title: "Subtraction Master", icon: "👑" },
  { title: "Multiplication Master", icon: "👑" },
  { title: "Division Master", icon: "👑" },
  { title: "Percentage Master", icon: "👑" },
];

/**
 * GuestPrompt component renders the guest prompt for the badges page.
 * 
 * @returns {React.ReactNode} The rendered GuestPrompt component
 */
const GuestPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${BadgesBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <div className="relative z-10 flex flex-col items-center justify-center mt-15 px-4">
        {/* Title */}
        <div className="flex items-center mb-8">
          <ShadowedTitle text={"Discover Your Badges Here!"} shadowColor={'text-blue-400'} />
        </div>

        {/* Prompt container */}
        <div className="bg-white rounded-3xl p-12 shadow-2xl border-4 border-dashed border-purple-300 relative overflow-hidden max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50" />
          <div className="relative text-center">
            <div className="text-8xl mb-6 animate-bounce">🎖️</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Create Your Account to Unlock Cool Badges!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Track your progress and earn amazing math badges as you complete levels!
            </p>

            {/* Rewards list */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {rewardsList.map((reward, index) => (
                <div key={index} className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl opacity-60">
                  <div className="text-3xl mb-2 grayscale">{reward.icon}</div>
                  <p className="text-xs font-semibold text-gray-500 text-center">{reward.title}</p>
                </div>
              ))}
            </div>

            {/* Sign up button */}
            <button
              onClick={() => navigate("/Signup")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Sign Up Now!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestPrompt;
