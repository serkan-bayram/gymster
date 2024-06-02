import { View } from "react-native";

interface Divider {
  type: "horizontal" | "vertical";
}

export function Divider({ type }: Divider) {
  return type === "vertical" ? (
    <View className="h-full w-[1px] bg-gray"></View>
  ) : (
    <View className="h-[1px] w-full bg-gray"></View>
  );
}
