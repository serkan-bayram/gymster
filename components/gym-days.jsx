import { View } from "react-native";
import { DaysHeading } from "./ui/gym-days/days-heading";
import { DaysContainer } from "./ui/gym-days/days-container";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGYMDays } from "@/utils/db";
import { useSession } from "@/utils/session-context";
import { useTime } from "@/utils/time-context";

export function GYMDays({ fetchedWentToGYM }) {
  const { session } = useSession();
  const { serverTime } = useTime();

  const [wentToGYM, setWentToGYM] = useState(fetchedWentToGYM);

  // This query gets the days that user went to gym
  const query = useQuery({
    queryKey: ["wentToGYMDays"],
    queryFn: async () => {
      if (serverTime) {
        // Is an array that contains day numbers that user went to gym
        const wentToGYMDays = await getGYMDays(session.uid, serverTime.date);

        return { wentToGYMDays };
      }

      return null;
    },
  });

  return (
    <View className="flex gap-y-2 mt-4 px-4">
      <DaysHeading wentToGYM={wentToGYM} setWentToGYM={setWentToGYM} />
      <DaysContainer
        wentToGYMDays={query.data?.wentToGYMDays || []}
        wentToGYM={wentToGYM}
      />
    </View>
  );
}
