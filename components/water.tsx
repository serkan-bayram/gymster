import { View } from "react-native";
import { WaterContent } from "./ui/water/water-content";
import { WaterHeading } from "./ui/water/water-heading";
import { WaterBottomSheet } from "./ui/water/water-bottom-sheet";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export function Water() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View className="flex-1  mt-2 mb-4">
      <WaterHeading bottomSheetRef={bottomSheetRef} />
      <WaterContent />
      <WaterBottomSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
