import React from 'react'
import DynamicMenu from './DynamicMenu'
import { useLoginStatus } from '../Utils/LoginStatusComponent';
import { Link } from 'react-router-dom';
import { useState } from 'react'
import logo from '../../assets/Images/NavbarIcons/logo copy.png'
import starIcon from '../../assets/Images/NavbarIcons/star.png'
import MathProbLogo from '../../assets/Images/NavbarIcons/MathProblemsLogo.png'
import ProfileIcon from '../../assets/Images/NavbarIcons/profile.png'
import LoginIcon from '../../assets/Images/NavbarIcons/login.png'
import LogoutIcon from '../../assets/Images/NavbarIcons/logout.png'
import TutorialVideosIcon from '../../assets/Images/NavbarIcons/helpVideos.png'
import ParentOverviewIcon from '../../assets/Images/NavbarIcons/ParentOverview.png'
import SignupIcon from '../../assets/Images/NavbarIcons/SignupIcon.png'

/**
 * Header component renders the top navigation bar.
 * It displays the logo, a responsive menu toggle button for mobile,
 * and a dynamic menu that adapts to user login status and user type (e.g. Parent).
 * 
 * The menu items change depending on:
 * - Whether the user is logged in or not (shows Profile and Logout or Signup and Login)
 * - Whether the user is a parent (shows Parent Overview instead of Math Problems and Tutorial Videos)
 * 
 * Mobile menu is toggled by a hamburger button and uses the DynamicMenu component.
 */
function Header() {
  // State to track if the mobile menu is open
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Check localStorage if current user is a parent
  const isParent = localStorage.getItem("userType") == "Parent";

  // Toggle mobile menu open/close state
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Get current login status from context
  const { isLoggedIn } = useLoginStatus();

  // Default menu for non-parent users
  let menuData = [
    {
      label: 'Home',
      link: '/',
      icon: starIcon,
      colorClass: "bg-blue-700 hover:bg-blue-600",
      submenuColor: "hover:bg-blue-500",
      className: "Home"
    },
    {
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
    }
  ];

  // If user is a parent, replace menu with parent-specific items
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

  // Append Profile and Logout links if logged in, otherwise add Signup and Login links
  if (isLoggedIn) {
    menuData.push(
      {
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
        {/* Logo linking to home page */}
        <Link to="/" className="hover:scale-105 transition-all">
          <img src={logo} alt="Logo" className="  w-60" />
        </Link>

        {/* Mobile hamburger menu button */}
        <button className="xl:hidden text-3xl text-white cursor-pointer" onClick={toggleMobileMenu}>
          {/* Show close icon if menu is open, hamburger icon otherwise */}
          {isMobileOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Desktop menu (hidden on mobile) */}
      <div className="hidden xl:block">
        <DynamicMenu items={menuData} isMobile={false} />
      </div>

      {/* Mobile menu (shown only when toggled open) */}
      {isMobileOpen && (
        <div className="w-full mt-4 xl:hidden">
          <DynamicMenu items={menuData} isMobile={true} closeMenu={() => setIsMobileOpen(false)} />
        </div>
      )}
    </header>
  );
}
export default Header;