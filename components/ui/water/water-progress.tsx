import { View } from "react-native";
import { ProgressBar } from "../circular-progressbar";
import { UpdateWaterValue } from "./update-water-value";

export function WaterProgress() {
  return (
    <View className="flex-1 relative flex-row">
      <ProgressBar />
      <UpdateWaterValue />
    </View>
  );
}
