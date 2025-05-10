import React from 'react'
import DynamicMenu from './DynamicMenu'
import { useLoginStatus } from '../Main/LoginStatusComponent';

import { useState } from 'react'
import logo from '../../assets/Images/logo.png'
import starIcon from '../../assets/Images/star.png'
import MathProbLogo from '../../assets/Images/MathProblemsLogo.png'
import ProfileIcon from '../../assets/Images/profile.png'
import LoginIcon from '../../assets/Images/login.png'
import LogoutIcon from '../../assets/Images/logout.png'
import TutorialVideosIcon from '../../assets/Images/helpVideos.png'

function Header() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };
    const { isLoggedIn } = useLoginStatus();
    
    // Main menu item
    const menuData = [
        {
            //Home page
            label: 'Home', 
            link: '',
            icon: starIcon,
            colorClass: "bg-blue-700 hover:bg-blue-600",
            submenuColor: "hover:bg-blue-500",
            className: "Home"
        },
        {
            //Math Problems page
            label: 'Math Problems', 
            link: '/src/math_subjects/mathSubjectsPage.html',
            icon: MathProbLogo,
            colorClass: "bg-orange-500 hover:bg-orange-600",
            submenuColor: "hover:bg-orange-400",
            submenu: [
                { label: 'Addition', link: '/src/subject_levels/subjectsLevelsPage.html', class: "Addition" },
                { label: 'Subtraction', link: '/src/subject_levels/subjectsLevelsPage.html', class: "Subtraction" },
                { label: 'Multiply', link: '/src/subject_levels/subjectsLevelsPage.html', class: "Multiply" },
                { label: 'Division', link: '/src/subject_levels/subjectsLevelsPage.html', class: "Division" },
                { label: 'Percentage', link: '/src/subject_levels/subjectsLevelsPage.html', class: "Percentage" }
            ],
            className: "MathProblems"
        },
        {
            label: 'Tutorial Videos',
            link: '/VideosPage',
            icon:TutorialVideosIcon,
            colorClass: "bg-red-500 hover:bg-red-600",
            submenuColor: "hover:bg-red-400",
            submenu: [
                { label: 'Addition', link: '#AdditionVideos' },
                { label: 'Subtraction', link: '#SubstractionVideos' },
                { label: 'Multiply', link: '#MultiplicationVideos' },
                { label: 'Division', link: '#DivisionVideos' },
                { label: 'Percentage', link: '#PercentageVideos' }
            ],
            class: "TutorialVideos"
        },
        {
            //Profile Page
            label: 'Profile',
            link: '/src/Profile/profile.html',
            icon: ProfileIcon,
            colorClass: "bg-green-500 hover:bg-green-600",
            submenuColor: "hover:bg-green-400",
            class: "Profile",
        },
    ];

// Add Login or Logout dynamically
if (isLoggedIn) {
    menuData.push({
        label: 'Logout',
        link: '#',
        colorClass: 'bg-purple-500 hover:bg-purple-600',
        icon: LogoutIcon
    });
}   else {
        menuData.push({
            label: 'Login',
            link: '/login', 
            colorClass: 'bg-purple-500 hover:bg-purple-600',
            icon:LoginIcon
        });
}
return (
    <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between w-full py-6 px-6 md:px-20 bg-blue-400 drop-shadow-md playful-font relative">
      <div className="flex justify-between items-center w-full xl:w-auto">
      <a href="a" className="hover:scale-105 transition-all">
    <img src={logo} alt="Logo" className="w-62 rounded-2xl" />
      </a>
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