import { Text, View } from "react-native";
import { DaysHeading } from "./ui/gym-days/days-heading";
import { DaysContainer } from "./ui/gym-days/days-container";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGYMDays, getServerTime } from "@/utils/db";
import { useSession } from "@/utils/session-context";

export function GYMDays() {
  const { session } = useSession();

  const [wentToGYM, setWentToGYM] = useState(false);

  // This query gets the days that user went to gym
  const query = useQuery({
    queryKey: ["wentToGYMDays"],
    queryFn: async () => {
      const { serverTime } = await getServerTime();

      if (serverTime) {
        const serverDate = new Date(serverTime.date.toDate());

        const todaysDate = serverDate.getDate();

        // Is an array that contains day numbers that user went to gym
        const wentToGYMDays = await getGYMDays(session.uid, serverTime.date);

        // Did user went to gym today
        const wentToGYMToday = wentToGYMDays.includes(todaysDate);

        setWentToGYM(wentToGYMToday);

        return { wentToGYMDays, wentToGYMToday };
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
