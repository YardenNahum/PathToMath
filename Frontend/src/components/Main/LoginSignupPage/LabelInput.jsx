import React from 'react';

const LabeledInput = ({ label, type = "text", icon, value, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-white shadow-lg border border-transparent hover:border-gray-400 hover:shadow-xl duration-300 group mb-3">
      <img
        src={icon}
        alt={`${label} icon`}
        className="w-6 h-6 group-hover:rotate-[360deg] duration-300"
      />
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent outline-none text-sm text-gray-800"
        required
      />
    </div>
  );
};

export default LabeledInput;
