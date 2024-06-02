import { configureStore } from "@reduxjs/toolkit";
import locationSlice from "./location/locationSlice";
import runningSlice from "./running/runningSlice";

export const store = configureStore({
  reducer: {
    location: locationSlice,
    running: runningSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
