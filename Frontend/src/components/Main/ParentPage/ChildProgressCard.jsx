import React from 'react';
import CardBckgr from '../../../assets/Images/Background/StudentCardBg.jpg'

function ChildProgressCard({ child }) {
  const subjects = ['Addition', 'Subtraction', 'Multiply', 'Division', 'Percentage'];
  const gradeIndex = parseInt(child?.grade) - 1;
  const levelData = child?.gradeLevel[gradeIndex];

  return (
    <div style={{ backgroundImage: `url(${CardBckgr})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    className="pt-5 rounded-2xl border-4 border-purple-700 p-4 shadow-md flex flex-col items-center text-center mx-auto max-w-[750px]"
    >
      <div className="flex justify-center w-full mb-4">
        <div className="flex items-center gap-4">
          <img
            src={child?.avatar}
            alt={`${child?.name}'s avatar`}
            className="w-24 h-24 rounded-full object-cover outline-3 outline-purple-500"
          />
          <div className="flex flex-col justify-start text-left">
            <h2 className="text-3xl text-wrap font-semibold text-purple-700 leading-snug">{child?.name}</h2>
            <p className="text-lg text-purple-600 mt-1">Grade {child?.grade}</p>
          </div>
        </div>
      </div>
      {/* Subject progress: 2 per row, wrap as needed */}
      <div className="w-full flex flex-wrap justify-center gap-4 mt-3 px-2">
        {subjects.map((subject, index) => {
          const completed = levelData?.[subject] ?? 0;
          const total = 30;
          const percentage = Math.round((completed / total) * 100);
          const isCompleted = completed >= total;

          return (
            <div key={index} className="w-[45%] min-w-[140px] text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-800">{subject}</span>
                <span className="text-sm text-gray-800">{completed}/{total}</span>
              </div>
              {/* Progress Bar */}
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-yellow-400'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="mt-1 flex justify-end text-lg">
                <span className={isCompleted ? '' : 'opacity-40'}>🏅</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChildProgressCard;
