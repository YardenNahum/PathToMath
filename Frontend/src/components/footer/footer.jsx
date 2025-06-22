import React from 'react';
import RotatingSlogan from './RotatingSlogan';

/**
 * Footer component renders the site footer with a rotating slogan.
 * The footer has a styled orange background, white centered text,
 * a top border, shadow, and uses a playful font.
 * 
 * @returns {React.ReactNode} The rendered footer element
 */
function Footer() {
  return (
    <footer className="w-full bg-orange-300 border-t-4 border-orange-500 text-white text-center py-3 shadow-xl playful-font">
      {/* Displays a rotating slogan inside the footer */}
      <RotatingSlogan />
    </footer>
  );
}

export default Footer;
