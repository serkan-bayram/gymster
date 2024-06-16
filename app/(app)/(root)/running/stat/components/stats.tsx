import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import { useEffect, useState } from "react";
import { Data } from "..";
import { Distance } from "./distance";
import { View } from "react-native";
import { AverageSpeed } from "./average-speed";
import { RunTime } from "./run-time";

interface Stats {
  distances: Data[];
  averageSpeeds: Data[];
  runTimes: Data[];
}

function useStats() {
  const runs = useSelector((state: RootState) => state.running.allRuns);

  const [stats, setStats] = useState<Stats>({
    distances: [],
    averageSpeeds: [],
    runTimes: [],
  });

  useEffect(() => {
    const distancesArray: Data[] = [];
    const averageSpeedsArray: Data[] = [];
    const runTimesArray: Data[] = [];

    runs.forEach((run) => {
      const date = run.dateAsText || "";

      // run.runs -> every "run" is made of multiple runs
      // because user can run more than 1 in one day but they are all
      // categorized under 1 day
      const distance = run.runs.reduce(
        (total, dist) => total + dist.distance,
        0
      );

      const sumAverageSpeed = run.runs.reduce(
        (total, avgSpeed) => total + avgSpeed.averageSpeed,
        0
      );
      const averageSpeed = sumAverageSpeed / run.runs.length;

      // in minutes
      const sumRunTime = run.runs.reduce(
        (total, runTime) =>
          total +
          runTime.runTime.hours * 60 +
          runTime.runTime.minutes +
          runTime.runTime.seconds / 60 / 60,
        0
      );

      distancesArray.push({ label: date, value: distance });
      averageSpeedsArray.push({ label: date, value: averageSpeed });
      runTimesArray.push({ label: date, value: sumRunTime });
    });

    setStats({
      distances: distancesArray,
      averageSpeeds: averageSpeedsArray,
      runTimes: runTimesArray,
    });
  }, []);

  return { stats: stats };
}

export function Stats({ currentMonth }: { currentMonth: string }) {
  const { stats } = useStats();

  return (
    <>
      <View className="mt-12 mb-4">
        <Distance stats={stats.distances} currentMonth={currentMonth} />
      </View>
      <View className="mt-4 mb-4">
        <AverageSpeed stats={stats.averageSpeeds} currentMonth={currentMonth} />
      </View>
      <View className="mt-4 pb-48">
        <RunTime stats={stats.runTimes} currentMonth={currentMonth} />
      </View>
    </>
  );
}
