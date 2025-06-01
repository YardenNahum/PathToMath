import React from 'react';
/** Subject Map */
const subjectMap = {
    "Addition": {
        "mathAction": "+",
        "function": (a, b) => a + b
    },
    "Subtraction": {
        "mathAction": "-",
        "function": (a, b) => a - b
    },
    "Multiplication": {
        "mathAction": "X",
        "function": (a, b) => a * b
    },
    "Division": {
        "mathAction": "/",
        "function": (a, b) => Math.floor(a / b)
    },
    "Percentage": {
        "mathAction": "%"
    }
};

/** 
 * Generate Questions
 * @param {string} gameSubject - The subject of the game (Addition, Subtraction, Multiplication, Division, Percentage)
 * @param {number} gameLevel - The level of the game (1-6)
 * @param {number} numOfQuestions - The number of questions to generate (1-10)
 * @param {number} numOfOptions - The number of options to generate (0-4)
 * @returns {Array} - The generated questions (Array of objects with question, var1, var2, answer, options)
 */
const generateQuestions = (gameSubject, gameLevel, numOfQuestions = 1, numOfOptions = 4) => {
    let divisior_array = [10, 20, 25, 50];

    /** Convert gameLevel to number if it's a string */
    if (typeof gameLevel === 'string') gameLevel = Number(gameLevel);
    
    /** Generate Variable */
    const generateVariable = (gameLevel) => {
        let variable;
        let maxValue;
        let minValue;

        switch (gameSubject) {
            case "Addition":
            case "Subtraction":
                /**
                 * 1st grade: 1-10, 2nd grade: 11-50, 3rd grade: 51-100
                 * 4th grade: 101-500, 5th grade: 501-1000, 6th grade: 1001-1500
                 */
                if (gameLevel === 1) { maxValue = 10; minValue = 1; }
                if (gameLevel === 2) { maxValue = 50; minValue = 11; }
                if (gameLevel === 3) { maxValue = 100; minValue = 51; }
                if (gameLevel === 4) { maxValue = 500; minValue = 101; }
                if (gameLevel === 5) { maxValue = 1000; minValue = 501; }
                if (gameLevel === 6) { maxValue = 1500; minValue = 1001; }

                variable = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
                break;
            case "Multiplication":
                /** 1st grade: null, 2nd grade: null, 3rd grade: 4-10 
                 * 4th grade: 9-15, 5th grade: 10-25, 6th grade: 20-30
                 */

                if (gameLevel === 1 || gameLevel === 2) variable = null;
                if (gameLevel === 3) { maxValue = 15; minValue = 9; }
                if (gameLevel === 4) { maxValue = 25; minValue = 10; }
                if (gameLevel === 5) { maxValue = 30; minValue = 20; }
                if (gameLevel === 6) { maxValue = 40; minValue = 30; }

                variable = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
                break;
            case "Division":
                /** 1st grade: null, 2nd grade: null, 3rd grade: null, 4th grade: 1-10
                 *  5th grade: 10-50, 6th grade: 30-100 
                 */
                if (gameLevel === 1 || gameLevel === 2 || gameLevel === 3) variable = null;
                if (gameLevel === 4) { maxValue = 10; minValue = 1; }
                if (gameLevel === 5) { maxValue = 20; minValue = 10; }
                if (gameLevel === 6) { maxValue = 30; minValue = 15; }
                variable = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
                break;
            case "Percentage":
                /** 1st grade: null, 2nd grade: null, 3rd grade: null, 4th grade: null
                 *  5th grade: null, 6th grade: 1-10 
                 */
                variable = Math.floor(Math.random() * 10) + 1;
                break;
        }

        return {
            value: variable,
            textValue: numberToString(variable)
        };
    };

    /** Generate Option */
    const generateOption = (answer) => {
        let optionValue;
        switch (gameSubject) {
            case "Addition":
            case "Subtraction":
            case "Multiplication":
            case "Division":
                const offset = Math.max(2, (Math.floor(gameLevel / 10) + 1) * 2);
                const minBorder = answer - offset;
                const maxBorder = answer + offset;
                optionValue = Math.round(Math.random() * (maxBorder - minBorder) + minBorder);
                break;
            case "Percentage":
                optionValue = divisior_array[Math.floor(Math.random() * divisior_array.length)];
                break;
        }
        const optionText = numberToString(optionValue);
        return {
            value: optionValue,
            textValue: optionText,
            isCorrect: false
        };
    };

    const numberToString = (number) => number.toLocaleString();

    /** Make Question */
    const makeQuestion = () => {
        const mathAction = subjectMap[gameSubject].mathAction;
        const mathFunction = subjectMap[gameSubject].function;
        let var1;
        let var2;
        let answer;

        switch (gameSubject) {
            case "Addition":
            case "Subtraction":
            case "Multiplication":
                var1 = generateVariable(gameLevel);
                var2 = generateVariable(gameLevel);
                answer = mathFunction(var1.value, var2.value);
                break;
            case "Division":
                var1 = generateVariable(gameLevel);
                var1.value = var1.value == 1 ? 2 : var1.value;
                
                var2 = generateVariable(4);
                var1.value = var1.value * var2.value;
                var1.textValue = numberToString(var1.value);

                answer = mathFunction(var1.value, var2.value);
                break;
            case "Percentage":
                let divisior = divisior_array[Math.floor(Math.random() * divisior_array.length)];
                let offsetMultiplier = [2,4,6,8,10];
                let offset = offsetMultiplier[Math.floor(Math.random() * offsetMultiplier.length)];

                var1 = generateVariable(gameLevel);
                
                var2 = {
                    value: var1.value,
                    textValue: numberToString(var1.value)
                }

                var1.value = var1.value * divisior / 100 * offset;
                var1.textValue = numberToString(var1.value);

                answer = divisior * offset;
                break;
        }

        let options = [];
        let questionText;

        // Generate fake answers
        while (options.length < numOfOptions - 1) {
            const fakeAnswer = generateOption(answer);
            if (!options.some(option => option.value === fakeAnswer.value) && fakeAnswer.value !== answer) {
                options.push(fakeAnswer);
            }
        }

        // Insert the correct answer in a random position
        const answerObject = {
            value: answer,
            textValue: numberToString(answer),
            isCorrect: true
        };
        const insertIndex = Math.floor(Math.random() * options.length + 1);
        options.splice(insertIndex, 0, answerObject);

        // Generate the question text
        if (gameSubject === "Percentage") {
            questionText = `What is ${var1.textValue} / ${var2.textValue} Perctage?`;
        } else {
            questionText = `What's ${var1.textValue} ${mathAction} ${var2.textValue}?`;
        }

        return {
            question: questionText,
            var1,
            var2,
            answer: answerObject,
            options
        }
    }

    /** Validate Input */
    const validateInput = () => {
        /** Validate Subject */
        if (subjectMap[gameSubject] === undefined) {
            console.log("Invalid subject");
            return false;
        }


        /** Validate Level */
        if (gameLevel < 1 || gameLevel > 6) {
            console.log("Invalid level");
            return false;
        }

        /** Validate Number of Questions */
        if (numOfQuestions < 1 || numOfQuestions > 10) {
            console.log("Invalid number of questions");
            return false;
        }

        /** Validate Number of Options */
        if (numOfOptions < 0 || numOfOptions > 4) {
            console.log("Invalid number of options");
            return false;
        }

        /** Validate Constraints */
        if (gameSubject === "Multiplication" && gameLevel < 3) {
            console.log("Multiplication is allowed at level 3 and above");
            return false;
        }

        if (gameSubject === "Division" && gameLevel < 4) {
            console.log("Division is allowed at level 4 and above");
            return false;
        }

        if (gameSubject === "Percentage" && gameLevel != 6) {
            console.log("Percentage is only allowed at level 6");
            return false;
        }

        return true;
    }

    /** Generate Questions */
    if (!validateInput()) return [];

    const newQuestions = [];
    while (newQuestions.length < numOfQuestions) {
        // Generate a new question
        const question = makeQuestion();
        let isDuplicate = false;

        // Check if the question is a duplicate of any existing questions
        for (const existing of newQuestions) {
            const isSameOrder = question.var1 === existing.var1 && question.var2 === existing.var2;
            const isReversedOrder = question.var1 === existing.var2 && question.var2 === existing.var1;

            if ((gameSubject === "Addition" || gameSubject === "Multiplication") && (isSameOrder || isReversedOrder)) {
                isDuplicate = true;
                break;
            } else if (isSameOrder) {
                isDuplicate = true;
                break;
            }
        }

        // If the question is not a duplicate, add it to the list
        if (!isDuplicate) newQuestions.push(question);
    }

    return newQuestions;
};

export default generateQuestions;