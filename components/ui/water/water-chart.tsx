import { useGetAllWaterData } from "@/utils/apis/water";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import Animated, { SharedValue } from "react-native-reanimated";

interface MonthBased {
  // month
  label: string;
  // total progress of that month
  value: number;
}

export function WaterChart({
  chartPosition,
}: {
  chartPosition: SharedValue<number>;
}) {
  const waterData = useGetAllWaterData();

  if (waterData.isPending) {
    return null;
  }

  // This is bad.
  const monthBasedData: MonthBased[] = [];

  const arr: any = [];

  // TODO: Will tidy up this place

  const sorted = waterData?.data?.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sorted?.forEach((water) => {
    const date = new Date(water.date);

    const month = date.toLocaleDateString("tr-TR", { month: "long" });
    const day = date.getDate();

    if (water.progress > 1000) {
      const frontColor = "#7AA2E3";

      arr.push({ label: day, value: water.progress, frontColor: frontColor });
    } else {
      arr.push({ label: day, value: water.progress });
    }

    return;

    // If we haven't add that month to array
    if (!JSON.stringify(monthBasedData).includes(month)) {
      monthBasedData.push({ label: month, value: water.progress });
    } else {
      // If we already add that month to array
      // find that month and update progress
      monthBasedData.forEach((m) => {
        if (m.label === month) {
          m.value += water.progress;
        }
      });
    }
  });

  return (
    <Animated.View
      style={{
        left: chartPosition,
      }}
      className="flex-1 absolute -right-full"
    >
      <View className="">
        <BarChart frontColor={"lightgray"} data={arr} />
      </View>
    </Animated.View>
  );
}
