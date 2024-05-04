import { createContext, useContext, useState } from "react";

const WaterContext = createContext();

// Increase or decrase the progress by 200 ml
export const DEFAULT_UPDATE_VALUE = 200;
// Default goal is 2000 ml
export const DEFAULT_GOAL = 2000;

// TODO: Save goal and update values to local storage
export const WaterProvider = ({ children }) => {
  const [updateValue, setUpdateValue] = useState(DEFAULT_UPDATE_VALUE);
  const [goalValue, setGoalValue] = useState(DEFAULT_GOAL);

  return (
    <WaterContext.Provider
      value={{ updateValue, setUpdateValue, goalValue, setGoalValue }}
    >
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => useContext(WaterContext);
