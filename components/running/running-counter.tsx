import { AppState, Text, View } from "react-native";
import { CounterType } from "./counter-type";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import {
  getDistanceBetweenTwoLocations,
  setLastDistanceChecked,
  setRunTime,
} from "@/utils/state/running/runningSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationState, Run, RunTime } from "@/utils/types/runs";

function getTimeDifference(timestamp1: string, timestamp2: string) {
  // Convert timestamps to Date objects
  const date1: any = new Date(timestamp1);
  const date2: any = new Date(timestamp2);

  // Calculate the difference in milliseconds
  const difference = date2 - date1;

  // Convert the difference to hours, minutes, and seconds
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  // Result in the desired format
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

export function RunningCounter() {
  const { isRunning, run, isFirstClicked, locations, lastDistanceChecked } =
    useSelector((state: RootState) => state.running);

  const dispatch = useDispatch<AppDispatch>();

  // Tracks time by time difference
  useTrackTimeInBackground(isFirstClicked, isRunning, dispatch);

  // Tracks time by incrementing the seconds
  useTrackTime(isRunning, run, dispatch);

  useGetDistance(locations, lastDistanceChecked);

  return (
    <View>
      <View className="flex flex-row">
        <CounterType count={run.runTime.hours} type="s" />
        <CounterType count={run.runTime.minutes} type="dk" />
        <CounterType count={run.runTime.seconds} type="sn" />
      </View>
      <View>
        <Text className="font-semibold text-xl">Süredir koşuyorsun!</Text>
      </View>
    </View>
  );
}

// Gets the distance when needed
const useGetDistance = (
  locations: LocationState[],
  lastDistanceChecked: string | null
) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (locations.length === 0) return;
    if (!lastDistanceChecked) return;

    const lastLocation = locations[locations.length - 1];
    const { timestamp } = lastLocation;

    // Convert timestamp to date object
    const lastLocationDate = new Date(timestamp);
    const lastDistanceCheckedDate = new Date(JSON.parse(lastDistanceChecked));

    const diff = lastLocationDate.getTime() - lastDistanceCheckedDate.getTime();

    // Convert milliseconds to minutes
    const diffInMinutes = diff / 60000; // 1 minute = 60000 milliseconds

    console.log("Diff: ", diffInMinutes);

    // Two minutes has passed since last distance checked
    if (diffInMinutes >= 1 && locations.length >= 2) {
      // Get distance between two last known locations
      console.log(locations);

      // Get two locations with correct timing
      // We are looking for at least 30 seconds between timestamps

      let correctLocation: undefined | LocationState;

      // Start from reverse
      locations
        .slice()
        .reverse()
        .forEach((location) => {
          // If we found the corectLocation
          if (correctLocation) return;

          const locationDate = new Date(location.timestamp);

          // If there is 60 seconds (1 minute) gap
          const diff =
            (lastLocationDate.getTime() - locationDate.getTime()) / 60000;

          if (diff >= 1) {
            correctLocation = location;
          }
        });

      if (correctLocation) {
        dispatch(
          getDistanceBetweenTwoLocations([correctLocation, lastLocation])
        );
        dispatch(setLastDistanceChecked());
      }
    }
  }, [locations]);
};

const useTrackTime = (isRunning: boolean, run: Run, dispatch: AppDispatch) => {
  useEffect(() => {
    let runTimeInterval: NodeJS.Timeout | undefined;

    if (isRunning) {
      // Count how much time have passed since running started
      runTimeInterval = setInterval(async () => {
        const newRunTime: RunTime = { ...run.runTime };

        if (newRunTime.seconds >= 59) {
          newRunTime.minutes += 1;
          newRunTime.seconds = 0;
        }

        if (newRunTime.minutes >= 59) {
          newRunTime.hours += 1;
          newRunTime.minutes = 0;
          newRunTime.seconds = 0;
        }

        newRunTime.seconds += 1;

        dispatch(setRunTime(newRunTime));
      }, 1000);
    }

    return () => {
      if (runTimeInterval) clearInterval(runTimeInterval);
    };
  }, [isRunning, run.runTime]);
};

const useTrackTimeInBackground = (
  isFirstClicked: boolean,
  isRunning: boolean,
  dispatch: AppDispatch
) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        // When app goes background we need to keep track of counter
        // This function runs whenever app comes to foreground from background
        // DOES NOT WORK IF APP TERMINATED
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          // We have not started the timer so we don't need to look for local storage
          if (isFirstClicked || !isRunning) return;

          const runningStartedAt = await AsyncStorage.getItem(
            "runningStartTime"
          );

          const now = new Date().toISOString();

          if (runningStartedAt) {
            const difference = getTimeDifference(
              runningStartedAt.toString(),
              now
            );

            // Set the new runTime
            dispatch(setRunTime(difference));
          }
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [isFirstClicked, isRunning]);
};
