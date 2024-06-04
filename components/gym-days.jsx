import { View } from "react-native";
import { DaysHeading } from "./ui/gym-days/days-heading";
import { DaysContainer } from "./ui/gym-days/days-container";
import { useState } from "react";
import { useGetWentToGYMDays } from "@/utils/apis/gymDays";

export function GYMDays({ fetchedWentToGYM }) {
  const [wentToGYM, setWentToGYM] = useState(fetchedWentToGYM);
  const [wentToGYMDays, setWentToGYMDays] = useState([]);

  useGetWentToGYMDays({ setWentToGYMDays: setWentToGYMDays });

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
