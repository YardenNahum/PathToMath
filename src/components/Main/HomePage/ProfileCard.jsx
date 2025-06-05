import React from 'react';
import ButtonComponent from '../../Utils/Button';

function ProfileCard({ label, icon, buttonLabel, buttonColor = "bg-blue-400", buttonTextColor = "text-white", buttonAction }) {
    return (
        <div className="playful-font flex flex-col gap-4 justify-center items-center w-full text-center p-6 bg-white rounded-3xl shadow-md border-4 border-blue-300 min-h-[180px] max-w-[280px]">
            
            {/* Icon */}
            {icon && (
                <img 
                    src={icon} 
                    alt={`${label} Icon`} 
                    className="w-16 h-16 mb-2"
                />
            )}

            {/* Label */}
            <h2 className="text-2xl">{label}</h2>

            {/* Button */}
            {buttonLabel && buttonAction && (
                <ButtonComponent 
                    label={buttonLabel} 
                    bgColor={buttonColor} 
                    textColor={buttonTextColor} 
                    size="md"
                    onClick={buttonAction} 
                />
            )}
        </div>
    );
}

export default ProfileCard;
