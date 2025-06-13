import { useUser } from '../../Utils/UserContext';
import { updateUser } from '../../../services/UserService';

export const useUpdateQuiz = () => {
  const { user, update } = useUser();

  const updateQuiz = async () => {
    if (!user) {
      return;
    }

    const today = new Date();
    const quizLastDate = user.pop_quiz_last_date
      ? new Date(user.pop_quiz_last_date)
      : null;

    const normalizeLocalDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const todayLocal = normalizeLocalDate(today);
    const lastQuizLocal = quizLastDate ? normalizeLocalDate(quizLastDate) : null;


    // Check if already updated today
    if (lastQuizLocal && lastQuizLocal.getTime() === todayLocal.getTime()) {
      return;
    }

    // Check if it was yesterday
    const yesterdayLocal = new Date(todayLocal);
    yesterdayLocal.setDate(todayLocal.getDate() - 1);

    const isYesterday = lastQuizLocal && lastQuizLocal.getTime() === yesterdayLocal.getTime();

    const newUser = { ...user };
    if (!quizLastDate) {
      newUser.streak = 1;
    } else if (isYesterday) {
      newUser.streak = (user.streak || 0) + 1;
    } else {
      newUser.streak = 1;
    }

    newUser.pop_quiz_last_date = today;

    await updateUser(user.email, newUser);
    update(user.email, newUser);
  };

  return updateQuiz;
};
