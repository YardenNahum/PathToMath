import React from 'react';

const SelectInput = ({ label, icon, options, value, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-white shadow-lg border border-transparent hover:border-gray-400 hover:shadow-xl duration-300 group mb-1">
      <img src={icon} alt={`${label} icon`} className="w-6 h-6 group-hover:rotate-[360deg] duration-300" />
      <select
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800"
        required
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            Grade {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
