import { createContext, useContext } from "react";

export const GameOverrideContext = createContext({});

export const useGameOverrides = () => useContext(GameOverrideContext);