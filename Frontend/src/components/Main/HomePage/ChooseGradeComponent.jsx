import React, { useState, useEffect, useRef } from 'react';
import { useGrade } from '../../Utils/GradeComponent';
import ButtonComponent from '../../Utils/Button';
import ProfileCard from './ProfileCard';
import BagIcon from '../../../assets/Images/HomePage/school-bag.png';
import { getOrdinalSuffix } from '../../Utils/ordinalGrade';
/**
 * ChooseGradeBtn component
 * @returns {JSX.Element} - The rendered component.
 */
function ChooseGradeBtn() {
    const { grade, setGrade } = useGrade();
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const popupRef = useRef(null);
    // toggle the visibility of the grade selection calculator
    const toggleCalculator = () => {
        setIsCalculatorOpen((prev) => !prev);
    };
    // Handle grade selection and close the calculator
    // This function updates the grade state and closes the calculator popup
    const handleGradeSelection = (selectedGrade) => {
        setGrade(selectedGrade);
        setIsCalculatorOpen(false);
    };

     useEffect(() => {
        // Detect outside of grade picker clicks
        function handleClickOutside(event) {
            // If the popup is open and click target is outside popupRef element
            if (isCalculatorOpen && popupRef.current && !popupRef.current.contains(event.target)) {
                setIsCalculatorOpen(false);
            }
        }

        // Add the event listener when popup is open
        if (isCalculatorOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener on unmount or when popup closes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCalculatorOpen]);

    return (
        <div className="relative flex flex-col items-center justify-center">
            {/* Main Grade Button (Using ProfileCard) */}
            <ProfileCard 
                label={grade ? `${getOrdinalSuffix(grade)} Grade` : 'Select Grade'}
                icon={BagIcon} 
                buttonLabel="Select Grade" 
                buttonColor="bg-yellow-500" 
                buttonTextColor="text-white"
                buttonAction={toggleCalculator}
            />

            {/* Calculator Tooltip */}
            {isCalculatorOpen && (
                <div ref={popupRef} className="absolute w-80 bg-yellow-200 rounded-2xl p-4 shadow-lg z-20 border-4 border-yellow-300">
                    <h3 className="text-sm font-bold mb-2 text-center">Select a Grade</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((g) => (
                            <ButtonComponent
                                key={g}
                                label={`${getOrdinalSuffix(g)} Grade`}
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
