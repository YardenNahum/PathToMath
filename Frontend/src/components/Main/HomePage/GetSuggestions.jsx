import React, { useState, useEffect } from 'react';
import { useUser } from '../../Utils/UserContext';
import ApiService from '../../../services/ApiService';
import SubjectsProgressDesctiption from './SubjectsProgressDesctiption'; // <-- שימי לב לשם הקובץ

function GetSuggestions() {
    const { user } = useUser();
    const [advice, setAdvice] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetch advice
     * Fetches learning advice based on the user's grade and displays it.
     * This component uses the SubjectsProgressDesctiption function to generate a prompt for the AI service.
     * @returns {JSX.Element} - The rendered component with learning advice.
     */
    useEffect(() => {
        if (!user || !user.grade) {
            setAdvice("Practice makes perfect — keep at it!");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        // Function to fetch advice from the AI service
        const fetchAdvice = async () => {
            try {
                //get the prompt for AI based on user's subjects and progress
                const prompt = SubjectsProgressDesctiption(user);
                //get response from api
                const response = await ApiService.generateAdviceFromAI(prompt);
                setAdvice(response?.advice || "Practice makes perfect — keep at it!");
                setIsLoading(false);
            } catch (error) {
                console.error("Error getting learning advice:", error);
                setAdvice("Practice makes perfect — keep at it!");
                setIsLoading(false);
            }
        };

        fetchAdvice();
    }, [user]);

  if (!advice&&!isLoading) return null;

  return (
    <div className="absolute -top-25 left-30 bg-yellow-200 cursor-default rounded-xl p-4 shadow-lg border-4 border-yellow-400 text-yellow-700 font-bold text-lg animate-bounce">
      <p>{advice}</p>
      <div className="absolute -bottom-4 left-10 w-6 h-6 bg-yellow-200 border-4 border-yellow-400 rounded-bl-xl rotate-45"></div>
    </div>
  );
}

export default GetSuggestions;
