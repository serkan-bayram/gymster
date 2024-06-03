import { View } from "react-native";
import { DaysHeading } from "./ui/gym-days/days-heading";
import { DaysContainer } from "./ui/gym-days/days-container";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGYMDays } from "@/utils/db";
import { useSession } from "@/utils/session-context";
import { useTime } from "@/utils/time-context";
import { queryGetGYMDays } from "@/utils/query-functions";

export function GYMDays({ fetchedWentToGYM }) {
  const { session } = useSession();

  const [wentToGYM, setWentToGYM] = useState(fetchedWentToGYM);
  const [wentToGYMDays, setWentToGYMDays] = useState([]);

  // This query gets the days that user went to gym
  const query = useQuery({
    queryKey: ["wentToGYMDays"],
    queryFn: async () => await queryGetGYMDays(session?.uid, setWentToGYMDays),
  });

  return (
    <View className="flex gap-y-2 mt-4">
      <DaysHeading
        setWentToGYMDays={setWentToGYMDays}
        wentToGYM={wentToGYM}
        setWentToGYM={setWentToGYM}
      />
      <DaysContainer wentToGYMDays={wentToGYMDays} wentToGYM={wentToGYM} />
    </View>
  );
}
