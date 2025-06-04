import React from 'react';
import { useUser } from '../../Utils/UserContext';

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
        isEarned ? 'scale-100 opacity-100 animate-pulse' : 'scale-75 opacity-40'
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
            <div className="absolute top-2 right-2 text-yellow-300 text-xl animate-ping">✨</div>
            <div className="absolute top-4 left-2 text-yellow-200 text-sm animate-bounce delay-100">⭐</div>
            <div className="absolute bottom-2 right-4 text-yellow-300 text-lg animate-pulse delay-200">💫</div>
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
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full w-1/3 " />
          </div>
        )}

        {/* Shine effect for earned badges */}
        {isEarned && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full" />
        )}
      </div>
    </div>
  );
};

const RewardsPage = () => {
  const { user } = useUser();
  const grade = user?.grade || 1;

  const getUserTotalLevels = () => {
    if (!user || !user.gradeLevel) return 0;
    let total = 0;
    for (const subject in user.gradeLevel[grade - 1]) {
      total += user.gradeLevel[grade - 1][subject];
    }
    return total;
  };

  const totalLevelsCompleted = getUserTotalLevels();
  const earnedRewards = rewardsList.filter(reward => totalLevelsCompleted >= reward.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative overflow-hidden">


      <div className="relative z-10 flex flex-col items-center justify-start pt-8 pb-16 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="text-5xl animate-spin">🌟</div>
          <h1 className="text-4xl md:text-6xl font-bold text-center text-white drop-shadow-lg">
            Your Amazing Badges!
          </h1>
          <div className="text-5xl animate-spin">🌟</div>
        </div>

        {/* Fun subtitle */}
        <div className="mb-8 text-center">
          <p className="text-xl text-gray-600 font-semibold">
            🎉 Collect them all by mastering math! 🎉
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-xl border-4 border-blue-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50" />
          <div className="relative flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🚀</span>
              <span className="text-2xl font-bold text-purple-600">
                {totalLevelsCompleted}
              </span>
              <span className="text-lg font-semibold text-gray-700">Levels Complete!</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-40 bg-gray-200 rounded-full h-6 border-2 border-gray-300 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 animate-pulse"
                  style={{ width: `${Math.min(100, (totalLevelsCompleted / 30) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-600">{Math.round((totalLevelsCompleted / 30) * 100)}%</span>
            </div>
          </div>
        </div>

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
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    🎉 Badges You've Earned! 🎉
                  </h2>
                  <p className="text-lg text-gray-600 font-medium">You're doing amazing!</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {earnedRewards.map((reward, index) => (
                    <Badge
                      key={index}
                      reward={reward}
                      index={index}
                      isEarned={true}
                    />
                  ))}
                </div>
              </div>

              {/* Upcoming badges */}
              {earnedRewards.length < rewardsList.length && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">
                      🎯 Next Challenge Awaits! 🎯
                    </h2>
                    <p className="text-lg text-gray-600 font-medium">Keep going to unlock these badges!</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rewardsList
                      .filter(reward => totalLevelsCompleted < reward.level)
                      .map((reward, index) => (
                        <Badge
                          key={index}
                          reward={reward}
                          index={index}
                          isEarned={false}
                        />
                      ))}
                  </div>
                </div>
              )}
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