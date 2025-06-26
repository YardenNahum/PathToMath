import React from 'react';
import { getOrdinalSuffix } from '../../Utils/OrdinalGrade';

const SelectInput = ({ label, icon, options, value, onChange }) => {

  return (
      // Container with styling and hover effects
   <div className="flex items-center gap-3 p-3 rounded-md bg-white shadow-lg border border-transparent hover:border-gray-400 hover:shadow-xl duration-300 group mb-1">
     {/* Icon displayed to the left of the select dropdown */}
      <img src={icon} alt={`${label} icon`} className="w-6 h-6 group-hover:rotate-[360deg] duration-300" />
        {/* Dropdown menu */}
      <select
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800"
        required
      >
        {/* Default label option */}
        <option value="">{label}</option>
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
