import React, { useEffect } from "react";
import { useUser } from '../../Utils/UserContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateRandomGame } from "../Games/GamesUtils/GenerateRandomGame.jsx";

/**
 * PopQuiz component automatically redirects the user to a random game and level for their grade.
 * If the user is not signed in, prompts them to sign in or return home.
 *
 * @returns {JSX.Element} The rendered component or redirect logic
 */
const PopQuiz = () => {
    // React Router hook for navigation
    const navigate = useNavigate();
    // React Router hook to access the current location object
    const location = useLocation();
    // Get the current user from context
    const { user } = useUser();
    // Get the user's grade
    const grade = user?.grade;

    // List of possible subjects for the pop quiz
    const subjectsConfigs = [
        { name: "Addition" },
        { name: "Subtraction" },
        { name: "Multiplication" },
        { name: "Division" },
        { name: "Percentage" }
    ];

    // On mount or when grade/location changes, redirect to a random game for the user's grade
    useEffect(() => {
        if (!grade) return;

        // Only allow subjects up to the user's grade
        const subjects = grade === 1
            ? subjectsConfigs.slice(0, grade + 1)
            : subjectsConfigs.slice(0, grade);

        // Pick a random subject and level
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)].name;
        const randomLevel = Math.floor(Math.random() * 30) + 1;
        // Pick a random game for the subject
        const randomGameName = generateRandomGame(randomSubject);

        // Redirect to the random game, passing state to indicate it's from a quiz
        navigate(`/${randomGameName}/${randomSubject}/${grade}/${randomLevel}`, {
            state: { fromQuiz: true }
        });
    }, [grade, location]);

    // If user is not signed in, show prompt to sign in or return home
    if (!user) {
        return (
            <div className="font-sans playful-font flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-200 via-yellow-200 to-red-100 text-center px-4">
                <div className="bg-white shadow-xl rounded-3xl max-w-full h-min-full py-25 px-30 animate-bounce-slow">
                    <h1 className="text-5xl text-purple-600 mb-6">
                        🎉 Ready for a Pop Quiz?
                    </h1>
                    <p className="text-gray-700 text-2xl mb-6">
                        You need to <span className="text-blue-600">sign in</span> first to play and start your streak!
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-7 rounded-full shadow-md transition-all duration-300"
                    >
                        🚀 Sign In to Play!
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-300 mt-4 px-7 py-4 ml-4 text-gray-600  rounded-full shadow-md transition-all duration-300"
                    >
                         Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Show loading message while redirecting
    return (
        <div className="text-center mt-10 text-lg text-gray-600 animate-pulse">
            Loading your awesome Pop Quiz...
        </div>
    );
};

export default PopQuiz;
