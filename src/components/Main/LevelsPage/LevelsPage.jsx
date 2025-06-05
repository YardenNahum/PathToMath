import React from "react";
import background from '../../../assets/Images/nature2.png'
import { useParams } from 'react-router-dom';
import LevelCircle from "./LevelCircle.jsx";
import addition from '../../../assets/Images/Math_icon/addition_purple.png';
import subtraction from '../../../assets/Images/Math_icon/minus.png';
import multiplication from '../../../assets/Images/Math_icon/multi.png';
import division from '../../../assets/Images/Math_icon/division1.png';
import percentage from '../../../assets/Images/Math_icon/percentage.png';
import SubjectCircle from "../HomePage/SubjectCircle.jsx";
import { useGrade } from '../../Utils/GradeComponent';
import { useUser } from "../../Utils/UserContext";

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

const LevelsPage = () => {
    const { subjectGame } = useParams();
    const { grade } = useGrade();
    const { user } = useUser();

    if (!subjectGame) {
        return (
            <div className="text-center mt-8">
                <h1 className="text-2xl font-bold">No Subject Selected</h1>
                <p>Please select a subject to start the game.</p>
            </div>
        )
    }
    // Check if the subjectGame exists in the user's gradeLevel
    const playersLevel = user?.grade[grade - 1]?.[subjectGame] + 1 || 1;
    const numOfLevels = 30
    const levelPercentage = ((playersLevel - 1) / numOfLevels) * 100;

    return (
        <div className="relative playful-font min-h-[100vh] w-full flex flex-col items-center justify-start pt-7 px-4 overflow-hidden"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}>
            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-6 ">
                    <SubjectCircle
                        imageSrc={subjectsData[subjectGame]?.icon}
                        title={subjectGame}
                        variant="circle"
                        circleColor={subjectsData[subjectGame]?.color || "#D3D3D3"}
                        size={150}
                    />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 drop-shadow-sm">
                        Select a Level – Random Games Await!
                    </h1>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-screen-lg px-4 mb-6">
                <div className="w-full bg-gray-300 rounded-full h-4">
                    <div
                        className="bg-green-400 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${levelPercentage}%` }}
                    ></div>
                </div>
                <p className="text-center text-sm mt-2 text-gray-800 mb-4">
                    {Math.round(levelPercentage)}% Complete
                </p>
            </div>
            <LevelCircle currentLevel={playersLevel} numOfLevels={numOfLevels} grade={grade} />
        </div>
    )
}

export default LevelsPage;