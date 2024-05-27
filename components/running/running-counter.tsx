import { RunTime } from "@/app/(app)/running";
import { Text, View } from "react-native";
import { CounterType } from "./counter-type";
import { useEffect, useState } from "react";

export function RunningCounter({ isRunning }: { isRunning: boolean }) {
  // How long did user ran
  const [runTime, setRunTime] = useState<RunTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let runTimeInterval: NodeJS.Timeout | undefined;

    if (isRunning) {
      // Count how much time have passed since running started
      runTimeInterval = setInterval(() => {
        setRunTime((prevValue) => {
          const newRunTime: RunTime = { ...prevValue };

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

          return newRunTime;
        });
      }, 1000);
    }

    return () => {
      if (runTimeInterval) clearInterval(runTimeInterval);
    };
  }, [isRunning]);

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
