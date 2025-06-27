import React, { useState } from "react";
import SubjectCircle from "../HomePage/SubjectCircle.jsx";
import background from '../../../assets/Images/Background/HomeBg.png';
import additionIcon from '../../../assets/Images/Math_icon/addition_purple.png';
import subtractionIcon from '../../../assets/Images/Math_icon/minus.png';
import multiplicationIcon from '../../../assets/Images/Math_icon/multi.png';
import divisionIcon from '../../../assets/Images/Math_icon/division1.png';
import percentageIcon from '../../../assets/Images/Math_icon/percentage.png';
import ShadowedTitle from "../../Utils/ShadowedTitle.jsx";
import { Link } from 'react-router-dom';
import { useGrade } from '../../Utils/GradeComponent.jsx';

/**
 * SubjectsPage Component
 * 
 * Displays a grid of subject buttons (Addition, Subtraction, etc.) available to the user
 * based on their current grade. Each subject is represented by a circular icon and links
 * to a video gallery for that subject.
 * @returns {JSX.Element} The rendered SubjectsPage component.
 */
const SubjectsPage = () => {
  const { grade } = useGrade();

  // Define subject options with icons, symbols, and colors
  const subjectsButtonConfigs = [
    { name: "Addition", icon: additionIcon, signSymbol: "+", color: '#E0BBE4' },
    { name: "Subtraction", icon: subtractionIcon, signSymbol: "-", color: '#FFABAB' },
    { name: "Multiplication", icon: multiplicationIcon, signSymbol: "x", color: '#B5EAD7' },
    { name: "Division", icon: divisionIcon, signSymbol: "/", color: '#C7CEEA' },
    { name: "Percentage", icon: percentageIcon, signSymbol: "%", color: '#FFDAC1' }
  ];

  // Filter subject buttons based on the user's grade
  let buttons = grade === 1
    ? subjectsButtonConfigs.slice(0, grade + 1)
    : subjectsButtonConfigs.slice(0, grade);

  // Create rows of up to 3 buttons per row
  const rows = Array.from({ length: Math.ceil(buttons.length / 3) });

  return (
    <div
      className="relative playful-font min-h-[100vh] w-full flex flex-col items-center justify-start pt-12 pb-24 px-4 overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 0,
      }}
    >
      {/* Page Title */}
      <div className="flex flex-col items-center mt-5 gap-10 z-10">
        <ShadowedTitle text="Get Confident in every Subject with These Videos!" />

        {/* Render subject buttons in rows */}
        {rows.map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-10 flex-wrap">
            {buttons.slice(rowIndex * 3, rowIndex * 3 + 3).map((subject, index) => (
              <div key={index} className="p-10 w-70 h-70 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105">
                
                {/* Link to the subject-specific videos page */}
                <Link to={`/Videos/${subject.name}`}>
                  <SubjectCircle
                    imageSrc={subject.icon}
                    title={subject.name}
                    variant="circle"
                    circleColor={subject.color}
                  />
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;