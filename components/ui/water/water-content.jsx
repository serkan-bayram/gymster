import { View } from "react-native";
import { ProgressBar } from "../circular-progressbar";
import { UpdateWaterValue } from "./update-water-value";
import { useState } from "react";

export function WaterContent({ fetchedProgress }) {
  // How many ml water did user drink
  // TODO: maybe moving this state to useWater can be useful
  const [currentProgress, setCurrentProgress] = useState(fetchedProgress || 0);

  return (
    <View className="flex-1 flex-row px-4 h-40 gap-y-2">
      <ProgressBar currentProgress={currentProgress} />
      <UpdateWaterValue
        currentProgress={currentProgress}
        setCurrentProgress={setCurrentProgress}
      />
    </View>
  );
}
