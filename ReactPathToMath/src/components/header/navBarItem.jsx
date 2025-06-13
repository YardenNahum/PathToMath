import React from 'react';
import SubMenu from './subMenu';
import { Link } from 'react-router-dom';

function NavBarItem({ item, isMobile, onClick }) {
  return (
    <li onClick={onClick} className="relative group " key={item.label}>
      <div>
        <Link to={item.link} className={`flex navBarItem whitespace-nowrap items-center gap-2 px-4 py-2 rounded-full transition-all ${item.colorClass || 'bg-white text-black hover:bg-gray-200'}`}>
          {item.icon && (
            <img src={item.icon} alt="" className="w-5 h-5 object-contain" />
          )}<span className="drop-shadow-lg object-contain">{item.label}</span>
        </Link>

        {/* Invisible hover buffer */}
        <div className="absolute top-full left-0 h-8 w-full group-hover:block hidden pointer-events-auto"></div>

        {!isMobile && item.submenu && item.submenu.length > 0 && (
          <SubMenu items={item.submenu} colorClass={item.submenuColor} />
        )}
      </div>
    </li>
  );
}

export default NavBarItem;
