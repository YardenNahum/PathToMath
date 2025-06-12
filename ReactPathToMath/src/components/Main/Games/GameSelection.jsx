import React from 'react';
import ButtonComponent from '../../Utils/Button';
import { useNavigate, useParams } from 'react-router-dom';
import GameContainer from '../Games/GameContainer';
import backgroundImage from '../../../assets/Images/GameSelectionBg.jpg'
import RaceBtnBg from '../../../assets/Images/RaceGame/RaceBg.jpg'
import SpaceBtnBg from '../../../assets/Images/SpaceGame/spaceBg.jpg'
import TalesBtnBg from '../../../assets/Images/wordGame/StoriesBg.png'
import OptionsBtnBg from '../../../assets/Images/Background/optionsBg.jpg'
import DiceBtnBg from '../../../assets/Images/cube_game/cubesBg.jpg'
import BalloonsBtnBg from '../../../assets/Images/BalloonGame/BalloonsBg.jpg'
import TitleIcon from '../../../assets/Images/GameSelectionIcon.png'

function GameSelection({ subjectGame, level, grade, onGameSelected }) {
    const navigate = useNavigate();

    const gameButtons = [
        { label: 'Race Track', path: 'RaceGame', background: RaceBtnBg, textColor: 'text-gray-200' },
        { label: 'Pirates Cove', path: 'OptionsGame', background: OptionsBtnBg, textColor: 'text-gray-900' },
        { label: 'Legends Realm', path: 'WordGame', background: TalesBtnBg, textColor: 'text-pink-900' },
        { label: 'Balloons Park', path: 'BalloonsGame', background: BalloonsBtnBg, textColor: 'text-purple-900' },
        { label: 'Outer Space', path: 'RocketGame', background: SpaceBtnBg, textColor: 'text-pink-100' },
    ];
    
    if(subjectGame === 'Addition') {
        gameButtons.push({ label: 'Cubes Horizon', path: 'GameCube',
             background: DiceBtnBg, textColor: 'text-blue-800' },);
    }

    const handleSelectGame = (gamePath) => {
        if (onGameSelected) {
            onGameSelected(gamePath);
        } else {
            navigate(`/${gamePath}/${subjectGame}/${grade}/${level}`);
        }
    };

    return (
        <GameContainer
            gameName="Choose Your Math Path!"
            gameSubject={subjectGame}
            gameLevel={level}
            icon={TitleIcon}
            backgroundImage={backgroundImage}
        >
            <div className="bg-green-100 flex flex-col justify-center items-center rounded-lg p-4 shadow-lg mb-5 max-w-2xl mx-auto">
                <div className="text-center mt-6">
                    <h2 className="text-3xl font-bold text-gray-800 drop-shadow-sm">Explore the Worlds of Math</h2>
                </div>

                <div className="grid grid-cols-2 gap-6 justify-center items-center max-w-xl mx-auto mt-10 mb-10 gap-x-15 gap-y-8">
                    {gameButtons.map((game, index) => (
                    <ButtonComponent
                        key={index}
                        label={game.label}
                        onClick={() => handleSelectGame(game.path)}
                        bgColor={game.background}
                        textColor={game.textColor}
                        size="xl"
                    />
                    ))}
                </div>
            </div>

        </GameContainer>
    );
}

export default GameSelection;
