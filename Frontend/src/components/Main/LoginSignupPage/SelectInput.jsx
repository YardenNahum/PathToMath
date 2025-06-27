import React from 'react';
import { getOrdinalSuffix } from '../../Utils/OrdinalGrade';

/**
 * SelectInput is a reusable dropdown component with an icon and label.
 * It's styled with Tailwind CSS and used for selecting values like grade levels.
 *
 * @param {string} label - Placeholder text shown in the dropdown
 * @param {string} icon - Path to the icon image displayed on the left
 * @param {Array} options - Array of selectable values
 * @param {string|number} value - Currently selected value
 * @param {function} onChange - Handler for when the selected value changes
 */
const SelectInput = ({ label, icon, options, value, onChange }) => {

  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-white shadow-lg border border-transparent hover:border-gray-400 hover:shadow-xl duration-300 group mb-1">

      {/* Icon displayed to the left of the select dropdown */}
      <img src={icon} alt={`${label} icon`} className="w-6 h-6 group-hover:rotate-[360deg] duration-300" />
      
      {/* Dropdown menu for selecting from provided options */}
      <select
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800"
        required
      >
        {/* Default label option prompting user to select */}
        <option value="">{label}</option>
        
        {/* Map each option to a readable dropdown item */}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {getOrdinalSuffix(opt)} Grade
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
