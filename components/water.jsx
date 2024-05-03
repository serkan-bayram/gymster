import { View } from "react-native";
import { WaterContent } from "./ui/water/water-content";
import { WaterHeading } from "./ui/water/water-heading";
import { WaterBottomSheet } from "./ui/water/water-bottom-sheet";
import { useRef } from "react";
import {
  findUserHydration,
  findUserTrackings,
  getServerTime,
  updateServerTime,
} from "@/utils/db";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/utils/session-context";

export function Water() {
  const bottomSheetRef = useRef(null);

  const { session } = useSession();

  const query = useQuery({
    queryKey: ["water"],
    queryFn: async () => {
      const { updated } = await updateServerTime(session.uid);

      if (updated) {
        const { serverTime } = await getServerTime();

        return serverTime;
      }
    },
    gcTime: 0,
  });

  console.log(query.data);

  return (
    <View className="flex-1 mt-2">
      <WaterHeading bottomSheetRef={bottomSheetRef} />
      <WaterContent />
      <WaterBottomSheet bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
