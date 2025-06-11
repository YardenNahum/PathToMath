import React from 'react';
import SubjectCircle from './SubjectCircle';
import mathCircle from '../../../assets/Images/math_circle.png';
import vidsCircle from '../../../assets/Images/vids_circle.png';
import badgeCircle from '../../../assets/Images/badge_circle.png';
import popquiz_circle from '../../../assets/Images/popquiz_circle.png';
import streak_icon from '../../../assets/Images/star.png';
import { useUser } from '../../Utils/UserContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateUser } from '../../../services/UserService';
import { useGrade } from '../../Utils/GradeComponent';
const { grade } = useGrade();
const circleData = [
  {
    title: 'Battle Rocket',
    description: 'Battle your friends in a rocket race!',
    imageSrc: mathCircle,
    link: `/BattleRocketGame/Addition/${grade}/20`,
  },
  {
    title: 'Math Problems',
    description: 'Solve fun puzzles to improve your skills!',
    imageSrc: mathCircle,
    link: '/subjects',
  },
  {
    title: 'Tutorial Videos',
    description: 'Watch videos to learn new tricks!',
    imageSrc: vidsCircle,
    link: '/videos',
  },
  {
    title: 'Pop Quiz',
    description: 'Take quick quizzes to test yourself!',
    imageSrc: popquiz_circle,
    link: '/pop-quiz',
  },
  {
    title: 'Badges',
    description: 'Earn badges as you progress!',
    imageSrc: badgeCircle,
    link: '/badges',
  },
];
function CirclesContainer() {
  const { user,update } = useUser();
  useEffect(() => {
      if (!user?.pop_quiz_last_date) return;
      const lastDate = new Date(user.pop_quiz_last_date);
      const today = new Date();
      lastDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const lastTime = lastDate.getTime();

      const isSameDay = lastTime === today.getTime();
      const isYesterday = lastTime === yesterday.getTime();

      if (!isSameDay && !isYesterday && user.streak !== 0) {
        const newUser = { ...user, streak: 0 };
        updateUser(user.email, newUser);
        update(user.email, newUser); // update context too

      }
    }, [user]);
  return (
    <div className="flex flex-wrap justify-center gap-6 mb-8 w-full h-1/2">
      {circleData.map(({ imageSrc, title, description, link }, index) => {
        const isPopQuiz = title === "Pop Quiz";

        return (
          <div key={index} className="relative">
            {isPopQuiz && user && (
              <div className="absolute right-5 z-2 top-3">
                <img src={streak_icon} alt="streak" className="streak w-15 h-15"/>
                <span className="absolute inset-0 flex items-center justify-center text-yellow-900 font-bold text-lg">
                  {user.streak}
                </span>
              </div>
            )}
            <Link to={link} key={index}>
              <SubjectCircle
                imageSrc={imageSrc}
                title={title}
                description={description}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
}


export default CirclesContainer;
