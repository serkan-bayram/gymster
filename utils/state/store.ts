import { configureStore } from "@reduxjs/toolkit";
import runningSlice from "./running/runningSlice";
import sessionSlice from "./session/sessionSlice";

export const store = configureStore({
  reducer: {
    running: runningSlice,
    session: sessionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
