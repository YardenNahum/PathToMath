import useSound from 'use-sound';
import WinLevelSound from '../../../../assets/sounds/winLevel.mp3';
import LoseSound from '../../../../assets/sounds/lose.mp3';
import WrongAnswerSound from '../../../../assets/sounds/wrongAnswer.mp3';
import OpponentStepSound from '../../../../assets/sounds/opponentStep.mp3';
import CorrectQuestionSound from '../../../../assets/sounds/correct-choice.mp3';

/**
 * Custom hook that provides game sound effects for various game events.
 * 
 * This hook centralizes all game-related sound effects, making them easily
 * accessible across different game components. It uses the 'use-sound' library
 * to handle audio playback with configurable options.
 * 
 * @returns {Object} An object containing sound effect functions:
 *   - winLevelSound: Plays when player successfully completes a level/game
 *   - loseSound: Plays when player loses the game
 *   - wrongAnswerSound: Plays when player provides an incorrect answer
 *   - opponentStepSound: Plays when opponent makes progress in multiplayer games
 * 
 * @example
 * const { winLevelSound, loseSound, wrongAnswerSound, opponentStepSound } = useGameSounds();
 * 
 * // Play sound when player wins
 * winLevelSound();
 * 
 * // Play sound when player gives wrong answer
 * wrongAnswerSound();
 */
export default function useGameSounds() {
  // Sound effects state with configuration options
  const [winLevelSound] = useSound(WinLevelSound, {interrupt: true, volume: 0.4}); // Interrupts other sounds when playing
  const [loseSound] = useSound(LoseSound, {volume: 0.3}); // No interrupt - allows overlapping with other sounds
  const [wrongAnswerSound] = useSound(WrongAnswerSound, {volume: 0.5}); // No interrupt, slightly lower volume
  const [opponentStepSound] = useSound(OpponentStepSound, {interrupt: true}); // Interrupts other sounds when playing
  const [correctQuestionSound] = useSound(CorrectQuestionSound, {volume: 0.4});

  return {
    winLevelSound,
    loseSound,
    wrongAnswerSound,
    opponentStepSound,
    correctQuestionSound,
  };
}