import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useWater } from "@/utils/water-context";

// How big the circle will be
const CIRCLE_LENGTH = 400;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// TODO: There is sooo much bandage on this one component, we need to make it simpler
export function ProgressBar({ currentProgress }) {
  const { goalValue: goal } = useWater();

  // We use these states to locate svgs
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const progress = useSharedValue(0);

  // if currentPercantage is 1000 and goal is 2000
  // progressPercantage would be 50
  const progressPercantage =
    goal <= currentProgress ? 100 : (currentProgress * 100) / goal;

  // 100                  75
  // 400(CIRCLE_LENGTH)    ?
  // ? = progressCalculation
  // We use this value to set strokeDashoffset
  const progressCalculation = (progressPercantage * CIRCLE_LENGTH) / 100;

  // Animate the progress bar on mount
  useEffect(() => {
    progress.value = withTiming(progressCalculation, { duration: 1000 });
  }, []);

  // Animate the progress bar when currentProgress changes
  useEffect(() => {
    if (progressPercantage <= 100) {
      progress.value = withTiming(progressCalculation, { duration: 350 });
    }
  }, [currentProgress, goal]);

  // strokeDashoffset = CIRCLE_LENGTH -> no progress
  // strokeDashoffset = CIRCLE_LENGTH - (CIRCLE_LENGTH / 2) -> 50% progress
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH - progress.value,
  }));

  return (
    <View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;

        setWidth(width);
        setHeight(height);
      }}
      className="flex-1 justify-center"
    >
      <View className="flex items-center gap-y-1">
        <Text className="text-lg font-bold">
          {/* If anything goes wrong and it overflows
           it fallbacks to 100 */}
          %{progressPercantage <= 100 ? parseInt(progressPercantage) : 100}
        </Text>
        <Text>of {goal} ml </Text>
      </View>
      <Svg className="absolute">
        {width > 0 && height > 0 && (
          <>
            <AnimatedCircle
              fillOpacity={0}
              strokeDasharray={CIRCLE_LENGTH}
              strokeDashoffset={0}
              cx={width / 2}
              cy={height / 2}
              r={R}
              stroke={"#C4E4FF"}
              strokeWidth={15}
              opacity={0.5}
              strokeLinecap={"round"}
            />
            <AnimatedCircle
              fillOpacity={0}
              strokeDasharray={CIRCLE_LENGTH}
              animatedProps={animatedProps}
              cx={width / 2}
              cy={height / 2}
              r={R}
              stroke={"#7AA2E3"}
              strokeWidth={15}
              strokeLinecap={"round"}
            />
          </>
        )}
      </Svg>
    </View>
  );
}
