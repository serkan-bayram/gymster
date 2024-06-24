import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as Location from "expo-location";
import { RootState } from "../store";
import { calculateDistance } from "@/utils/calculate-distance";
import { LocationState, Run, RunsDB } from "@/utils/types/runs";
import functions from "@react-native-firebase/functions";

export const LOCATION_TASK_NAME = "running-location-task";

// This slice is responsible for the running that currently happening

interface RunningState {
  locations: LocationState[];
  isRunning: boolean;
  run: Run;
  isLocationTracking: boolean;
  // Represents the runs that we are currently recording
  // every lap is a run
  runs: Run[];
  // All runs of user
  allRuns: RunsDB[];
  // Represents the first time user clicks start running button
  isFirstClicked: boolean;
  // Last date that we checked user's distance
}

const initialRun: Run = {
  averageSpeed: 0,
  distance: 0,
  runTime: { hours: 0, minutes: 0, seconds: 0 },
};

export const initialState: RunningState = {
  locations: [],
  isRunning: false,
  run: initialRun,
  isLocationTracking: false,
  allRuns: [],
  runs: [],
  isFirstClicked: true,
};

export const startRunning = createAsyncThunk(
  "running/startRunning",
  async () => {
    // Start location tracking
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 60000, // every minute
      distanceInterval: 1, // or 1 meter
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

export const getDistanceBetweenTwoLocations = createAsyncThunk(
  "running/getDistanceBetweenTwoLocations",
  async (locations: LocationState[]) => {
    const response = await functions().httpsCallable(
      "getDistanceBetweenTwoLocations"
    )({ locations: locations });

    if (response.data) {
      console.log(response.data);
      if (response.data.distance) {
        return response.data.distance;
      }
    }

    return null;
  }
);

// We move this selection function because it needs to be cached
export const selectRuns = (state: RootState) => state.running.runs;

const runningSlice = createSlice({
  name: "running",
  initialState,
  reducers: {
    setAllRuns: (state, action) => {
      state.allRuns = action.payload;
    },
    setLocations: (state, action) => {
      state.locations.push(action.payload);
    },
    resetRunningState: (state) => {
      state.locations = [];
      state.run = initialRun;
      state.isFirstClicked = true;
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

    // Calculate ran distance and averageSpeed of current run
    builder.addCase(
      getDistanceBetweenTwoLocations.fulfilled,
      (state, action) => {
        if (action.payload) {
          // Total distance that user has run (in meters)
          console.log("API Distance: ", action.payload);

          const distance = action.payload;

          // distance > 20
          // If distance is smaller than 20 meters, user problably not moving
          if (distance > 20) {
            state.run.distance += parseFloat(distance.toFixed(2));

            // console.log("Total Distance: ", state.run.distance);

            // This distance is basically the distance between locations that at least 1 minute apart
            // So, if distance < 30m user is problably not moving, we don't count it

            const { hours, minutes, seconds } = state.run.runTime;
            const runTimeInMinutes = parseFloat(
              (hours * 60 + minutes + seconds / 60).toFixed(2)
            );

            // Average speed (in minutes/km)
            const distanceInKM = state.run.distance / 1000;
            state.run.averageSpeed = distanceInKM / runTimeInMinutes;

            // console.log("RunInMinutes: ", runTimeInMinutes);
            // console.log("Average Speed:", state.run.averageSpeed);
          }
        }
      }
    );
  },
});

export const {
  setAllRuns,
  setRunTime,
  saveRun,
  discardRun,
  firstClickIsDone,
  setLocations,
  resetRunningState,
} = runningSlice.actions;

export default runningSlice.reducer;
