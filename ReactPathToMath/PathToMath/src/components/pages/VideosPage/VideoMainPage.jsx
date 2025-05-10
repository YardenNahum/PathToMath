import React from 'react';
import background from '../../../assets/Images/Background/background3.png'; 


const VideoMainPage = () => {
  const subjects = [
    { name: 'Addition' },
    { name: 'Subtraction' },
    { name: 'Multiplication' },
    { name: 'Division' },
  ];

  return (
    <div
      className="relative min-h-[80vh] bg-blue-100 px-4 pt-10 pb-24 flex flex-col items-center justify-start overflow-hidden"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 drop-shadow-lg">
        Choose a Topic
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {subjects.map((subject, index) => (
          <button
            key={index}
            className="bg-yellow-300 hover:bg-yellow-400 text-lg font-semibold text-gray-800 px-8 py-4 rounded-2xl shadow-md transition-transform duration-200 hover:scale-105"
          >
            {subject.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoMainPage;