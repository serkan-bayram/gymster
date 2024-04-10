import { Text, View } from "react-native";

export function Heading({ heading }) {
  return (
    <View className="flex px-4 w-full flex-row justify-between items-center">
      <Text className="text-xl font-bold">{heading}</Text>
      <View className="w-12 h-12 bg-green-500 rounded-full"></View>
    </View>
  );
}
