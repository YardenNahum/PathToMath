import { createContext, useContext } from "react";

/**
 * React context for storing and accessing game override values.
 * This can be used to override default game settings like time, level, etc.
 */
export const GameOverrideContext = createContext({});

/**
 * Custom hook to access game override values from the GameOverrideContext.
 *
 * @returns {Object} - The current context value, which may contain override settings.
 */
export const useGameOverrides = () => useContext(GameOverrideContext);