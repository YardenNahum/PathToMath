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

    const randomIndex = Math.floor(Math.random() * gameArray.length);
    return gameArray[randomIndex];
};
