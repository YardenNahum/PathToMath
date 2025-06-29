import topicGrade from '../../Utils/GradeSubjects';

/**
 * Builds a string description of the user's math progress for relevant subjects.
 * This can be used as a prompt for an AI to generate learning advice.
 */
function SubjectsProgressDescription(user) {
  if (!user || !user.grade || !user.gradeLevel) return '';

  const gradeIndex = user.grade - 1;

  // Filter relevant subjects based on the user's grade
  const subjects = Object.keys(topicGrade).filter(subject => topicGrade[subject] <= user.grade);

  // Build progress lines for each subject
  const subjectDescriptions = subjects.map(subject => {
    const subjectData = user.gradeLevel[gradeIndex]?.[subject];
    if (!subjectData) return `- ${subject}: no data`;
    return `- ${subject}: level ${subjectData.level}, total tries ${subjectData.totalTries}, current level tries ${subjectData.currentLevelTries} `;
  });

  // Final prompt string
  const description = `A student in grade ${user.grade} has the following progress in math subjects:\n` +
    subjectDescriptions.join('\n') +
    `\n\nBased on this progress, give a short and friendly learning advice for the student.
    the advie should be 1-2 sentences long, and should be related to the subjects they are currently studying.
    it could also include a suggestion for a specific subject to focus on next or advice to watch a help video on a specific topic.`;

  return description;
}

export default SubjectsProgressDescription;
