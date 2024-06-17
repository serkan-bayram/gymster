import { ProgressData, useGetAllWaterData } from "@/utils/apis/water";
import { Dimensions, Pressable, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  isDateInSameMonth,
  isDateInSameWeek,
  isDateInSameYear,
} from "@/utils/time-related";
import { ChartData } from "@/app/(app)/(root)/running/stat";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import { cn } from "@/utils/cn";

type PickedFilter = "week" | "month" | "year";

interface FilterButtonProps {
  text: string;
  filterWord: PickedFilter;
  setPickedFilter: Dispatch<SetStateAction<PickedFilter>>;
  pickedFilter: PickedFilter;
}

const FilterButton = ({
  text,
  filterWord,
  setPickedFilter,
  pickedFilter,
}: FilterButtonProps) => (
  <Pressable
    onPress={() => setPickedFilter(filterWord)}
    className={cn(
      "active:bg-blue-600 transition-all p-2 w-16 mr-3 rounded-lg px-3 bg-blue-400",
      {
        "bg-blue-800": pickedFilter === filterWord,
      }
    )}
  >
    <Text className="font-semibold text-center text-white">{text}</Text>
  </Pressable>
);

export const WaterChart = () => {
  const waterData = useGetAllWaterData();

  const [pickedFilter, setPickedFilter] = useState<PickedFilter>("week");

  const [filteredWaterData, setFilteredWaterData] = useState<ChartData[]>([]);

  // Calculate filtered data based on the picked filter
  useCalculateFilterData(setFilteredWaterData, waterData.data, pickedFilter);

  if (waterData.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Veriler düzenleniyor...</Text>
      </View>
    );
  }

  if (!waterData.data?.progress) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Veriler bulunamadı.</Text>
      </View>
    );
  }

  // Define the filter options
  const filters: { text: string; filterWord: PickedFilter }[] = [
    { text: "Hafta", filterWord: "week" },
    { text: "Ay", filterWord: "month" },
    { text: "Yıl", filterWord: "year" },
  ];

  const windowWidth = Dimensions.get("window").width;

  return (
    <View className="flex-1 flex items-center justify-between h-full mt-2">
      <View className="flex mt-4 mb-4 flex-row">
        {filters.map((filter, index) => (
          <FilterButton
            key={index}
            pickedFilter={pickedFilter} // Currently picked filter
            setPickedFilter={setPickedFilter} // Function to set picked filter
            text={filter.text} // Filter text
            filterWord={filter.filterWord} // Filter word
          />
        ))}
      </View>
      <View className="p-2 px-8  w-full">
        <BarChart
          yAxisLabelSuffix={pickedFilter === "year" ? " L" : " mL"}
          height={160}
          width={windowWidth - 120}
          frontColor={"lightgray"}
          data={filteredWaterData}
        />
      </View>
      <View className="flex gap-y-2 mt-2">
        <View className="flex flex-row gap-x-2 items-center">
          <View className="w-3 h-3 bg-[#7AA2E3]"></View>
          <Text>Günlük hedef tamamlandı.</Text>
        </View>
        <View className="flex flex-row gap-x-2 items-center">
          <View className="w-3 h-3 bg-black/20"></View>
          <Text>Günlük hedef tamamlanmadı.</Text>
        </View>
      </View>
    </View>
  );
};

// Custom hook to calculate filtered data based on the selected filter
const useCalculateFilterData = (
  setFilteredWaterData: Dispatch<SetStateAction<ChartData[]>>,
  waterData: { progress: ProgressData[]; currentTime: any } | null | undefined,
  pickedFilter: PickedFilter
) => {
  const goalValue = useSelector((state: RootState) => state.water.goalValue);

  useEffect(() => {
    if (!waterData) return;

    const { progress, currentTime } = waterData;
    // filteredData contains the progress data according to picked filter
    const filteredData: ProgressData[] = progress.filter((water) => {
      switch (pickedFilter) {
        case "week":
          return isDateInSameWeek(water.date, `${currentTime}`);
        case "month":
          return isDateInSameMonth(water.date, `${currentTime}`);
        case "year":
          return isDateInSameYear(water.date, `${currentTime}`);
        default:
          return false;
      }
    });

    // Map filtered data to match chart data format for "week" and "month" filters
    if (pickedFilter === "week" || pickedFilter === "month") {
      const editedFilteredData: ChartData[] = filteredData.map(
        (data: ProgressData) => {
          const date = new Date(data.date);
          const day = date.getDate();

          return {
            label: day.toString(),
            value: data.progress,
            frontColor: data.progress >= goalValue ? "#7AA2E3" : "lightgray",
          };
        }
      );

      setFilteredWaterData(editedFilteredData);
    }

    // Map filtered data to match chart data format for "year" filter
    if (pickedFilter === "year") {
      // Tidy up months to this array
      const months: string[] = [];

      filteredData.forEach((data: ProgressData) => {
        const date = new Date(data.date);
        const month = date.toLocaleDateString("tr-TR", { month: "long" });

        if (!months.includes(month)) {
          months.push(month);
        }
      });

      const monthBasedFilter = months.map((month) => {
        // Get data out of filteredData according to correct month
        const filterByMonth = filteredData.filter((data) => {
          const date = new Date(data.date);
          const innerMonth = date.toLocaleDateString("tr-TR", {
            month: "long",
          });

          return innerMonth === month;
        });

        // Sum up month's progress
        const totalProgress = filterByMonth.reduce(
          (total, progress) => total + progress.progress,
          0
        );

        return {
          label: month,
          value: totalProgress / 1000, // Convert mL to L for yearly data
          frontColor: totalProgress >= goalValue * 30 ? "#7AA2E3" : "lightgray", // Change color if goal is met
        };
      });

      setFilteredWaterData(monthBasedFilter);
    }
  }, [pickedFilter, waterData]);
};
