import React from 'react';
import { useUser } from '../../Utils/UserContext';
import { useNavigate } from "react-router-dom";
import ShadowedTitle from '../../Utils/ShadowedTitle';
import BadgesBg from '../../../assets/Images/Background/badgesBg.jpg'


const rewardsList = [
  { level: 5, title: "Math Beginner", description: "Completed 5 levels!", icon: "🎖️", color: "from-green-400 to-emerald-500" },
  { level: 10, title: "Math Explorer", description: "Completed 10 levels!", icon: "🏅", color: "from-blue-400 to-cyan-500" },
  { level: 20, title: "Math Expert", description: "Completed 20 levels!", icon: "🏆", color: "from-purple-400 to-pink-500" },
  { level: 30, title: "Math Master", description: "Completed all 30 levels!", icon: "👑", color: "from-yellow-400 to-orange-500" },
];




const Badge = ({ reward, index, isEarned }) => {
  return (
    <div
      className={`relative transform transition-all duration-500 hover:rotate-2 ${
        isEarned ? 'scale-100 opacity-100' : 'scale-75'
      }`}         
    >
      <div
        className={`relative flex flex-col items-center p-6 rounded-3xl shadow-2xl border-4 transition-all duration-300 cursor-pointer overflow-hidden
          ${isEarned
            ? `bg-gradient-to-br ${reward.color} border-yellow-300 hover:scale-110 hover:shadow-3xl hover:border-yellow-400`
            : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 hover:scale-105 hover:from-gray-200 hover:to-gray-300'
          }
        `}
      >
        {/* Sparkle effects for earned badges */}
        {isEarned && (
          <>
            <div className="absolute top-2 right-2 text-yellow-300 text-xl animate-bounce">✨</div>
            <div className="absolute bottom-2 left-2 text-yellow-300 text-xl animate-bounce">✨</div>
            <div className="absolute top-4 left-2 text-yellow-200 text-sm animate-bounce delay-200">💫</div>
            <div className="absolute bottom-2 right-4 text-yellow-300 text-lg animate-bounce delay-200">💫</div>
          </>
        )}

        {/* Badge Icon */}
        <div className={`text-6xl mb-3 transition-transform duration-300 hover:scale-125 ${
          isEarned ? 'hover:rotate-12 ' : 'grayscale'
        }`}>
          {reward.icon}
        </div>

        {/* Badge Title */}
        <h2 className={`text-xl font-bold mb-2 text-center ${
          isEarned ? 'text-white drop-shadow-lg' : 'text-gray-500'
        }`}>
          {reward.title}
        </h2>

        {/* Badge Description */}
        <p className={`text-center text-sm ${
          isEarned ? 'text-white/90 ' : 'text-gray-400'
        }`}>
          {reward.description}
        </p>

        {/* Progress indicator for unearned badges */}
        {!isEarned && (
          <div className="mt-3 w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (reward.currentProgress / reward.level) * 100)}%` }}
            />
          </div>
        )}

        {/* Shine effect for earned badges */}
        {isEarned && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-pulse" />
        )}
      </div>
    </div>
  );
};

const SignUpPrompt = () => {
  const navigate = useNavigate(); //  useNavigate must be used inside the component

  const signUpBtn = () => {
    navigate("/Signup"); // ✅ now works correctly
  };

  return (
    <div className="min-h-screen relative overflow-hidden"             
    style={{
                backgroundImage: `url(${BadgesBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
      <div className="relative z-10 mt-10 mb-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header */}
        <div className="flex items-center mb-8 ">
          <ShadowedTitle text={"Discover Your Badges Here!"} shadowColor={'text-blue-400'} ></ShadowedTitle>
        </div>

        {/* Sign up prompt */}
        <div className="bg-white rounded-3xl p-12 shadow-2xl border-4 border-dashed border-purple-300 relative overflow-hidden max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50" />
          <div className="relative text-center">
            <div className="text-8xl mb-6 animate-bounce">🚀</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Create Your Account to Unlock Badges!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Sign up to track your progress and earn amazing math badges as you complete levels!
            </p>

            {/* Preview badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {rewardsList.map((reward, index) => (
                <div key={index} className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl opacity-60">
                  <div className="text-3xl mb-2 grayscale">{reward.icon}</div>
                  <p className="text-xs font-semibold text-gray-500 text-center">{reward.title}</p>
                </div>
              ))}
            </div>

            <button onClick={signUpBtn} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
              Sign Up Now! 🎉
            </button>

            <div className="flex justify-center gap-2 mt-6">
              <span className="text-2xl animate-bounce delay-100">🌟</span>
              <span className="text-2xl animate-pulse delay-200">⭐</span>
              <span className="text-2xl animate-bounce delay-300">💫</span>
            </div>
          </div>
        </div>

        {/* Benefits list */}
        <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 max-w-2xl">
          <h3 className="text-2xl font-bold text-white text-center mb-4">Why Sign Up?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="text-white">
              <div className="text-3xl mb-2">🏆</div>
              <p className="font-semibold">Earn Badges</p>
            </div>
            <div className="text-white">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold">Track Progress</p>
            </div>
            <div className="text-white">
              <div className="text-3xl mb-2">🎯</div>
              <p className="font-semibold">Set Goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




const RewardsPage = () => {
  const { user } = useUser();

  // Check if user is signed up (has an account)
  const isUserSignedUp = user && user.name;

  // If user is not signed up, show sign up prompt
  if (!isUserSignedUp) {
    return <SignUpPrompt />;
  }

  // Calculate total levels completed across all grades and subjects
  const getUserTotalLevels = () => {
    if (!user || !user.gradeLevel || !Array.isArray(user.gradeLevel)) return 0;
    
    let total = 0;
    // Sum up all levels across all grades and subjects
    user.gradeLevel.forEach(gradeObj => {
      if (gradeObj && typeof gradeObj === 'object') {
        Object.values(gradeObj).forEach(level => {
          if (typeof level === 'number') {
            total += level;
          }
        });
      }
    });
    
    return total;
  };

  const totalLevelsCompleted = getUserTotalLevels();
  const earnedRewards = rewardsList.filter(reward => totalLevelsCompleted >= reward.level);

  // Add current progress to rewards for progress bars
  const rewardsWithProgress = rewardsList.map(reward => ({
    ...reward,
    currentProgress: totalLevelsCompleted
  }));

  // Get subject breakdown for display
  const getSubjectBreakdown = () => {
    if (!user || !user.gradeLevel || !Array.isArray(user.gradeLevel)) return {};
    
    const subjects = {};
    user.gradeLevel.forEach(gradeObj => {
      if (gradeObj && typeof gradeObj === 'object') {
        Object.entries(gradeObj).forEach(([subject, level]) => {
          if (typeof level === 'number') {
            subjects[subject] = (subjects[subject] || 0) + level;
          }
        });
      }
    });
    
    return subjects;
  };

  const subjectBreakdown = getSubjectBreakdown();

  return (
    <div className="min-h-screen relative overflow-hidden"
        style={{
                backgroundImage: `url(${BadgesBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>

      <div className="relative z-10 flex flex-col items-center justify-start pt-8 pb-16 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ShadowedTitle text={"Your Badges!"} />
        </div>

        {/* Welcome message with user name */}
        <div className="mb-6 text-center bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
          <p className="text-2xl font-bold text-white drop-shadow-lg">
            Welcome back, {user.name}! 👋
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 w-full max-w-2xl">
          <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-blue-200 relative overflow-hidden">
            <div className="mb-8 text-center">
              <p className="text-xl text-black font-semibold">
                🎉 Collect them all by mastering math! 🎉
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🚀</span>
                <span className="text-2xl font-bold text-purple-600">
                  {totalLevelsCompleted}
                </span>
                <span className="text-lg font-semibold text-gray-700">Levels Complete!</span>
              </div>
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 bg-gray-200 rounded-full h-6 border-2 border-gray-300 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 animate-pulse"
                    style={{ width: `${Math.min(100, (totalLevelsCompleted / 30) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-600">{Math.round((totalLevelsCompleted / 30) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        {Object.keys(subjectBreakdown).length > 0 && (
          <div className="mb-8 w-full max-w-4xl">
            <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-green-200">
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">📊 Your Subject Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(subjectBreakdown).map(([subject, levels]) => (
                  <div key={subject} className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                    <div className="text-2xl mb-2">
                      {subject === 'Addition' && '➕'}
                      {subject === 'Subtraction' && '➖'}
                      {subject === 'Multiplication' && '✖️'}
                      {subject === 'Division' && '➗'}
                      {subject === 'Percentage' && '💯'}
                    </div>
                    <p className="font-semibold text-gray-700 text-sm">{subject}</p>
                    <p className="text-xl font-bold text-purple-600">{levels}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="w-full max-w-7xl">
          {earnedRewards.length === 0 ? (
            <div className="text-center bg-white rounded-3xl p-12 shadow-2xl border-4 border-dashed border-gray-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30" />
              <div className="relative">
                <div className="text-8xl mb-6 animate-bounce">🚀</div>
                <p className="text-3xl font-bold mb-4 text-gray-800">
                  Ready for Adventure?
                </p>
                <p className="text-xl text-gray-600 mb-4">
                  Complete math levels to earn your first awesome badge!
                </p>
                <p className="text-lg text-purple-600 font-semibold">
                  You need {5 - totalLevelsCompleted} more levels for your first badge!
                </p>
                <div className="flex justify-center gap-2 mt-6">
                  <span className="text-2xl animate-bounce delay-100">🌟</span>
                  <span className="text-2xl animate-pulse delay-200">⭐</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-white">
                    🎉 Badges You've Earned! 🎉
                  </h2>
                  <p className="text-lg text-white font-medium">You're doing amazing!</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rewardsWithProgress.map((reward, index) => (
                    <Badge
                      key={index}
                      reward={reward}
                      index={index}
                      isEarned={totalLevelsCompleted < reward.level?false:true}
                    />
                  ))}
                  
                </div>
              </div>
            </>
          )}
        </div>

        {/* Motivational footer */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg">
            <p className="text-lg font-bold">Keep learning, keep growing! 📚✨</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;