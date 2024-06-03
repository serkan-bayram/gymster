import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as Location from "expo-location";
import { RootState } from "../store";
import { calculateDistance } from "@/utils/calculate-distance";
import { LocationState, Run } from "@/utils/types";

export const LOCATION_TASK_NAME = "running-location-task";

// This slice is responsible for the running that currently happening

interface RunningState {
  locations: LocationState[];
  isRunning: boolean;
  run: Run;
  isLocationTracking: boolean;
  runs: Run[];
  // Represents the first time user clicks start running button
  isFirstClicked: boolean;
}

export const initialState: RunningState = {
  locations: [],
  isRunning: false,
  run: {
    averageSpeed: 0,
    distance: 0,
    runTime: { hours: 0, minutes: 0, seconds: 0 },
  },
  isLocationTracking: false,
  runs: [],
  isFirstClicked: true,
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
    // Sets the distance & average speed
    setStats: (state, action) => {
      state.locations.push(action.payload);

      // We calculate the distance and speed over these location datas
      let totalDistance = 0;
      let totalTime = 0;

      for (let i = 1; i < state.locations.length; i++) {
        const coord1 = state.locations[i - 1];
        const coord2 = state.locations[i];

        const distance = calculateDistance(coord1, coord2);

        const timeDiff =
          (state.locations[i].timestamp - state.locations[i - 1].timestamp) /
          1000; // convert milliseconds to seconds

        totalDistance += distance;
        totalTime += timeDiff;
      }

      console.log("Total Distance: ", totalDistance);
      console.log("Total Time: ", totalTime);

      const averageSpeed = totalDistance / (totalTime / 3600);

      // AverageSpeed is in km/dk
      state.run.averageSpeed = averageSpeed;
      // Distance is in meters
      state.run.distance = totalDistance * 1000;

      console.log(state.locations);
    },
    // Sets the counter
    setRunTime: (state, action) => {
      state.run.runTime = action.payload;
    },
    firstClickIsDone: (state) => {
      state.isFirstClicked = false;
    },
    // Saves the run, not to database.
    saveRun: (state) => {
      const newRun: Run = {
        averageSpeed: state.run.averageSpeed,
        distance: state.run.distance,
        runTime: state.run.runTime,
      };

      return { ...initialState, runs: [...state.runs, newRun] };
    },
    discardRun: () => initialState,
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

export const { setRunTime, saveRun, discardRun, firstClickIsDone, setStats } =
  runningSlice.actions;

export default runningSlice.reducer;
