import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import { LineChart } from "react-native-gifted-charts";
import { MonthPicker } from "./picker";

interface MaxDistance {
  // label -> date of day
  label: string;
  // value -> distance of day
  value: number;
}

// Loops over runs and returns an array of distances of days
function useMaxDistances({ month }: { month: string }) {
  const runs = useSelector((state: RootState) => state.running.allRuns);

  const [maxDistances, setMaxDistances] = useState<MaxDistance[]>([]);

  useEffect(() => {
    const maxDistancesArray: MaxDistance[] = [];

    runs.forEach((run) => {
      if (month === "") return;

      const date = run.dateAsText || "";

      if (!date.includes(month)) return;

      const day = date.split(" ")[0];

      // run.runs -> every "run" is made of multiple runs
      // because user can run more than 1 in one day but they are all
      // categorized under 1 day
      const distance = run.runs.reduce(
        (total, dist) => total + dist.distance,
        0
      );

      maxDistancesArray.push({ label: day, value: distance });
    });

    setMaxDistances(maxDistancesArray.reverse());
  }, [month]);

  return { maxDistances: maxDistances };
}

export function Distance({ currentMonth }: { currentMonth: string }) {
  const [month, setMonth] = useState<string>(currentMonth);
  const { maxDistances } = useMaxDistances({ month: month });

  const monthPicker = useRef<any>(null);

  return (
    <>
      <View className="mb-4 flex flex-row justify-between">
        <Text className="font-semibold text-lg">Mesafe</Text>
        <Pressable
          onPress={() => monthPicker.current.focus()}
          className="bg-secondary rounded-lg p-2 px-4 justify-between items-center flex flex-row"
        >
          <Text className="text-white">{month}</Text>
          <MaterialIcons name="expand-more" size={16} color="white" />
        </Pressable>
      </View>
      {maxDistances.length > 0 ? (
        <LineChart isAnimated data={maxDistances} />
      ) : (
        <View className="flex items-center justify-center mt-8">
          <Text>{month} ayı için hiç veri bulunamadı.</Text>
        </View>
      )}

      <MonthPicker
        setValue={setMonth}
        selectedValue={month}
        pickerRef={monthPicker}
      />
    </>
  );
}
