import React, { useState } from 'react';
import { useGrade } from '../../Utils/GradeComponent';
import ButtonComponent from '../../Utils/Button';
import ProfileCard from './ProfileCard';
import BagIcon from '../../../assets/Images/HomePage/school-bag.png';

function ChooseGradeBtn() {
    const { grade, setGrade } = useGrade();
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

    const toggleCalculator = () => {
        setIsCalculatorOpen((prev) => !prev);
    };

    const handleGradeSelection = (selectedGrade) => {
        setGrade(selectedGrade);
        setIsCalculatorOpen(false);
    };

    return (
        <div className="relative flex flex-col items-center justify-center">
            {/* Main Grade Button (Using ProfileCard) */}
            <ProfileCard 
                label={grade ? `Grade ${grade}` : 'Select Grade'} 
                icon={BagIcon} 
                buttonLabel="Select Grade" 
                buttonColor="bg-yellow-500" 
                buttonTextColor="text-white"
                buttonAction={toggleCalculator}
            />

            {/* Calculator Tooltip */}
            {isCalculatorOpen && (
                <div className="absolute w-80 bg-yellow-200 rounded-2xl p-4 shadow-lg z-20 border-4 border-yellow-300">
                    <h3 className="text-sm font-bold mb-2 text-center">Select a Grade</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((g) => (
                            <ButtonComponent
                                key={g}
                                label={`Grade ${g}`}
                                bgColor={g === grade ? 'bg-blue-500' : 'bg-white hover:bg-yellow-300'}
                                textColor={g === grade ? 'text-white' : 'text-black'}
                                size="sm"
                                onClick={() => handleGradeSelection(g)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChooseGradeBtn;
