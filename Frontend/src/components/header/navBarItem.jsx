import React from 'react';
import SubMenu from './subMenu';
import { Link } from 'react-router-dom';

/**
 * NavBarItem component renders a single navigation item in the navbar.
 * It displays an optional icon and label, handles clicks, and shows a submenu on hover (desktop only).
 * 
 * @param {Object} props
 * @param {Object} props.item - Navigation item data including label, link, icon, submenu, and styling class
 * @param {boolean} props.isMobile - Flag indicating if the menu is rendered on a mobile device (affects submenu behavior)
 * @param {function} props.onClick - Click handler function for this menu item
 * @returns {React.ReactNode} The rendered navigation bar item
 */
function NavBarItem({ item, isMobile, onClick }) {
  return (
    <li onClick={onClick} className="relative group " key={item.label}>
      <div>
        {/* Link with optional icon and label, styled with provided or default classes */}
        <Link to={item.link} className={`flex navBarItem whitespace-nowrap items-center gap-2 px-4 py-2 rounded-full transition-all ${item.colorClass || 'bg-white text-black hover:bg-gray-200'}`}>

          {/* Conditionally render icon if provided */}
          {item.icon && (
            <img src={item.icon} alt="" className="w-5 h-5 object-contain" />
          )}

          {/* Item label with drop shadow */}
          <span className="drop-shadow-lg object-contain">{item.label}</span>
        </Link>

        {/* Invisible hover buffer to improve submenu hover experience */}
        <div className="absolute top-full left-0 h-8 w-full group-hover:block hidden pointer-events-auto"></div>

        {/* Render submenu only on desktop (not mobile) and if submenu items exist */}
        {!isMobile && item.submenu && item.submenu.length > 0 && (
          <SubMenu items={item.submenu} colorClass={item.submenuColor} />
        )}
      </div>
    </li>
  );
}

export default NavBarItem;
