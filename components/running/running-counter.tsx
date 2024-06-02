import { RunTime } from "@/app/(app)/running";
import { Text, View } from "react-native";
import { CounterType } from "./counter-type";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { setRunTime } from "@/utils/state/running/runningSlice";

export function RunningCounter() {
  const { isRunning, runTime } = useSelector(
    (state: RootState) => state.running
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let runTimeInterval: NodeJS.Timeout | undefined;

    if (isRunning) {
      // Count how much time have passed since running started
      runTimeInterval = setInterval(() => {
        const newRunTime: RunTime = { ...runTime };

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
  }, [isRunning, runTime]);

  return (
    <View>
      <View className="flex flex-row">
        <CounterType count={runTime.hours} type="s" />
        <CounterType count={runTime.minutes} type="dk" />
        <CounterType count={runTime.seconds} type="sn" />
      </View>
      <View>
        <Text className="font-semibold text-xl">Süredir koşuyorsun!</Text>
      </View>
    </View>
  );
}
