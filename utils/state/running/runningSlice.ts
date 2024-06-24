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
  lastDistanceChecked: string | null;
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
  allRuns: [],
  runs: [],
  isFirstClicked: true,
  lastDistanceChecked: null,
};

export const startRunning = createAsyncThunk(
  "running/startRunning",
  async () => {
    // Start location tracking
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 60000,
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

export const getDistanceBetweenTwoLocations = createAsyncThunk(
  "running/getDistanceBetweenTwoLocations",
  async (locations: LocationState[]) => {
    const response = await functions().httpsCallable(
      "getDistanceBetweenTwoLocations"
    )({ locations: locations });

    if (response.data) {
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
      // First check
      if (state.locations.length === 0) {
        state.lastDistanceChecked = JSON.stringify(new Date());
      }

      state.locations.push(action.payload);
    },
    setLastDistanceChecked: (state) => {
      state.lastDistanceChecked = JSON.stringify(new Date());
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
          // TODO: I'm not sure about meters part
          const distance = parseFloat(action.payload.split(" ")[0]);

          // This distance is basically the distance between locations that at least 1 minute apart
          // So, if distance < 30m user is problably not moving, we don't count it
          if (distance > 30) {
            console.log("Distance: ", distance);

            state.run.distance += distance;

            console.log("Total Distance: ", state.run.distance);

            const { hours, minutes, seconds } = state.run.runTime;
            const runTimeInMinutes = hours * 60 + minutes + seconds / 60;

            // Average speed (in minutes/km)
            state.run.averageSpeed =
              runTimeInMinutes / (state.run.distance / 1000);
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
  setLastDistanceChecked,
} = runningSlice.actions;

export default runningSlice.reducer;
