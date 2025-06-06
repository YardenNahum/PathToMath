import React from 'react';
import ButtonComponent from '../../Utils/Button';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import BackgroundImg from '../../../assets/Images/nature2.png'

/**
 * Game Container Component
 * @param {Object} props - The component props
 * @param {string} props.gameName - The name of the game
 * @param {string} props.gameSubject - The subject of the game
 * @param {string} props.gameLevel - The level of the game
 * @param {React.ReactNode} props.children - The children of the component
 * @returns {React.ReactNode} The rendered component
 */
function GameContainer({ gameName, gameSubject, children, icon }) {
    const navigate = useNavigate();
    const { level } = useParams();
    const gameLevel = Number(level);
    
    /**
     * Handles the return button click event
     */
    const handleReturn = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col h-full font-sans playful-font antialiased"
            style={{
                backgroundImage: `url(${BackgroundImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Game Header */}
            <div className="text-center p-10">
                {/* Main game name with race flag */}
                <h1 className="text-6xl font-bold text-black flex justify-center items-center space-x-3 select-none">
                    <span>{gameName}</span>
                    {icon && <img src={icon} alt="Game Icon" className="w-30 h-auto" />}
                </h1>

                {/* Subject and Level badges */}
                <div className="flex justify-center mt-2 space-x-4">
                    <span className="bg-yellow-300 text-yellow-900 font-semibold px-4 py-1 rounded-full shadow-md select-none">
                        {gameSubject}
                    </span>
                    <span className="bg-green-300 text-green-900 font-semibold px-4 py-1 rounded-full shadow-md select-none">
                        {`Grade ${gameLevel}`}
                    </span>
                </div>
            </div>

            {/* Game Container */}
            <div className="text-center mb-20">
                <div className="flex-grow text-center text-black p-6 mx-auto max-w-6xl w-full bg-transparent">
                    {children}
                </div>
            </div>

            <div className="px-6 mb-10">
                <ButtonComponent
                    label="Return"
                    onClick={handleReturn}
                    bgColor="bg-blue-400 hover:bg-blue-700"
                    textColor="text-white"
                    size="md"
                />
            </div>
        </div>
    );
}

export default GameContainer;
