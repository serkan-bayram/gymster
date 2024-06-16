import Animated, { SharedValue } from "react-native-reanimated";
import { ProgressBar } from "../circular-progressbar";
import { UpdateWaterValue } from "./update-water-value";

export function WaterProgress({
  progressBarPosition,
}: {
  progressBarPosition: SharedValue<number>;
}) {
  return (
    <Animated.View
      style={{
        left: progressBarPosition,
      }}
      className="flex-1 relative  flex-row"
    >
      <ProgressBar />
      <UpdateWaterValue />
    </Animated.View>
  );
}
