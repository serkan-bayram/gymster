import { View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { WaterChart } from "./water-chart";
import { WaterProgress } from "./water-progress";
import { Showing } from "@/components/water";

export function WaterContent({
  setCurrentlyShowing,
  currentlyShowing,
}: {
  setCurrentlyShowing: any;
  currentlyShowing: Showing;
}) {
  const progressBarPosition = useSharedValue(0);
  const chartPosition = useSharedValue(0);

  const { showing } = currentlyShowing;

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      if (showing === "progress") return;

      progressBarPosition.value = withTiming(0, { duration: 200 });
      chartPosition.value = withTiming(400, { duration: 200 });

      runOnJS(setCurrentlyShowing)({ showing: "progress" });
    });

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      if (showing === "chart") return;

      progressBarPosition.value = withTiming(-400, { duration: 200 });
      chartPosition.value = withTiming(0, { duration: 200 });

      runOnJS(setCurrentlyShowing)({ showing: "chart" });
    });

  return (
    <GestureDetector gesture={flingRight}>
      <GestureDetector gesture={flingLeft}>
        <View className="h-64">
          <WaterProgress progressBarPosition={progressBarPosition} />
          <WaterChart chartPosition={chartPosition} />
        </View>
      </GestureDetector>
    </GestureDetector>
  );
}
