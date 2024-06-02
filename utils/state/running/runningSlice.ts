import { RunTime } from "@/app/(app)/running";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as Location from "expo-location";

export const LOCATION_TASK_NAME = "running-location-task";

interface RunningState {
  isRunning: boolean;
  averageSpeed: number;
  distance: number;
  runTime: RunTime;
  isLocationTracking: boolean;
}

const initialState: RunningState = {
  isRunning: false,
  averageSpeed: 0,
  distance: 0,
  runTime: { hours: 0, minutes: 0, seconds: 0 },
  isLocationTracking: false,
};

export const startRunning = createAsyncThunk(
  "running/startRunning",
  async () => {
    // Start location tracking
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Koşu İstatistikleri Hesaplanıyor",
        notificationBody: "Koşmaya devam et!",
        notificationColor: "#000",
      },
    });

    return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
);

export const stopRunning = createAsyncThunk("running/stopRunning", async () => {
  // Stop location tracking & make sure it's already started
  if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }

  return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
});

const runningSlice = createSlice({
  name: "running",
  initialState,
  reducers: {
    setRunTime: (state, action) => {
      state.runTime = action.payload;
    },
  },
  // Async functions
  extraReducers: (builder) => {
    // Start & stop location trackings
    // Update isRunning
    builder.addCase(startRunning.fulfilled, (state, action) => {
      state.isLocationTracking = action.payload;
      state.isRunning = action.payload;
    });
    builder.addCase(stopRunning.fulfilled, (state, action) => {
      state.isLocationTracking = action.payload;
      state.isRunning = action.payload;
    });
  },
});

export const { setRunTime } = runningSlice.actions;

export default runningSlice.reducer;
