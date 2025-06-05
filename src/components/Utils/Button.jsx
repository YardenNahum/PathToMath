import React from 'react';

function ButtonComponent({
    label,
    bgColor = 'bg-yellow-500',
    textColor = 'text-white',
    size = 'md',
    icon = null,
    onClick,
    disabled = false
}) {
    // Sizing Classes
    const sizeClasses = {
        sm: 'px-3 py-1 text-sm w-32',
        md: 'px-4 py-2 text-md w-40',
        lg: 'px-6 py-3 text-lg w-48',
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 rounded-xl ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${bgColor} ${textColor} ${sizeClasses[size]} focus:outline-none transition-all shadow-md hover:scale-105`}
            disabled={disabled}
        >
            {icon && <img src={icon} alt="icon" className="w-6 h-6" />}
            <span>{label}</span>
        </button>
    );
}

export default ButtonComponent;
