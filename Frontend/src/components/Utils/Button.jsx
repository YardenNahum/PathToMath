import React from 'react';

function ButtonComponent({
    label,
    bgColor = 'bg-yellow-500',
    textColor = 'text-white',
    size = 'md',
    icon = null,
    onClick,
    disabled = false
}) 
    {
    const sizeClasses = {
        sm: 'px-3 text-sm w-32 h-10',
        md: 'px-4 text-lg w-60 h-14',
        lg: 'px-6 text-lg w-48 h-16',
        xl: 'px-8 text-xl w-65 h-20',
        '2xl': 'px-10 text-xl w-68 h-24',
    };

    const isImageBg = bgColor?.startsWith('http') || bgColor?.startsWith('/');

    const style = isImageBg
        ? {
              backgroundImage: `url(${bgColor})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
          }
        : {};

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 rounded-xl
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${!isImageBg ? `${bgColor}` : ''}
                ${textColor}
                ${sizeClasses[size]}
                focus:outline-none transition-all shadow-md hover:scale-105`}
            style={style}
            disabled={disabled}
        >
            {icon && <img src={icon} alt="icon" className="w-6 h-6" />}
            <span className="font-bold drop-shadow-md">{label}</span>
        </button>
    );
}

export default ButtonComponent;
