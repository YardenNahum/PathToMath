import React from "react";
import dice_1 from '../../../../assets/Images/cube_game/1.png';
import dice_2 from '../../../../assets/Images/cube_game/2.png';
import dice_3 from '../../../../assets/Images/cube_game/3.png';
import dice_4 from '../../../../assets/Images/cube_game/4.png';
import dice_5 from '../../../../assets/Images/cube_game/5.png';
import dice_6 from '../../../../assets/Images/cube_game/6.png';

// Genarate cubes game grid
const Cubes = ({value,onClick,className}) => {
    const dice_images = {
        1: {image: dice_1},
        2: {image: dice_2},
        3: {image: dice_3},
        4: {image: dice_4},
        5: {image: dice_5},
        6: {image: dice_6},
    };    
    
    return (
        <div>
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