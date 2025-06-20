import React from 'react';
import ButtonComponent from '../../../Utils/Button';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ShadowedTitle from '../../../Utils/ShadowedTitle';
import { useLocation } from 'react-router-dom';
import HowToPlay from './HowToPlay';
/**
 * Game Container Component
 * @param {Object} props - The component props
 * @param {string} props.gameName - The name of the game
 * @param {string} props.gameSubject - The subject of the game
 * @param {string} props.gameLevel - The level of the game
 * @param {React.ReactNode} props.children - The children of the component
 * @returns {React.ReactNode} The rendered component
 */
function GameContainer({ gameName, gameSubject, gameLevel: propGameLevel, children, icon, backgroundImage, showReturnButton = true, howToPlay }) {
    const navigate = useNavigate();
    const location = useLocation();

    const { level } = useParams();

    // Use propGameLevel if passed; otherwise fallback to level param
    const gameLevel = propGameLevel !== undefined ? Number(propGameLevel) : Number(level);
    let popQuiz = false;

    if (location.state?.fromQuiz) {
        popQuiz = true;
    }
    /**
     * Handles the return button click event
     */
    const handleReturn = () => {
        if (location.state?.fromQuiz) {
            navigate("/"); // go to homepage
        } else {
            navigate(-1); // go back to previous page
        }
    };

    return (
        <div className="flex flex-col h-full font-sans playful-font antialiased flex-grow"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {popQuiz && (
                <div className='flex justify-center'>
                    <div className="mt-5 text-center text-3xl w-120 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                        <span className="inline-block px-6 py-2 rounded-lg ">
                            Random Pop Quiz! 🥇
                        </span>
                    </div>
                </div>
            )}
            {/* Game Header */}
            <div className="text-center mt-5">

                {/* Main game name with title icon */}
                <h1 className="text-6xl font-bold text-black flex justify-center items-center space-x-3 select-none">
                    <ShadowedTitle text={gameName} />
                    {icon && <img src={icon} alt="Game Icon" className="w-25 h-auto" />}
                </h1>

                {/* Subject and Level badges */}
                <div className="flex justify-center space-x-4">
                    <span className="bg-yellow-300 text-yellow-900 font-semibold px-4 py-1 rounded-full shadow-md select-none">
                        {gameSubject}
                    </span>
                    <span className="bg-green-300 text-green-900 font-semibold px-4 py-1 rounded-full shadow-md select-none">
                        {`level ${gameLevel}`}
                    </span>
                </div>
            </div>

{/* Game Container */}
<div className="text-center">
  <div className="flex-grow text-center text-black mt-6 mx-auto max-w-6xl w-full bg-transparent">
    <div className="rounded-lg p-4 relative max-w-3xl mx-auto mb-5">
      {howToPlay && (
        <HowToPlay howToPlay={howToPlay} />
      )}
      {children}
    </div>
  </div>
</div>


        {/* Dont show return button if its GameSelection popup */}
        {showReturnButton && (
            <div className=" flex justify-center mb-10">
                <ButtonComponent
                    label="Return"
                    onClick={handleReturn}
                    bgColor="bg-blue-400 hover:bg-blue-700"
                    textColor="text-white"
                    size="md"
                />
            </div>
        )}
        </div>
    );
}

export default GameContainer;