import React from 'react';
import RotatingSlogan from './RotatingSlogan';

function Footer() {
  return (
    <footer className="w-full bg-orange-300 border-t-4 border-orange-500 text-white text-center py-3 shadow-xl playful-font">
      <RotatingSlogan />
    </footer>
  );
}

export default Footer;
