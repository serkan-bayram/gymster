import { View } from "react-native";
import { WaterHeading } from "./ui/water/water-heading";
import { WaterBottomSheet } from "./ui/water/water-bottom-sheet";
import { useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { WaterProgress } from "./ui/water/water-progress";
import { ChartBottomSheet } from "./ui/water/chart-bottom-sheet";

export function Water() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const chartBottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View className="flex-1 mt-2 mb-4">
      <WaterHeading
        chartBottomSheetRef={chartBottomSheetRef}
        bottomSheetRef={bottomSheetRef}
      />
      <View className="h-48">
        <WaterProgress />
      </View>

      <WaterBottomSheet bottomSheetRef={bottomSheetRef} />
      <ChartBottomSheet bottomSheetRef={chartBottomSheetRef} />
    </View>
  );
}
