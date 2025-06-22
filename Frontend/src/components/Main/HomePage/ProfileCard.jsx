import React from 'react';
import ButtonComponent from '../../Utils/Button';
/**
 * ProfileCard component   
 * Renders a card with a label, an icon, and an optional button.
 * @param {Object} props - The properties for the component.
 * @param {string} props.label - The label to display on the card.
 * @param {string} [props.icon] - The URL of the icon image to display.
 * @param {string} [props.buttonLabel] - The label for the button.
 * @param {string} [props.buttonColor] - The background color for the button (default is "bg-blue-400").
 * @param {string} [props.buttonTextColor] - The text color for the button
 * @returns {JSX.Element} - The rendered ProfileCard component.
 */
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
