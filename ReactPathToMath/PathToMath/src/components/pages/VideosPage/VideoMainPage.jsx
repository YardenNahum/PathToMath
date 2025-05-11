import React, { useState, useEffect } from "react";
import background from '../../../assets/Images/Background/back.png';

import additionIcon from '../../../assets/Images/Math_icon/addition_purple.png';
import subtractionIcon from '../../../assets/Images/Math_icon/minus.png';
import multiplicationIcon from '../../../assets/Images/Math_icon/multi.png';
import divisionIcon from '../../../assets/Images/Math_icon/division1.png';


const VideoMainPage = () => {

  const [selectedTopic, setSelectedTopic] = useState(null);

  const subjects = [
    { name: 'Addition', icon: additionIcon },
    { name: 'Subtraction', icon: subtractionIcon },
    { name: 'Multiplication', icon: multiplicationIcon },
    { name: 'Division', icon: divisionIcon },
  ];

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };


  return (
    
    <div
      className="relative min-h-[100vh] w-full flex flex-col items-center justify-start pt-12 pb-24 px-4 overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
     <h1 className="text-4xl md:text-5xl font-bold text-[#3B2F2F] mb-10 drop-shadow-sm">
        Let's Learn Math!
    </h1>

      <div className="flex flex-wrap justify-center gap-10 z-10">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="p-10 w-70 h-70 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105"
          >
            <img
              src={subject.icon}
              alt={subject.name}
              className="w-50 h-50 mb-4 object-contain aspect-square drop-shadow-md"
              onClick={()=>handleTopicClick(subject.name)}
            />
            <span className="text-center text-lg font-semibold text-gray-800">
              {subject.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoMainPage;
