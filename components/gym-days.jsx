import { View } from "react-native";
import { DaysHeading } from "./ui/gym-days/days-heading";
import { DaysContainer } from "./ui/gym-days/days-container";
import { useGetWentToGYMDays } from "@/utils/apis/gymDays";

export function GYMDays() {
  useGetWentToGYMDays();

  return (
    <View className="flex gap-y-2 mt-4">
      <DaysHeading />
      <DaysContainer />
    </View>
  );
}
