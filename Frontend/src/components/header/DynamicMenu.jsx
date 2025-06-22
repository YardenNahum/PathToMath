import React from 'react';
import NavBarItem from './navBarItem';

/**
 * Renders a navigation menu as a list of items.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.items - Array of menu items to render.
 * @param {boolean} props.isMobile - Flag indicating if the menu is displayed on mobile.
 * @param {function} [props.closeMenu] - Function to close the mobile menu when an item is clicked.
 * @returns {JSX.Element} The rendered menu component.
 */
function DynamicMenu({ items, isMobile, closeMenu }) {
  return (
    <ul className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-12'}`}>
      {items.map((item) => (
        <NavBarItem item={item} key={item.label} isMobile={isMobile} onClick={isMobile ? closeMenu : undefined} />
      ))}
    </ul>
  );
}
export default DynamicMenu;
