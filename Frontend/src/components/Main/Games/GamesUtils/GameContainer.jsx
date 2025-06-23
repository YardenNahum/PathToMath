import React from 'react';
import ButtonComponent from '../../../Utils/Button';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ShadowedTitle from '../../../Utils/ShadowedTitle';
import { useLocation } from 'react-router-dom';
import HowToPlay from './HowToPlay';

/**
 * Game Container Component
 * Wraps any game in a styled container with a title, subject/level badges,
 * background, optional "How to Play" guide, and return button.
 *
 * @param {Object} props - The component props
 * @param {string} props.gameName - The name of the game
 * @param {string} props.gameSubject - The subject of the game
 * @param {string} props.gameLevel - The level of the game
 * @param {React.ReactNode} props.children - The actual game content
 * @param {string} props.icon - Optional icon to show beside the title
 * @param {string} props.backgroundImage - Background image for the container
 * @param {boolean} props.showReturnButton - Whether to show the return button
 * @param {string} props.howToPlay - Instructional text for how to play the game
 * @returns {React.ReactNode} The rendered component
 */
function GameContainer({ gameName, gameSubject, gameLevel: propGameLevel, children, icon, backgroundImage, showReturnButton = true, howToPlay }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { level } = useParams();

    // Determine the game level: use prop if available, else use URL param
    const gameLevel = propGameLevel !== undefined ? Number(propGameLevel) : Number(level);
    
    // Detect if user arrived here from a Pop Quiz
    let popQuiz = false;
    if (location.state?.fromQuiz) {
        popQuiz = true;
    }

    /**
     * Handles the return button click event.
     * Navigates back to homepage if from quiz, otherwise navigates back.
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
            {/* Show Pop Quiz title if applicable */}
            {popQuiz && (
                <div className='flex justify-center'>
                    <div className="mt-3 text-center text-xl sm:text-2xl md:text-3xl w-auto max-w-[90%] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                        <span className="inline-block px-3 sm:px-4 py-1 rounded-lg">
                            Random Pop Quiz! 🥇
                        </span>
                    </div>
                </div>
            )}

            {/* Game title, icon, subject & level */}
            <div className="text-center mt-5">
                <h1 className="text-6xl font-bold text-black flex justify-center items-center space-x-3 select-none">
                    <ShadowedTitle text={gameName} />
                    {icon && <img src={icon} alt="Game Icon" className="w-25 h-auto" />}
                </h1>

                <div className="flex justify-center space-x-4">
                    {/* Subject badge */}
                    <span className="bg-yellow-300 text-yellow-900 font-semibold px-4 py-1 rounded-full shadow-md select-none">
                        {gameSubject}
                    </span>
                    {/* Level badge */}
                    <span className="bg-green-300 text-green-900 font-semibold px-4 py-1 rounded-full shadow-md select-none">
                        {`level ${gameLevel}`}
                    </span>
                </div>
            </div>

            {/* Main game content area */}
            <div className="text-center">
                <div className="flex-grow text-center text-black mt-6 mx-auto max-w-6xl w-full bg-transparent">
                    <div className="rounded-lg p-4 relative max-w-3xl mx-auto mb-5">
                        {/* Optional how-to-play instructions */}
                        {howToPlay && (
                            <HowToPlay howToPlay={howToPlay} />
                        )}
                        {/* Actual game UI passed as children */}
                        {children}
                    </div>
                </div>
            </div>

            <div className=" flex justify-center mb-10">
                {!popQuiz && (
                <ButtonComponent
                    label="Return"
                    onClick={handleReturn}
                    bgColor="bg-blue-400 hover:bg-blue-700"
                    textColor="text-white"
                    size="md"
                />
                )}
            </div>
        </div>
    );
}

export default GameContainer;