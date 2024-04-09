import { View } from "react-native";
import { DaysHeading } from "./ui/gym-days/days-heading";
import { DaysContainer } from "./ui/gym-days/days-container";
import { useState } from "react";

export function GYMDays() {
  const [wentToGYM, setWentToGYM] = useState(false);

  return (
    <View className="flex gap-y-2 mt-4 px-4">
      <DaysHeading wentToGYM={wentToGYM} setWentToGYM={setWentToGYM} />
      <DaysContainer wentToGYM={wentToGYM} />
    </View>
  );
}
