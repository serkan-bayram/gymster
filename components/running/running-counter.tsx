import { RunTime } from "@/app/(app)/running";
import { AppState, Text, View } from "react-native";
import { CounterType } from "./counter-type";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { Run, setRunTime } from "@/utils/state/running/runningSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const { isRunning, run, isFirstClicked } = useSelector(
    (state: RootState) => state.running
  );

  const dispatch = useDispatch<AppDispatch>();

  // Tracks time by time difference
  useTrackTimeInBackground(isFirstClicked, isRunning, dispatch);

  // Tracks time by incrementing the seconds
  useTrackTime(isRunning, run, dispatch);

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
