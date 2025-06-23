import React from 'react';
import ChildProgressCard from './ChildProgressCard';
import {useUser} from '../../Utils/UserContext';
import Background from '../../../assets/Images/Background/HomeBg.png'

/**
 * ParentPage component
 * @returns {JSX.Element} - The rendered ParentPage component.
 */
function ParentPage() {
  const { user } = useUser();
  return (
    <div style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    className="w-full min-h-screen h-full playful-font">
      {/* Main content container */}
      <div className="flex flex-col items-center justify-start w-full py-5 px-4">
        {/* Title Section inside the rectangle */}
        <div className="mb-8 text-center ">
          <h2 className="text-4xl font-bold text-white mb-3">
            <span className="relative inline-block py-2 px-6 rounded-full bg-amber-400 font-light shadow-md">
              Student Progress Overview
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            View your children’s achievements, solved puzzles, and badges earned in their math learning journey!
          </p>
        </div>
        {/* Rectangle with child progress cards */}
        <div className="w-full max-w-2xl bg-white p-3 rounded-3xl shadow-xl">
          {/* Flex container for child cards */}
          <div className="flex flex-wrap justify-center">
              <ChildProgressCard key={user?.name} child={user} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentPage;
