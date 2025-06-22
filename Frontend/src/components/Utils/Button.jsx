import React from 'react';

/**
 * ButtonComponent is a customizable button that supports different sizes,
 * background colors (including image backgrounds), text color, icons, and disabled state.
 * 
 * @param {Object} props
 * @param {string} props.label - The text displayed inside the button
 * @param {string} [props.bgColor] - Tailwind background class or image URL
 * @param {string} [props.textColor] - Tailwind text color class
 * @param {string} [props.size] - Size key ('sm', 'md', 'lg', 'xl', '2xl')
 * @param {string} [props.icon] - Optional image URL for an icon on the button
 * @param {function} props.onClick - Function to be called on click
 * @param {boolean} [props.disabled] - If true, disables the button
 */
function ButtonComponent({
    label,
    bgColor = 'bg-yellow-500',
    textColor = 'text-white',
    size = 'md',
    icon = null,
    onClick,
    disabled = false
}) {
    const sizeClasses = {
        sm: 'px-3 text-sm w-32 h-10',
        md: 'px-4 text-lg w-60 h-14',
        lg: 'px-6 text-lg w-48 h-16',
        xl: 'px-8 text-xl w-65 h-20',
        '2xl': 'px-10 text-xl w-68 h-24',
    };

    // Check if bgColor is an image path (used for background image styling)
    const isImageBg = bgColor?.startsWith('http') || bgColor?.startsWith('/');

    // If background is an image, define inline styles for it
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
            {/* Optional icon rendered to the left of the label */}
            {icon && <img src={icon} alt="icon" className="w-6 h-6" />}
            {/* Button text */}
            <span className="font-bold drop-shadow-md">{label}</span>
        </button>
    );
}

export default ButtonComponent;
