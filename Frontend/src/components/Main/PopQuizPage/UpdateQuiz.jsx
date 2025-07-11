import { useUser } from '../../Utils/UserContext';
import { updateUser } from '../../../services/UserService';

/**
 * Custom hook to update the user's pop quiz streak and last quiz date.
 * Handles streak logic based on whether the user played today, yesterday, or missed days.
 *
 * @returns {Function} updateQuiz - Function to update the user's quiz streak
 */
export const useUpdateQuiz = () => {
  // Get user and update function from context
  const { user, update } = useUser();

  /**
   * Updates the user's pop quiz streak and last quiz date.
   * - If the user already played today, does nothing.
   * - If the user played yesterday, increments streak.
   * - Otherwise, resets streak to 1.
   */
  const updateQuiz = async () => {
    if (!user) {
      return;
    }

    const today = new Date();
    const quizLastDate = user.pop_quiz_last_date
      ? new Date(user.pop_quiz_last_date)
      : null;

    /**
     * Normalize a date to remove time (i.e. set to local midnight)
     * @param {Date} date
     * @returns {Date} normalized date
     */
    const normalizeLocalDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const todayLocal = normalizeLocalDate(today);
    const lastQuizLocal = quizLastDate ? normalizeLocalDate(quizLastDate) : null;

    // Check if already updated today — no update needed
    if (lastQuizLocal && lastQuizLocal.getTime() === todayLocal.getTime()) {
      return;
    }

    // Check if it was yesterday
    const yesterdayLocal = new Date(todayLocal);
    yesterdayLocal.setDate(todayLocal.getDate() - 1);

    const isYesterday = lastQuizLocal && lastQuizLocal.getTime() === yesterdayLocal.getTime();

    // Prepare new user object with updated streak
    const newUser = { ...user };
    if (!quizLastDate) {
      newUser.streak = 1;
    } else if (isYesterday) {
      newUser.streak = (user.streak || 0) + 1;
    } else {
      newUser.streak = 1;
    }

    newUser.pop_quiz_last_date = today;

    // Update user in backend and context
    await updateUser(user.email, newUser);
    update(user.email, newUser);
  };

  return updateQuiz;
};
