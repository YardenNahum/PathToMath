// UpdateUserProgress.jsx
//      * Handles the user's answer selection, checks correctness, and updates game state.

export default function updateUserProgress({ isSuccess, location, user, update, updateQuiz, gameLevel, gameSubject }) {
    if (!isSuccess) return;

    if (location?.state?.fromQuiz) {
        updateQuiz();
    } else {
        const currentFinished = user?.gradeLevel[user.grade - 1]?.[gameSubject];
        if (gameLevel > currentFinished) {
            const newUser = { ...user };
            newUser.gradeLevel[user.grade - 1][gameSubject] = gameLevel;
            update(user.email, newUser);
        }
    }
}
