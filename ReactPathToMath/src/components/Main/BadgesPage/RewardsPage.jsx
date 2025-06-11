import React, { useState } from 'react';
import { useGrade } from '../../Utils/GradeComponent';
import { useUser } from "../../Utils/UserContext";
import ShadowedTitle from '../../Utils/ShadowedTitle';
import GuestPrompt from './GuestPrompt';
import BadgesBg from '../../../assets/Images/Background/badgesBg.jpg';
import SubjectBadgesPopup from './SubjectBadgesPopup';
import Badge from './Badge';

// Subject badges map unchanged
const subjectBadgesMap = {
  Addition: [
    { title: "Addition Novice", description: "Complete 5 levels", icon: "🎖️", color: "from-green-400 to-emerald-500", level: 5 },
    { title: "Addition Pro", description: "Complete 15 levels", icon: "🏅", color: "from-blue-400 to-cyan-500", level: 15 },
    { title: "Addition Expert", description: "Complete 25 levels", icon: "🏆", color: "from-purple-400 to-pink-500", level: 25 },
    { title: "Addition Master", description: "Complete 30 levels", icon: "👑", color: "from-yellow-400 to-orange-500", level: 30 },
  ],
  Subtraction: [
    { title: "Subtraction Novice", description: "Complete 5 levels", icon: "🎖️", color: "from-green-400 to-emerald-500", level: 5 },
    { title: "Subtraction Pro", description: "Complete 15 levels", icon: "🏅", color: "from-blue-400 to-cyan-500", level: 15 },
    { title: "Subtraction Expert", description: "Complete 25 levels", icon: "🏆", color: "from-purple-400 to-pink-500", level: 25 },
    { title: "Subtraction Master", description: "Complete 30 levels", icon: "👑", color: "from-yellow-400 to-orange-500", level: 30 },
  ],
  Multiplication: [
    { title: "Multiplication Novice", description: "Complete 5 levels", icon: "🎖️", color: "from-green-400 to-emerald-500", level: 5 },
    { title: "Multiplication Pro", description: "Complete 15 levels", icon: "🏅", color: "from-blue-400 to-cyan-500", level: 15 },
    { title: "Multiplication Expert", description: "Complete 25 levels", icon: "🏆", color: "from-purple-400 to-pink-500", level: 25 },
    { title: "Multiplication Master", description: "Complete 30 levels", icon: "👑", color: "from-yellow-400 to-orange-500", level: 30 },
  ],
  Division: [
    { title: "Division Novice", description: "Complete 5 levels", icon: "🎖️", color: "from-green-400 to-emerald-500", level: 5 },
    { title: "Division Pro", description: "Complete 15 levels", icon: "🏅", color: "from-blue-400 to-cyan-500", level: 15 },
    { title: "Division Expert", description: "Complete 25 levels", icon: "🏆", color: "from-purple-400 to-pink-500", level: 25 },
    { title: "Division Master", description: "Complete 30 levels", icon: "👑", color: "from-yellow-400 to-orange-500", level: 30 },
  ],
  Percentage: [
    { title: "Percentage Novice", description: "Complete 5 levels", icon: "🎖️", color: "from-green-400 to-emerald-500", level: 5 },
    { title: "Percentage Pro", description: "Complete 15 levels", icon: "🏅", color: "from-blue-400 to-cyan-500", level: 15 },
    { title: "Percentage Expert", description: "Complete 25 levels", icon: "🏆", color: "from-purple-400 to-pink-500", level: 25 },
    { title: "Percentage Master", description: "Complete 30 levels", icon: "👑", color: "from-yellow-400 to-orange-500", level: 30 },
  ],
};

const subjectStyleMap = {
  Addition: { icon: "➕", color: "from-green-400 to-emerald-500" },
  Subtraction: { icon: "➖", color: "from-red-400 to-rose-500" },
  Multiplication: { icon: "✖️", color: "from-yellow-400 to-orange-500" },
  Division: { icon: "➗", color: "from-blue-400 to-cyan-500" },
  Percentage: { icon: "%", color: "from-purple-400 to-pink-500" },
};

const RewardsPage = () => {
  const { user } = useUser();
  const { grade } = useGrade();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedSubject(null);
  };

  // Get levels for the current grade only
  const currentGradeData = user?.gradeLevel?.[grade - 1] || {};

  // Total levels completed in current grade
  const totalLevelsCompleted = Object.values(currentGradeData).reduce((sum, lvl) => {
    return sum + (typeof lvl === 'number' ? lvl : 0);
  }, 0);

  // Breakdown by subject for current grade
  const subjectBreakdown = { ...currentGradeData };

  const badgesForSubject = selectedSubject && subjectBadgesMap[selectedSubject]
    ? subjectBadgesMap[selectedSubject].map(badge => ({
      ...badge,
      currentProgress: subjectBreakdown[selectedSubject] || 0,
      isEarned: (subjectBreakdown[selectedSubject] || 0) >= badge.level,
    }))
    : [];

  // Get subjects available for the current grade from user's data
  const currentGradeSubjects = user?.gradeLevel?.[grade - 1] || {};

  // Available subjects
  const availableSubjects = Object.keys(currentGradeSubjects);

  // Calculate max levels (30 levels max per subject)
  const maxLevels = availableSubjects.length * 30;

  // Calculate progress percent
  const progressPercent = maxLevels > 0 ? (totalLevelsCompleted / maxLevels) * 100 : 0;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${BadgesBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {!user?.name ? (
        <GuestPrompt />
      ) : (
        <>
          <div className="playful-font relative z-10 flex flex-col items-center justify-start pt-8 pb-16 px-4">
            <div className="flex items-center gap-4 mb-8">
              <ShadowedTitle text={"Explore Your Badges!"} />
            </div>
            <div className="mb-6 text-center bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-2xl font-bold text-white drop-shadow-lg">Welcome back, {user.name}! 🌟</p>
            </div>
            <div className="mb-8 w-full max-w-2xl">
              <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-blue-200 relative overflow-hidden">
                <div className="mb-8 text-center">
                  <p className="text-xl text-black font-semibold">🎉 Collect them all by mastering math! 🎉</p>
                </div>
                <div className="relative flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🚀</span>
                    <span className="text-2xl font-bold text-purple-600">{totalLevelsCompleted}</span>
                    <span className="text-lg font-semibold text-gray-700">Levels Complete!</span>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 bg-gray-200 rounded-full h-6 border-2 border-gray-300 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 animate-pulse"
                        style={{ width: `${Math.min(100, progressPercent)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-600">{Math.round(progressPercent)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {Object.entries(subjectBreakdown).length > 0 && (
              <div className="mb-8 w-full max-w-6xl">
                <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-green-200">
                  <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">📊 Your Subject Progress</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
                    {Object.entries(subjectBreakdown).map(([subject, levels]) => {
                      const style = subjectStyleMap[subject] || {
                        icon: "❓",
                        color: "from-gray-400 to-gray-500",
                      };

                      return (
                        <div
                          key={subject}
                          onClick={() => handleSubjectClick(subject)}
                          className="cursor-pointer"
                        >
                          <Badge
                            reward={{
                              title: subject,
                              icon: style.icon,
                              color: style.color,
                              label: `${levels} Levels Completed`,
                            }}
                            isEarned={true}
                            showProgress={true}
                            currentProgress={levels}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {showPopup && selectedSubject && (
            <SubjectBadgesPopup
              subject={selectedSubject}
              onClose={handleClosePopup}
              badges={badgesForSubject}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RewardsPage;
