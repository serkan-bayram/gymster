import { Text, View } from "react-native";
import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";

export default function Tracking() {
  return (
    <View className="pt-9 px-4 flex gap-y-4 bg-background">
      <Heading heading={"Tracking"} />
      <GYMDays />
      <Meals />
    </View>
  );
}
