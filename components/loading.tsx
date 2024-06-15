import { ActivityIndicator, View } from "react-native";

export function FullScreenLoading() {
  return (
    <View className="flex-1 bg-background flex items-center justify-center">
      <ActivityIndicator size="large" color="#332941" />
    </View>
  );
}
