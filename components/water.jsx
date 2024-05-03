import { View } from "react-native";
import { WaterContent } from "./ui/water/water-content";
import { WaterHeading } from "./ui/water/water-heading";
import { WaterBottomSheet } from "./ui/water/water-bottom-sheet";
import { useRef } from "react";

export function Water({ progress }) {
  const bottomSheetRef = useRef(null);

  return (
    <View className="flex-1 mt-2">
      <WaterHeading bottomSheetRef={bottomSheetRef} />
      <WaterContent progress={progress} />
      <WaterBottomSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
