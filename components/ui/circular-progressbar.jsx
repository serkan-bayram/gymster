import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const CIRCLE_LENGTH = 400;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressBar({ progress: userProgress, goal }) {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1000 });
  }, []);

  const progressPercantage = (userProgress * 100) / goal;

  const progressCalculation = progressPercantage * 4;

  // strokeDashoffset = CIRCLE_LENGTH -> no progress
  // strokeDashoffset = CIRCLE_LENGTH - CIRCLE_LENGTH / 2 -> 50% progress
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH - progress.value * progressCalculation,
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
          {progressPercantage <= 100 ? progressPercantage : 100}%
        </Text>
        <Text>of {goal} ml </Text>
      </View>
      <Svg className="absolute">
        {width > 0 && (
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
