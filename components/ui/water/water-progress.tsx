import Animated, { SharedValue } from "react-native-reanimated";
import { ProgressBar } from "../circular-progressbar";
import { UpdateWaterValue } from "./update-water-value";
import { Dimensions } from "react-native";

export function WaterProgress({
  progressBarPosition,
}: {
  progressBarPosition: SharedValue<number>;
}) {
  const windowWidth = Dimensions.get("window").width;

  // 32 -> we have px-4(32px) in the container
  // so correct fullWidth would be windowWidth - 32px
  return (
    <Animated.View
      style={{
        left: progressBarPosition,
        width: windowWidth - 32,
      }}
      className="flex-1 relative   flex-row"
    >
      <ProgressBar />
      <UpdateWaterValue />
    </Animated.View>
  );
}
