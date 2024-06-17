import { View } from "react-native";
import { WaterContent } from "./ui/water/water-content";
import { WaterHeading } from "./ui/water/water-heading";
import { WaterBottomSheet } from "./ui/water/water-bottom-sheet";
import { useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export interface Showing {
  showing: "progress" | "chart";
}

export function Water() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [currentlyShowing, setCurrentlyShowing] = useState<Showing>({
    showing: "progress",
  });

  return (
    <View className="flex-1 mt-2 mb-4">
      <WaterHeading
        currentlyShowing={currentlyShowing}
        bottomSheetRef={bottomSheetRef}
      />
      <WaterContent
        currentlyShowing={currentlyShowing}
        setCurrentlyShowing={setCurrentlyShowing}
      />
      <WaterBottomSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
