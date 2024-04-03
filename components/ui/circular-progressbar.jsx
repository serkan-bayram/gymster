import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const BACKGROUND_COLOR = "#444B6F";
const BACKGROUND_STROKE_COLOR = "#303858";
const STROKE_COLOR = "#A6E1FA";

const CIRCLE_LENGTH = 400;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressBar() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 2000 });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

  return (
    <View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;

        setWidth(width);
        setHeight(height);
      }}
      className="flex-1 items-center justify-center border"
    >
      <Svg>
        {width > 0 && (
          <>
            <AnimatedCircle
              fillOpacity={0}
              strokeDasharray={CIRCLE_LENGTH}
              animatedProps={animatedProps}
              cx={width / 2}
              cy={height / 2}
              r={R}
              stroke={"#C4E4FF"}
              strokeWidth={15}
              strokeLinecap={"round"}
            />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 80,
    color: "rgba(256,256,256,0.7)",
    width: 200,
    textAlign: "center",
  },
  button: {
    position: "absolute",
    bottom: 80,
    height: 60,
    backgroundColor: BACKGROUND_STROKE_COLOR,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 25,
    color: "white",
    letterSpacing: 2.0,
  },
});
