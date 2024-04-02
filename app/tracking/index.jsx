import { Text, View } from "react-native";
import { Heading } from "@/components/heading";
import { GYMDays } from "@/components/gym-days";
import { Meals } from "@/components/meals";
import { Water } from "@/components/water";

export default function Tracking() {
  return (
    <View className="pt-9 px-4 flex-1 gap-y-4 bg-background">
      <Heading heading={"Tracking"} />
      <GYMDays />
      <Meals />
      <Water />
    </View>
  );
}
