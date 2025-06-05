import React from 'react';
import { useGrade } from '../Utils/GradeComponent';
import { Link } from 'react-router-dom';

// Topic's Grade Limit
const topicGrade = {
  "Addition": 1,
  "Subtraction": 1,
  "Multiplication": 3,
  "Division": 4,
  "Percentage": 5
};

function subMenu({ items }) {
  const { grade } = useGrade();

  return (
    <ul className='absolute left-0 top-full mt-1 bg-white border rounded shadow-lg hidden group-hover:block z-10 min-w-[10rem]'>
      {items.map((item) => (
        (topicGrade[item.label]<=grade)&&(
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
