import { configureStore } from "@reduxjs/toolkit";
import runningSlice from "./running/runningSlice";

export const store = configureStore({
  reducer: {
    running: runningSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
