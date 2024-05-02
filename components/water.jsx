import { View } from "react-native";
import { WaterContent } from "./ui/water/water-content";
import { WaterHeading } from "./ui/water/water-heading";
import { WaterBottomSheet } from "./ui/water/water-bottom-sheet";
import { useRef } from "react";
import { findUserHydration, findUserTrackings } from "@/utils/db";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/utils/session-context";

export function Water() {
  const bottomSheetRef = useRef(null);

  const { session } = useSession();

  const query = useQuery({
    queryKey: ["water"],
    queryFn: () => findUserHydration(session.uid),
    gcTime: 0,
  });

  console.log(query.error);

  return (
    <View className="flex-1 mt-2">
      <WaterHeading bottomSheetRef={bottomSheetRef} />
      <WaterContent />
      <WaterBottomSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
