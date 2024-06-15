import { View } from "react-native";
import { ProgressBar } from "../circular-progressbar";
import { UpdateWaterValue } from "./update-water-value";

export function WaterContent() {
  return (
    <View className="flex-1 flex-row  h-40 gap-y-2">
      <ProgressBar />
      <UpdateWaterValue />
    </View>
  );
}
