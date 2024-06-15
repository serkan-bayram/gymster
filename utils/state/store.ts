import { configureStore } from "@reduxjs/toolkit";
import runningSlice from "./running/runningSlice";
import sessionSlice from "./session/sessionSlice";
import workoutSlice from "./workout/workoutSlice";
import gymDaysSlice from "./gymDays/gymDaysSlice";
import waterSlice from "./water/waterSlice";
import mealsSlice from "./meals/mealsSlice";

export const store = configureStore({
  reducer: {
    running: runningSlice,
    session: sessionSlice,
    workout: workoutSlice,
    gymDays: gymDaysSlice,
    water: waterSlice,
    meals: mealsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
