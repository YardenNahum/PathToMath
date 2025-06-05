import React, { createContext, useContext, useState, useEffect } from "react";

const SubjectContext = createContext();

export const useSubject = () => useContext(SubjectContext);

export const SubjectProvider = ({ children }) => {
    const initialSubjects = {
        Addition: { currentLevel: 1, numOfLevels: 30 },
        Subtraction: { currentLevel: 1, numOfLevels: 30 },
        Multiplication: { currentLevel: 1, numOfLevels: 30 },
        Division: { currentLevel: 1, numOfLevels: 30 },
        Percentage: { currentLevel: 1, numOfLevels: 30 },
    };

    // Load subjects and gameSubject from localStorage
    const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || initialSubjects;
    const savedGameSubject = JSON.parse(localStorage.getItem("gameSubject")) || null;

    // Initialize state
    const [subjects, setSubjects] = useState(savedSubjects);
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

    // Select a subject to start a game
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

    // Update the current level for the selected subject
    const updateLevel = (newLevel) => {
        const { level } = gameSubject;
        if (newLevel < level) return; // Prevent going back to a previous level

        const { subject } = gameSubject;

        // Update subjects
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
