import React from "react";
import dice_1 from '../../../../assets/Images/cube_game/1.png';
import dice_2 from '../../../../assets/Images/cube_game/2.png';
import dice_3 from '../../../../assets/Images/cube_game/3.png';
import dice_4 from '../../../../assets/Images/cube_game/4.png';
import dice_5 from '../../../../assets/Images/cube_game/5.png';
import dice_6 from '../../../../assets/Images/cube_game/6.png';

/**
 * Cubes component renders a clickable dice image for the dice game.
 *
 * @param {Object} props - The component props
 * @param {number} props.value - The value of the dice (1-6)
 * @param {function} props.onClick - Click handler for the dice button
 * @param {string} [props.className] - Additional CSS classes for styling
 * @returns {JSX.Element} The rendered dice button
 */
const Cubes = ({ value, onClick, className }) => {
    // Mapping dice values to their corresponding images
    const dice_images = {
        1: { image: dice_1 },
        2: { image: dice_2 },
        3: { image: dice_3 },
        4: { image: dice_4 },
        5: { image: dice_5 },
        6: { image: dice_6 },
    };

    return (
        <div>
            {/* Render a button with the dice image. When clicked, calls onClick. */}
            <button onClick={onClick} className={`rounded-2xl bg-white ${className}`}>
                <img
                    src={dice_images[value].image}
                    alt={`Cube ${value}`}
                    className="w-20 h-20 hover:cursor-pointer" />
            </button>
        </div>
    );
}

export default Cubes;