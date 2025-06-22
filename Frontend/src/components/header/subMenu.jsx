import React from 'react';
import { useGrade } from '../Utils/GradeComponent';
import { Link } from 'react-router-dom';
import topicGrade from '../Utils/GradeSubjects';

/**
 * subMenu component renders a dropdown list of navigation items.
 * It filters items based on the user's current grade, only showing
 * items whose required grade is less than or equal to the user's grade.
 * 
 * @param {Object} props
 * @param {Array<{label: string, link: string}>} props.items - List of menu items with label and link
 * @returns {React.ReactNode} The rendered submenu list
 */
function subMenu({ items }) {
  const { grade } = useGrade(); // Get the current user's grade from context

  return (
    <ul className='absolute left-0 top-full mt-1 bg-white border rounded shadow-lg hidden group-hover:block z-10 min-w-[10rem]'>
      {items.map((item) => (
        // Only render item if user's grade meets or exceeds the required grade for the topic
        (topicGrade[item.label] <= grade) && (
          <li key={item.label}>
            <Link
              className='block px-4 py-2 text-sm hover:bg-sky-100 text-black'
              to={item.link}
            >
              {item.label}
            </Link>
          </li>
        )))}
    </ul>
  );
}

export default subMenu;
