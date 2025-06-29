/**
 * Updates the user's progress after answering a question correctly.
 * - If it's a pop quiz, only quiz stats are updated.
 * - Otherwise, it updates the user's grade level progress in the subject.
 *
 * @param {Object} params - Function parameters
 * @param {boolean} params.isSuccess - Whether the user's answer was correct
 * @param {Object} params.location - React Router location object
 * @param {Object} params.user - The current user object
 * @param {Function} params.update - Function to update user in database
 * @param {Function} params.updateQuiz - Function to update quiz stats
 * @param {number} params.gameLevel - The level just completed
 * @param {string} params.gameSubject - The subject being played
 */
export default function updateUserProgress({ isSuccess, location, user, update, updateQuiz, gameLevel, gameSubject }) {
    if(!user) {
        return
    }
    // Exit early if the answer was incorrect
    if (!isSuccess&& user&& !location?.state?.fromQuiz) {
         const newUser = { ...user };
        newUser.gradeLevel[user.grade - 1][gameSubject].currentLevelTries += 1;
        // Update the user's record with the current level tries
        update(user.email, newUser);
        return;
    } 


    // If the game was launched from a pop quiz, update quiz stats only
    if (user && location?.state?.fromQuiz) {
        updateQuiz();
    } else {
        // Retrieve the user's current highest completed level for the subject
        const currentFinished = user?.gradeLevel[user.grade - 1]?.[gameSubject].level|| 0; // Default to 0 if not found

        // Only update progress if the new level is higher than previously completed
        if (gameLevel > currentFinished&&user) {
            const newUser = { ...user };
            newUser.gradeLevel[user.grade - 1][gameSubject].level = gameLevel;
            newUser.gradeLevel[user.grade - 1][gameSubject].totalTries += newUser.gradeLevel[user.grade - 1][gameSubject].currentLevelTries;
            newUser.gradeLevel[user.grade - 1][gameSubject].currentLevelTries = 1; // Reset current level tries
            // Update the user's record
            update(user.email, newUser);
        }
    }
}
