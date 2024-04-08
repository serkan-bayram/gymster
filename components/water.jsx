import { View } from "react-native";
import { WaterContent } from "./ui/water-content";
import { WaterHeading } from "./ui/water-heading";
import { WaterBottomSheet } from "./ui/water-bottom-sheet";
import { useRef } from "react";

export function Water() {
  const bottomSheetRef = useRef(null);

  return (
    <>
      <View className="flex-1 mt-2 ">
        <WaterHeading bottomSheetRef={bottomSheetRef} />
        <WaterContent />
      </View>
      <WaterBottomSheet bottomSheetRef={bottomSheetRef} />
    </>
  );
}
