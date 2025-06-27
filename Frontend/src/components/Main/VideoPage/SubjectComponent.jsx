import React, { createContext, useContext, useState, useEffect } from "react";

// Create a React context to manage subject data globally
const SubjectContext = createContext();

// Custom hook to access subject context more easily
export const useSubject = () => useContext(SubjectContext);

// Context provider that wraps the app and manages subject-level state
export const SubjectProvider = ({ children }) => {
    // Default structure for each subject: current level and total levels
    const initialSubjects = {
        Addition: { currentLevel: 1, numOfLevels: 30 },
        Subtraction: { currentLevel: 1, numOfLevels: 30 },
        Multiplication: { currentLevel: 1, numOfLevels: 30 },
        Division: { currentLevel: 1, numOfLevels: 30 },
        Percentage: { currentLevel: 1, numOfLevels: 30 },
    };

    // Load subjects and gameSubject (current active subject) from localStorage if available
    const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || initialSubjects;
    const savedGameSubject = JSON.parse(localStorage.getItem("gameSubject")) || null;

    // State for all subjects' progress
    const [subjects, setSubjects] = useState(savedSubjects);

    // State for the currently selected subject and level in an active game
    const [gameSubject, setGameSubject] = useState(savedGameSubject);

    // Save subjects to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("subjects", JSON.stringify(subjects));
    }, [subjects]);

    // Save gameSubject to localStorage whenever it changes
    useEffect(() => {
        if (gameSubject) {
            localStorage.setItem("gameSubject", JSON.stringify(gameSubject));
        }
    }, [gameSubject]);

    /**
     * Select a subject to start playing
     * Sets the current gameSubject state with its current level and max levels
     */
    const selectSubject = (subjectName) => {
        const selectedSubject = subjects[subjectName];
        if (!selectedSubject) return;

        const newGameSubject = {
            subject: subjectName,
            level: selectedSubject.currentLevel,
            numOfLevels: selectedSubject.numOfLevels,
        };

        setGameSubject(newGameSubject);
        localStorage.setItem("gameSubject", JSON.stringify(newGameSubject));
    };

    /**
     * Update the current level for the active game subject
     * Only allows forward progress (no going back)
     */
    const updateLevel = (newLevel) => {
        const { level } = gameSubject;
        if (newLevel < level) return; // Prevent going back to a previous level

        const { subject } = gameSubject;

        // Update the specific subject's current level
        setSubjects((prevSubjects) => {
            const updatedSubjects = {
                ...prevSubjects,
                [subject]: {
                    ...prevSubjects[subject],
                    currentLevel: newLevel,
                },
            };

            // Save to localStorage
            localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
            return updatedSubjects;
        });

        // Update the gameSubject
        const updatedGameSubject = {
            ...gameSubject,
            level: newLevel,
        };

        setGameSubject(updatedGameSubject);
        localStorage.setItem("gameSubject", JSON.stringify(updatedGameSubject));
    };

    return (
        <SubjectContext.Provider
            value={{
                subjects,
                gameSubject,
                selectSubject,
                updateLevel,
            }}
        >
            {children}
        </SubjectContext.Provider>
    );
};
