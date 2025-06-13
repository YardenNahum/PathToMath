
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import background from "../../../assets/Images/Background/HomeBg.png";

import additionIcon       from "../../../assets/Images/Math_icon/addition_purple.png";
import subtractionIcon    from "../../../assets/Images/Math_icon/minus.png";
import multiplicationIcon from "../../../assets/Images/Math_icon/multi.png";
import divisionIcon       from "../../../assets/Images/Math_icon/division1.png";
import percentageIcon     from "../../../assets/Images/Math_icon/percentage.png";

import SubjectCircle from "../HomePage/SubjectCircle.jsx";
import ShadowedTitle from "../../Utils/ShadowedTitle.jsx";
import { useGrade }   from "../../Utils/GradeComponent.jsx";

const VideoPage = () => {
  const navigate = useNavigate();
  const { grade } = useGrade();
  const [selectedTopic, setSelectedTopic] = useState(null);

  // ---- subject definitions --------------------------------------------------
  const subjects = [
    { name: "Addition",       icon: additionIcon,       sign: "+", color: "#E0BBE4" },
    { name: "Subtraction",    icon: subtractionIcon,    sign: "-", color: "#FFABAB" },
    { name: "Multiplication", icon: multiplicationIcon, sign: "×", color: "#B5EAD7" },
    { name: "Division",       icon: divisionIcon,       sign: "÷", color: "#C7CEEA" },
    { name: "Percentage",     icon: percentageIcon,     sign: "%", color: "#FFDAC1" },
  ];

  // ---- filter by grade ------------------------------------------------------
  const buttons =
    grade === 1 ? subjects.slice(0, grade + 1) : subjects.slice(0, grade);

  // ---- handlers -------------------------------------------------------------
  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    navigate(`/videos/${topic}`);
  };

  // ---- render ---------------------------------------------------------------
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center pt-12 pb-24 px-4 overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <ShadowedTitle text="Choose a Math Topic to Watch Video Tutorials!" />

    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 w-full max-w-4xl">
        {buttons.map((subject) => (
          <button
            key={subject.name}
            onClick={() => handleTopicClick(subject.name)}
            className="flex justify-center transition-transform duration-200 hover:scale-105 focus:outline-none"
          >
            <SubjectCircle
              imageSrc={subject.icon}
              title={subject.name}
              variant="circle"
              circleColor={subject.color}
              size={140}             
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoPage;
