import React, { useState } from "react";
import SubjectCircle from "../HomePage/SubjectCircle";
import background from '../../../assets/Images/Background/HomeBg.png'
import additionIcon from '../../../assets/Images/Math_icon/addition_purple.png';
import subtractionIcon from '../../../assets/Images/Math_icon/minus.png';
import multiplicationIcon from '../../../assets/Images/Math_icon/multi.png';
import divisionIcon from '../../../assets/Images/Math_icon/division1.png';
import percentageIcon from '../../../assets/Images/Math_icon/percentage.png';
import { useGrade } from "../../Utils/GradeComponent";
import { Link, useNavigate } from 'react-router-dom';
import ShadowedTitle from "../../Utils/ShadowedTitle";

const VideoPage = () => {
    const navigate = useNavigate();
    const { grade } = useGrade(); 
    const [selectedTopic, setSelectedTopic] = useState(null);

    const subjects = [
        { name: "Addition", icon: additionIcon, signSymbol: "+", color: '#E0BBE4' },
        { name: "Subtraction", icon: subtractionIcon, signSymbol: "-", color: '#FFABAB' },
        { name: "Multiplication", icon: multiplicationIcon, signSymbol: "x", color: '#B5EAD7' },
        { name: "Division", icon: divisionIcon, signSymbol: "/", color: '#C7CEEA' },
        { name: "Percentage", icon: percentageIcon, signSymbol: "%", color: '#FFDAC1' }
    ];

    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
        navigate(`/videos/subject/${topic}`);
    };

    let buttons = grade === 1 ? subjects.slice(0, grade + 1) : subjects.slice(0, grade);
    const rows = Array.from({ length: Math.ceil(buttons.length / 3) });

    return (
        <div className="relative playful-font min-h-[100vh] w-full flex flex-col items-center justify-start pt-12 pb-24 px-4 overflow-hidden"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                zIndex: 0,
            }}
        >
            <ShadowedTitle text="Choose a Math Topic to Watch Video Tutorials!"/>
            <div className="flex flex-col items-center mt-5 gap-10 z-10">
                {rows.map((_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-10">
                        {buttons.slice(rowIndex * 3, rowIndex * 3 + 3).map((subject, index) => (
                            <div
                                key={index}
                                className="p-10 w-70 h-70 flex flex-col items-center justify-center transition-transform duration-200 hover:scale-105"
                            >
                                <Link to={`/videos/${subject.name}`}>
                                    <SubjectCircle
                                        imageSrc={subject.icon}
                                        title={subject.name}
                                        variant="circle"
                                        circleColor={subject.color}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPage;
