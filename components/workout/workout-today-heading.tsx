import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export function WorkoutTodayHeading() {
  return (
    <View className="flex flex-row justify-between items-center">
      <View className="flex flex-row gap-x-2 items-center">
        <Feather name="calendar" size={20} color="white" />
        <Text className="font-semibold text-white">Bugün</Text>
      </View>
      <Text className="font-semibold text-white">25/05/24</Text>
    </View>
  );
}
