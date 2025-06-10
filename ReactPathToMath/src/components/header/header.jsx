import React from 'react'
import DynamicMenu from './DynamicMenu'
import { useLoginStatus } from '../Utils/LoginStatusComponent';
import { Link } from 'react-router-dom';
import { useState } from 'react'
import logo from '../../assets/Images/logo copy.png'
import starIcon from '../../assets/Images/star.png'
import MathProbLogo from '../../assets/Images/MathProblemsLogo.png'
import ProfileIcon from '../../assets/Images/profile.png'
import LoginIcon from '../../assets/Images/login.png'
import LogoutIcon from '../../assets/Images/logout.png'
import TutorialVideosIcon from '../../assets/Images/helpVideos.png'
import ParentOverviewIcon from '../../assets/Images/ParentOverview.png'
import SignupIcon from '../../assets/Images/SignupIcon.png'
import BadgesIcon from '../../assets/Images/BadgesHeaderIcon.png'
import PopQuizIcon from '../../assets/Images/PopQuizHeaderIcon.png'

function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isParent = localStorage.getItem("userType") == "Parent";

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  const { isLoggedIn } = useLoginStatus();

  // Main menu item
  let menuData = [
    {
      //Home page
      label: 'Home',
      link: '/',
      icon: starIcon,
      colorClass: "bg-blue-700 hover:bg-blue-600",
      submenuColor: "hover:bg-blue-500",
      className: "Home"
    },
    {
      //Math Problems page
      label: 'Math Problems',
      link: '/subjects',
      icon: MathProbLogo,
      colorClass: "bg-orange-500 hover:bg-orange-600",
      submenuColor: "hover:bg-orange-400",
      submenu: [
        { label: 'Addition', link: '/subjects/Addition', class: "Addition" },
        { label: 'Subtraction', link: '/subjects/Subtraction', class: "Subtraction" },
        { label: 'Multiplication', link: '/subjects/Multiplication', class: "Multiplication" },
        { label: 'Division', link: '/subjects/Division', class: "Division" },
        { label: 'Percentage', link: '/subjects/Percentage', class: "Percentage" }
      ],
      className: "MathProblems"
    },
    {
      label: 'Tutorial Videos',
      link: '/videos',
      icon: TutorialVideosIcon,
      colorClass: "bg-red-500 hover:bg-red-600",
      submenuColor: "hover:bg-red-400",
      submenu: [
        { label: 'Addition', link: '/videos/Addition' },
        { label: 'Subtraction', link: '/videos/Subtraction' },
        { label: 'Multiplication', link: '/videos/Multiplication' },
        { label: 'Division', link: '/videos/Division' },
        { label: 'Percentage', link: '/videos/Percentage' }
      ],
      class: "TutorialVideos"
    },
        {
      label: 'Pop Quiz',
      link: '/pop-quiz',
      icon: PopQuizIcon,
      colorClass: "bg-pink-600 hover:bg-pink-700",
      submenuColor: "hover:bg-red-400",
      class: "PopQuiz"
    },
        {
      label: 'Badges',
      link: '/badges',
      icon: BadgesIcon,
      colorClass: "bg-yellow-800 hover:bg-yellow-700",
      submenuColor: "hover:bg-red-400",
      class: "Badges"
    }
  ];

  //  User is a parent, add Parent Overview to menu
  if (isParent) {
    menuData = [];

    menuData.push({
      label: 'Home',
      link: '/',
      icon: starIcon,
      colorClass: "bg-blue-700 hover:bg-blue-600",
      submenuColor: "hover:bg-blue-500",
      className: "Home"
    });
    
    menuData.push({
      label: 'Parent Overview',
      link: '/ParentPage',
      icon: ParentOverviewIcon,
      colorClass: "bg-orange-500 hover:bg-orange-600",
      submenuColor: "hover:bg-orange-500",
      className: "ParentView"
    });

    
  }

  // Add Login or Logout dynamically
  if (isLoggedIn) {
    menuData.push(
      {
        //Profile Page
        label: 'Profile',
        link: '/profile',
        icon: ProfileIcon,
        colorClass: "bg-green-500 hover:bg-green-600",
        submenuColor: "hover:bg-green-400",
        class: "Profile",
      });

    menuData.push({
      label: 'Logout',
      link: '/logout',
      colorClass: 'bg-purple-500 hover:bg-purple-600',
      icon: LogoutIcon
    });
  } else {
    menuData.push({
      label: 'Signup',
      link: '/signup',
      colorClass: "bg-green-500 hover:bg-green-600",
      icon: SignupIcon
    });

    menuData.push({
      label: 'Login',
      link: '/login',
      colorClass: 'bg-purple-500 hover:bg-purple-600',
      icon: LoginIcon
    });
  }
  return (
    <header className="flex flex-col xl:flex-row items-start xl:items-center z-30 justify-between w-full py-6 px-6 md:px-20 bg-blue-400 drop-shadow-md playful-font relative">
      <div className="flex justify-between items-center w-full xl:w-auto">
        {/* Logo link to Home */}
        <Link to="/" className="hover:scale-105 transition-all">
          <img src={logo} alt="Logo" className="  w-60" />
        </Link>
        
        <button className="xl:hidden text-3xl text-white cursor-pointer" onClick={toggleMobileMenu}>
          {/* simple hamburger menu for mobile view */}
          {isMobileOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden xl:block">
        <DynamicMenu items={menuData} isMobile={false} />
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="w-full mt-4 xl:hidden">
          <DynamicMenu items={menuData} isMobile={true} />
        </div>
      )}
    </header>
  );
}
export default Header;