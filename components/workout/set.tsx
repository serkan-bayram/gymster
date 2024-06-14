import { Text, View } from "react-native";
import { Divider } from "../ui/divider";
import { SetType } from "@/utils/types/workout";

export function Set({ setIndex, weight, repeat }: SetType) {
  return (
    <View className="flex flex-row justify-evenly mb-4">
      <Text className="text-white w-24 text-center">{setIndex + 1}. set</Text>
      <Divider type="vertical" />
      <Text className="text-white w-24 text-center">{weight} kg</Text>
      <Divider type="vertical" />
      <Text className="text-white w-24 text-center">{repeat} tekrar</Text>
    </View>
  );
}
