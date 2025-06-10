import React, { useEffect, useState } from "react";
import background from '../../../assets/Images/nature2.png'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LevelCircle from "./LevelCircle.jsx";
import addition from '../../../assets/Images/Math_icon/addition_purple.png';
import subtraction from '../../../assets/Images/Math_icon/minus.png';
import multiplication from '../../../assets/Images/Math_icon/multi.png';
import division from '../../../assets/Images/Math_icon/division1.png';
import percentage from '../../../assets/Images/Math_icon/percentage.png';
import SubjectCircle from "../HomePage/SubjectCircle.jsx";
import { useGrade } from '../../Utils/GradeComponent';
import { useUser } from "../../Utils/UserContext";
import ShadowedTitle from "../../Utils/ShadowedTitle.jsx";
import ButtonComponent from '../../Utils/Button.jsx'
import GameSelection from '../Games/GameSelection.jsx'

// Subject icons and colors used in the SubjectCircle
const subjectsData = {
    Addition: {
        icon: addition,
        color: '#E0BBE4',
    },
    Subtraction: {
        icon: subtraction,
        color: '#FFABAB',
    },
    Multiplication: {
        icon: multiplication,
        color: '#B5EAD7',
    },
    Division: {
        icon: division,
        color: '#C7CEEA',
    },
    Percentage: {
        icon: percentage,
        color: '#FFDAC1',
    },
};

/**
 * LevelsPage Component
 * 
 * Displays a subject-themed levels page with:
 * - Progress bar showing user level progress
 * - Clickable level circles to choose a level
 * - Game selection popup when level is clicked
 * - Guest popup if user isn't logged in and came from a game
 */
const LevelsPage = () => {
    const { subjectGame } = useParams();    // Gets the subject from the route
    const { grade } = useGrade();   // Gets the current selected grade from context
    const { user } = useUser(); // Gets user data from context
    const navigate = useNavigate();
    const location = useLocation();

    const [popup, setPopup] = useState(false);  // Controls visibility of guest popup
    const [selectedLevel, setSelectedLevel] = useState(null);  // state for when a level circle has been clicked, for GameSelection popup
    const [showGameSelection, setShowGameSelection] = useState(false); // show/hide game selection popup

    useEffect(() => {
        // Show guest popup if user is not logged in AND they came from a game
        setPopup(!user && location.state?.fromGame);
    }, [user, location.state]);

    if (!subjectGame) {
        // If no subject is selected in the URL
        return (
            <div className="text-center mt-8">
                <h1 className="text-2xl font-bold">No Subject Selected</h1>
                <p>Please select a subject to start the game.</p>
            </div>
        )
    }

    // Get the current level of the user for the selected subject and grade
    const playersLevel = user?.gradeLevel[grade - 1]?.[subjectGame] + 1 || 1;
    const numOfLevels = 30
    const levelPercentage = ((playersLevel - 1) / numOfLevels) * 100;

    // Handle clicking outside or close button on popup
    const handlePopupClick = (outsideClick) => {
        if (outsideClick) setPopup(false);
    }

    // Guest popup prompting sign-up
    const PopUp = () => (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray/10 backdrop-blur-sm"
            onClick={() => handlePopupClick(true)}
        >
            <div
                className="bg-white p-5 rounded-xl shadow-lg text-center"
                onClick={(e) => { e.stopPropagation(); handlePopupClick(false); }}
            >
                <div className="flex justify-end w-full">
                    <button
                        className="bg-red-500 text-white rounded px-2 hover:bg-red-400 transition-all duration-300"
                        onClick={() => handlePopupClick(true)}
                    >
                        X
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center p-4">
                    <h2 className="text-xl font-bold mb-4">For more levels, please sign up to account!</h2>
                    <div className="flex justify-center gap-4">
                        <ButtonComponent
                            label="Sign up"
                            bgColor="bg-orange-500"
                            onClick={() => navigate('/signup')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div
            className="relative playful-font min-h-[100vh] w-full flex flex-col items-center justify-start pt-7 px-4 overflow-hidden"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            {/* Subject info and title */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-6">
                    <SubjectCircle
                        imageSrc={subjectsData[subjectGame]?.icon}
                        title={subjectGame}
                        variant="circle"
                        circleColor={subjectsData[subjectGame]?.color || "#D3D3D3"}
                        size={150}
                        clickable={false}
                    />
                    <ShadowedTitle
                        text="In Each Level a Random Game Awaits You!"
                        shadowColor={subjectsData[subjectGame]?.color}
                    />
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-screen-lg px-4 mb-6">
                <div className="w-full bg-gray-300 rounded-full h-4">
                    <div
                        className="bg-green-400 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${levelPercentage}%` }}
                    />
                </div>
                <p className="text-center text-sm mt-2 text-gray-800 mb-4">
                    {Math.round(levelPercentage)}% Complete
                </p>
            </div>

            {/* Level circles */}
            <LevelCircle
                currentLevel={playersLevel}
                numOfLevels={numOfLevels}
                onLevelClick={(level) => {
                    setSelectedLevel(level);
                    setShowGameSelection(true);
                }}
            />

            {/* Guest popup */}
            {popup && <PopUp />}

            {/* Game selection modal */}
            {showGameSelection && selectedLevel !== null && (
                <div
                    className="fixed inset-0 flex justify-center items-center z-50 "
                    style={{ backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowGameSelection(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg relative mt-22"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-red-700 font-extrabold text-3xl cursor-pointer bg-red-100 rounded-full w-10 h-10 flex items-center justify-center shadow-md
                             hover:bg-red-700 hover:text-white transition-colors duration-300"
                            onClick={() => setShowGameSelection(false)}
                        >
                            ✕
                        </button>

                        <GameSelection
                            subjectGame={subjectGame}
                            level={selectedLevel}
                            grade={grade}
                            onGameSelected={(gamePath) => {
                                navigate(`/${gamePath}/${subjectGame}/${grade}/${selectedLevel}`);
                                setShowGameSelection(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LevelsPage;