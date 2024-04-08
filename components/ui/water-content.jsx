import { View } from "react-native";
import { ProgressBar } from "./circular-progressbar";
import { UpdateWaterValue } from "./update-water-value";
import { useState } from "react";

export function WaterContent() {
  // How many ml water did user drink
  const [currentProgress, setCurrentProgress] = useState(300);

  return (
    <View className="flex-1 flex-row px-4  gap-y-2">
      <ProgressBar currentProgress={currentProgress} />
      <UpdateWaterValue
        currentProgress={currentProgress}
        setCurrentProgress={setCurrentProgress}
      />
    </View>
  );
}
