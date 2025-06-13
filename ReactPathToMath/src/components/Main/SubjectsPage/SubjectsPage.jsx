import React, { useState } from "react";
import SubjectCircle  from "../HomePage/SubjectCircle.jsx";
import background from '../../../assets/Images/Background/HomeBg.png';
import additionIcon from '../../../assets/Images/Math_icon/addition_purple.png';
import subtractionIcon from '../../../assets/Images/Math_icon/minus.png';
import multiplicationIcon from '../../../assets/Images/Math_icon/multi.png';
import divisionIcon from '../../../assets/Images/Math_icon/division1.png';
import percentageIcon from '../../../assets/Images/Math_icon/percentage.png';
import ShadowedTitle from "../../Utils/ShadowedTitle.jsx";
import { Link, useNavigate } from 'react-router-dom';
import { useGrade } from '../../Utils/GradeComponent.jsx'; // Custom hook that provides the current grade


const SubjectsPage = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { grade } = useGrade();

  const subjectsButtonConfigs = [
    { name: "Addition", icon: additionIcon, signSymbol: "+", color: '#E0BBE4' },
    { name: "Subtraction", icon: subtractionIcon, signSymbol: "-", color: '#FFABAB' },
    { name: "Multiplication", icon: multiplicationIcon, signSymbol: "x", color: '#B5EAD7' },
    { name: "Division", icon: divisionIcon, signSymbol: "/", color: '#C7CEEA' },
    { name: "Percentage", icon: percentageIcon, signSymbol: "%", color: '#FFDAC1' }
  ];

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    navigate(`/subject/${topic}`);
  };

  let buttons = grade === 1 ? subjectsButtonConfigs.slice(0, grade + 1) : subjectsButtonConfigs.slice(0, grade);
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
      <div className="flex flex-col items-center mt-5 gap-10 z-10">
        <ShadowedTitle text="Choose Your Math Topic and Begin Practicing!" />

        {rows.map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-10 flex-wrap">
            {buttons.slice(rowIndex * 3, rowIndex * 3 + 3).map((subject, index) => (
              <div key={index} className="p-10 w-70 h-70 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105">
                <Link to={`/Subjects/${subject.name}`}>
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