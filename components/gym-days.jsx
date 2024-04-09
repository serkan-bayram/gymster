import { View } from "react-native";
import { DaysHeading } from "./ui/gym-days/days-heading";
import { DaysContainer } from "./ui/gym-days/days-container";

export function GYMDays() {
  return (
    <View className="flex gap-y-2 mt-4 px-4">
      <DaysHeading />
      <DaysContainer />
    </View>
  );
}
