import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../Utils/UserContext';
import ApiService from '../../../services/ApiService';
import SubjectsProgressDesctiption from './SubjectsProgressDesctiption';
/**
 * GetSuggestions component
 * Fetches and displays personalized learning advice based on the user's progress.
 * It uses the user's email and grade to generate advice from an AI service.
 * The advice is cached in localStorage to avoid unnecessary API calls.
 * @returns {JSX.Element|null} - The rendered component or null if loading.
 */
function GetSuggestions() {
    const { user } = useUser();
    const [advice, setAdvice] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (!user || !user.email || !user.grade) {
            setAdvice("Practice makes perfect — keep at it!");
            setIsLoading(false);
            return;
        }
        // If the user and grade haven't changed, skip fetching advice
        if (localStorage.getItem('advice')) {
            setIsLoading(false);
            setAdvice(localStorage.getItem('advice') || "Practice makes perfect — keep at it!");
            return;
        };

        // Fetch new advice from the AI service
        // This function generates personalized learning advice based on the user's progress
        // It uses the SubjectsProgressDesctiption function to create a prompt for the AI
        const fetchAdvice = async () => {
            setIsLoading(true);
            try {
                const prompt = SubjectsProgressDesctiption(user);
                const response = await ApiService.generateAdviceFromAI(prompt);
                const newAdvice = response?.advice || "Practice makes perfect — keep at it!";
                setAdvice(newAdvice);
                localStorage.setItem('advice', response.advice || "Practice makes perfect — keep at it!");
            } catch (error) {
                console.error("Error getting learning advice:", error);
                setAdvice("Practice makes perfect — keep at it!");
                localStorage.setItem('advice', "Practice makes perfect — keep at it!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdvice();
    }, [user]);
    // The useEffect hook runs when the component mounts or when the user changes
    if (isLoading || !advice) return null;

    return (
        <div className="absolute -top-25 left-30 bg-yellow-200 cursor-default rounded-xl p-4 shadow-lg border-4 border-yellow-400 text-yellow-700 font-bold text-lg animate-bounce">
            <p>{advice ? advice : "Practice Makes Perfect! Keep Learning"}</p>
            <div className="absolute -bottom-4 left-10 w-6 h-6 bg-yellow-200 border-4 border-yellow-400 rounded-bl-xl rotate-45"></div>
        </div>
    );
}

export default GetSuggestions;
