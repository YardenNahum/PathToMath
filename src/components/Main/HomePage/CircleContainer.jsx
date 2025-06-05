import React from 'react';
import SubjectCircle from './SubjectCircle';
import mathCircle from '../../../assets/Images/math_circle.png';
import vidsCircle from '../../../assets/Images/vids_circle.png';
import badgeCircle from '../../../assets/Images/badge_circle.png';
import popquiz_circle from '../../../assets/Images/popquiz_circle.png';
import streak_icon from '../../../assets/Images/star.png';
import { useUser } from '../../Utils/UserContext';

import { Link } from 'react-router-dom';

const circleData = [
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
  const { user } = useUser();

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8 w-full h-1/2">
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
