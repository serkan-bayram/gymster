import { Text, View } from "react-native";
import { ProgressBar } from "./ui/circular-progressbar";

export function Water() {
  return (
    <View className="flex-1 mt-2">
      <Text className="text-lg mb-2">Hydration</Text>
      <ProgressBar />
    </View>
  );
}
