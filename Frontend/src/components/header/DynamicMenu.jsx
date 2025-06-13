import React from 'react';
import NavBarItem from './navBarItem';

function DynamicMenu({ items, isMobile, closeMenu  }) {
  return (
    <ul className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-12'}`}>
      {items.map((item) => (
        <NavBarItem item={item} key={item.label} isMobile={isMobile} onClick={isMobile ? closeMenu : undefined} />
      ))}
    </ul>
  );
}
export default DynamicMenu;
