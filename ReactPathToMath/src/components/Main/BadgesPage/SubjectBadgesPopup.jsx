import React from 'react';
import Badge from './Badge';

const SubjectBadgesPopup = ({ subject, badges, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl p-6 w-[90%] max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{subject} Badges</h2>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              reward={badge}
              index={index}
              isEarned={badge.isEarned}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectBadgesPopup;
