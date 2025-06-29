import React from 'react';
import CardBckgr from '../../../assets/Images/Background/StudentCardBg.jpg';
import avatar1 from '../../../assets/Images/Avatars/avatar1.png';
import avatar2 from '../../../assets/Images/Avatars/avatar2.png';
import avatar3 from '../../../assets/Images/Avatars/avatar3.png';
import avatar4 from '../../../assets/Images/Avatars/avatar4.png';
import avatar5 from '../../../assets/Images/Avatars/avatar5.png';
import avatar6 from '../../../assets/Images/Avatars/avatar6.png';
import avatar7 from '../../../assets/Images/Avatars/avatar7.png';
import avatar8 from '../../../assets/Images/Avatars/avatar8.png';

// Avatar Map
const avatarMap = {
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
};

/**
 * ChildProgressCard component
 * @param {Object} child- The props for the component.
 * @returns {JSX.Element} - The rendered ChildProgressCard component.
 */
function ChildProgressCard({ child }) {
  const subjects = ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Percentage'];
  //gets the grade level data based on the child's grade
  const gradeIndex = parseInt(child?.grade) - 1;
  //levelData is an array of objects, each object contains the progress for each subject
  const levelData = child?.gradeLevel?.[gradeIndex];
  return (
    <div style={{ backgroundImage: `url(${CardBckgr})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    className="pt-5 rounded-2xl border-4 border-purple-700 p-4 shadow-md flex flex-col items-center text-center mx-auto max-w-[750px]"
    >
      <div className="flex justify-center w-full mb-4">
        <div className="flex items-center gap-4">
          <img
            src={avatarMap[child?.avatar] || avatar1} // use avatar map here
            alt={`${child?.name}'s avatar`}
            className="w-24 h-24 rounded-full object-cover outline-3 outline-purple-500"
          />
          <div className="flex flex-col justify-start text-left">
            <h2 className="text-3xl text-wrap font-semibold text-purple-700 leading-snug">{child?.name}</h2>
            <p className="text-lg text-purple-600 mt-1">Grade {child?.grade}</p>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-wrap justify-center gap-4 mt-3 px-2">
        {subjects.map((subject, index) => {
          const completed = levelData?.[subject]?.level ?? 0;
          const total = 30;
          const percentage = Math.round((completed / total) * 100);
          const isCompleted = completed >= total;

          return (
            <div key={index} className="w-[45%] min-w-[140px] text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-800">{subject}</span>
                <span className="text-sm text-gray-800">{completed}/{total}</span>
              </div>
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
