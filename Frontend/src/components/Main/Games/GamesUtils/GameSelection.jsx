import React from 'react';
import ButtonComponent from '../../../Utils/Button';
import { useNavigate } from 'react-router-dom';
import GameContainer from './GameContainer';
import backgroundImage from '../../../../assets/Images/Background/GameSelectionBg.jpg'
import RaceBtnBg from '../../../../assets/Images/RaceGame/RaceBg.jpg'
import SpaceBtnBg from '../../../../assets/Images/SpaceGame/spaceBg.jpg'
import TalesBtnBg from '../../../../assets/Images/wordGame/StoriesBg.png'
import OptionsBtnBg from '../../../../assets/Images/Background/optionsBg.jpg'
import DiceBtnBg from '../../../../assets/Images/cube_game/cubesBg.jpg'
import BalloonsBtnBg from '../../../../assets/Images/BalloonGame/BalloonsBg.jpg'
import TitleIcon from '../../../../assets/Images/Games/GameSelectionIcon.png'

/**
 * GameSelection Component
 * Allows the user to select a math mini-game based on subject, level, and grade.
 *
 * @param {Object} props - Component props
 * @param {string} props.subjectGame - The selected math subject (e.g., Addition)
 * @param {string} props.level - The difficulty level
 * @param {string} props.grade - The user's grade
 * @param {Function} [props.onGameSelected] - Optional callback when a game is selected
 */
function GameSelection({ subjectGame, level, grade, onGameSelected }) {
    const navigate = useNavigate();

    // Base game options shown to all users
    const gameButtons = [
        { label: 'Race Track', path: 'RaceGame', background: RaceBtnBg, textColor: 'text-gray-200' },
        { label: 'Pirates Cove', path: 'OptionsGame', background: OptionsBtnBg, textColor: 'text-gray-900' },
        { label: 'Legends Realm', path: 'WordGame', background: TalesBtnBg, textColor: 'text-pink-900' },
        { label: 'Balloons Park', path: 'BalloonsGame', background: BalloonsBtnBg, textColor: 'text-purple-900' },
        { label: 'Outer Space', path: 'RocketGame', background: SpaceBtnBg, textColor: 'text-pink-100' },
    ];

    // Add the "Cubes Horizon" game only if subject is Addition
    if (subjectGame === 'Addition') {
        gameButtons.push({
            label: 'Cubes Horizon', path: 'GameCube',
            background: DiceBtnBg, textColor: 'text-blue-800'
        },);
    }

    /**
     * Handles game selection
     * - Calls the parent callback if provided
     * - Otherwise navigates to the selected game route
     */
    const handleSelectGame = (gamePath) => {
        if (onGameSelected) {
            onGameSelected(gamePath);
        } else {
            navigate(`/${gamePath}/${subjectGame}/${grade}/${level}`);
        }
    };

    return (
        <div className="w-full h-full flex justify-center items-center sm:p-4">
            <GameContainer
                gameName="Choose Your Math Path!"
                gameSubject={subjectGame}
                gameLevel={level}
                icon={TitleIcon}
                backgroundImage={backgroundImage}
                showReturnButton={false}
            >
                {/* Main selection panel */}
                <div className="bg-green-100 w-full h-full max-h-[45vh] flex flex-col justify-center items-center rounded-lg p-4 shadow-lg -mt-3 mb-5 max-w-2xl mx-auto">
                    <div className="text-center mt-4 sm:mt-6 px-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 drop-shadow-sm -mt-7 mb-3">
                            Explore the Worlds of Math
                        </h2>
                    </div>
                    {/* Grid of game selection buttons */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl mx-auto mb-2">
                        {gameButtons.map((game, index) => (
                            <div key={index} className="flex justify-center items-center -mb-2">
                                <ButtonComponent
                                    label={game.label}
                                    onClick={() => handleSelectGame(game.path)}
                                    bgColor={game.background}
                                    textColor={game.textColor}
                                    size="md"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </GameContainer>
        </div>
    );
}

export default GameSelection;
