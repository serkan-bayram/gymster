import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { MonthPicker } from "./picker";
import { StatHeader } from "./stat-header";
import { Data } from "..";

export function Distance({
  stats,
  currentMonth,
}: {
  stats: Data[];
  currentMonth: string;
}) {
  // Picked month by user, currentMonth -> default picked
  const [month, setMonth] = useState<string>(currentMonth);

  // Filter stats by month
  const distancesByMonth = stats.filter((stat) => stat.label.includes(month));

  const monthPicker = useRef<any>(null);

  return (
    <>
      <StatHeader
        header="Mesafe | km"
        month={month}
        monthPicker={monthPicker}
      />
      {distancesByMonth.length > 0 ? (
        <View>
          <LineChart width={200} isAnimated data={distancesByMonth} />
        </View>
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
