import React from 'react';
import SubjectCircle from './SubjectCircle';
import mathCircle from '../../../assets/Images/HomePage/math_circle.png';
import vidsCircle from '../../../assets/Images/HomePage/vids_circle.png';
import badgeCircle from '../../../assets/Images/HomePage/badge_circle.png';
import multiplayerCircle from '../../../assets/Images/HomePage/multiplayer_circle.png';
import popquiz_circle from '../../../assets/Images/HomePage/popquiz_circle.png';
import streak_icon from '../../../assets/Images/NavbarIcons/star.png';
import { useUser } from '../../Utils/UserContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateUser } from '../../../services/UserService';

/**
 * Renders a container with circular subject icons.
 * @returns {JSX.Element} - The rendered circle container.
 */
const circleData = [
  {
    title: 'Play With A Friend',
    description: 'Battle your friends in a rocket race!',
    imageSrc: multiplayerCircle,
    link: `/RocketGame/multi/Addition/1/20`,
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
/**
 * CirclesContainer component
 * @returns {JSX.Element} - The rendered circle container.
 */
function CirclesContainer() {
  const { user,update } = useUser();
  // Effect to reset user streak if last pop quiz was not today or yesterday
  // This effect checks the user's last pop quiz date and resets the streak if necessary
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
    <div className="flex flex-wrap justify-center mb-8 md: flex w-3/4">
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
