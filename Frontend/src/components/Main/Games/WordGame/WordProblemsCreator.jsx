import React, { useEffect, useState } from 'react';
import { useGrade } from '../../../Utils/GradeComponent';
import { FallbackWordProblem, questions } from './FallBackQuestions';
import ApiService from '../../../../services/ApiService';

/**
 * WordProblemsCreator component generates a magical word problem 
 * based on math inputs using an AI API. Falls back to a local template if the API fails.
 *
 * @param {string} subject - The math operation
 * @param {number} var1 - The first operand in the equation
 * @param {number} var2 - The second operand in the equation
 * @param {number} answer - The expected answer (var1 op var2)
 */
const WordProblemsCreator = ({ subject, var1, var2, answer }) => {
  const { grade } = useGrade(); // Get current user grade from context
  const [wordProblem, setWordProblem] = useState(""); // Holds the generated word problem
  const [loading, setLoading] = useState(false);  // Indicates whether the question is being generated

  useEffect(() => {
    //flag to cancel the questiion generating if it was already set
    let cancelled = false;

    //generate question func
    const generate = async () => {
      if (!subject || var1 == null || var2 == null || answer == null) return;

      //set loading and current question
      setLoading(true);
      setWordProblem("");

      //prompt for gemini
      const prompt = `Here are two example word problems:
        Positive answer example: "${questions[subject.toLowerCase()]?.positive}"        
        Now, write a new short, fun, and clear math word problem for a child in grade ${grade}.
        the equestion needs to be ${var1} ${subject} ${var2} = ${answer} so make the story fit to the equestion.
        The problem should feel like it takes place in a magical fairy tale world — include things like enchanted forests, potions, dragons, elves, castles, witches, or magical creatures.
        Keep the fairy tale terms simple and easy to understand.
        Make different and original names for the characters in the story for the math problem.
        It should still be about ${subject}, using the numbers ${var1} and ${var2}.
        Make sure the correct answer is ${Math.abs(answer)}.
        Do NOT include the answer — just the question sentence.
        Match the tone and structure of the examples above, but use original content, magical settings, and whimsical names.`;

      try {
        //using apiService to generate the Question from the prompt
        const result = await ApiService.generateQuestionsAI(prompt);
        //if question wasnt already generated set it
        if (!cancelled) {
          //if generating was successful put it other wise put error
          setWordProblem(result?.question || "error");
        }
        //if an error was thrown put error
      } catch (error) {
        console.error("Gemini Error:", error);
        if (!cancelled) {
          setWordProblem("error");
        }
      }
      //if not already generated set loading to false
      if (!cancelled) {
        setLoading(false);
      }
    };

    //generate question
    generate();

    //put true in cancelled if done generating
    return () => {
      cancelled = true;
    };
  }, [subject, var1, var2, answer, grade]);


  return (
    <div className="w-full mt-6">
      <div className="relative overflow-hidden m-full">
        <div className="p-6">
          
          {/* Loading AI question */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
                <span className="text-gray-600 font-medium">Generating a Problem...</span>
              </div>
            </div>
          ) : (
            // Displaying the generated word problem or fallback
            <div className="space-y-4  w-full">
              <div className="  w-full rounded-xl ">
                <div className="w-full text-gray-700 text-lg lg:text-xl leading-relaxed font-medium">
                  {wordProblem != "error" ? wordProblem : <FallbackWordProblem subject={subject.toLowerCase()} var1={var1} var2={var2} answer={answer} />}
                </div>
              </div>

              {/* Tag showing the numbers used */}
              {subject && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {var1 !== null && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🔢 Use these in your solution: {var1} & {var2}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordProblemsCreator;
