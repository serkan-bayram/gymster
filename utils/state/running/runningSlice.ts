import { RunTime } from "@/app/(app)/running";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as Location from "expo-location";
import { RootState } from "../store";

export const LOCATION_TASK_NAME = "running-location-task";

// This slice is responsible for the running that currently happening

export interface Run {
  averageSpeed: number;
  distance: number;
  runTime: RunTime;
}

interface RunningState {
  isRunning: boolean;
  run: Run;
  isLocationTracking: boolean;
  runs: Run[];
}

const initialState: RunningState = {
  isRunning: false,
  run: {
    averageSpeed: 0,
    distance: 0,
    runTime: { hours: 0, minutes: 0, seconds: 0 },
  },
  isLocationTracking: false,
  runs: [],
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

// We move this selection function because it needs to be cached
export const selectRuns = (state: RootState) => state.running.runs;

const runningSlice = createSlice({
  name: "running",
  initialState,
  reducers: {
    setRunTime: (state, action) => {
      state.run.runTime = action.payload;
    },
    saveRun: (state) => {
      const newRun: Run = {
        averageSpeed: state.run.averageSpeed,
        distance: state.run.distance,
        runTime: state.run.runTime,
      };

      state.runs = [...state.runs, newRun];
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

export const { setRunTime, saveRun } = runningSlice.actions;

export default runningSlice.reducer;
