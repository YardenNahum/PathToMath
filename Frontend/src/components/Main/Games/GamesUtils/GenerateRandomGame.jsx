/**
 * Generates a random game name based on the given subject.
 * Adds or removes specific games depending on the subject.
 *
 * @param {string} subjectGame - The subject for which to generate a game.
 * @returns {string} A randomly selected game name suitable for the subject.
 */
export const generateRandomGame = (subjectGame) => {
    const gameArray = [
        "OptionsGame",
        "RaceGame", 
        "WordGame",
        'RocketGame',
        'BalloonsGame' 
    ];
    if (subjectGame === "Addition") {
        gameArray.push("GameCube");  
    }
    //remove word game if the subject is percentage
    if (subjectGame === "Percentage") {
        const index = gameArray.indexOf("WordGame");
        if (index !== -1) {
            gameArray.splice(index, 1);
        }
    }

    // Select and return a random game from the adjusted array
    const randomIndex = Math.floor(Math.random() * gameArray.length);
    return gameArray[randomIndex];
};
