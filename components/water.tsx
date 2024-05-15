import { View } from "react-native";
import { WaterContent } from "./ui/water/water-content";
import { WaterHeading } from "./ui/water/water-heading";
import { WaterBottomSheet } from "./ui/water/water-bottom-sheet";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type WaterProps = {
  fetchedProgress: number | null;
};

export function Water({ fetchedProgress }: WaterProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View className="flex-1  mt-2 mb-4">
      <WaterHeading bottomSheetRef={bottomSheetRef} />
      <WaterContent fetchedProgress={fetchedProgress} />
      <WaterBottomSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
