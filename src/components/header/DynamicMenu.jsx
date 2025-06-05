import React from 'react';
import NavBarItem from './navBarItem';

function DynamicMenu({ items, isMobile }) {
  return (
    <ul className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-12'}`}>
      {items.map((item) => (
        <NavBarItem item={item} key={item.label} isMobile={isMobile} />
      ))}
    </ul>
  );
}
export default DynamicMenu;
