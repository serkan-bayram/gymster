import { memo, useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import Animated, {
  FadeOut,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Crypto from "expo-crypto";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { setRenderConfetti } from "@/utils/state/confetti/confettiSlice";

const AnimatedView = Animated.createAnimatedComponent(View);

function Emoji({
  emoji,
  middleIndex,
  index,
}: {
  emoji: string;
  middleIndex: number;
  index: number;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const pBottom = useSharedValue<number>(0);
  const pLeft = useSharedValue<number>(0);

  // Increase y by this value
  const yIncreaseRate = 40;

  // top and min y values
  const minY = 100;
  const topY = minY + middleIndex * yIncreaseRate;

  const windowWidth = Dimensions.get("window").width;

  const xIncreaseRate = windowWidth / 2 / middleIndex;

  const position = {
    // 16 is half size of an emoji (a full one is 32px)
    x: xIncreaseRate * index - 16,
    y:
      index <= middleIndex
        ? // Increase y value as index is smaller than middleIndex
          minY + index * yIncreaseRate
        : // Decrease y value as index is bigger than middleIndex
          topY - (index - middleIndex) * yIncreaseRate,
  };

  useEffect(() => {
    pBottom.value = withSequence(
      withTiming(position.y, { duration: index * 100 }),
      withDelay(1000 + index * 100, withTiming(-200))
    );

    pLeft.value = withTiming(position.x, {
      duration: 150,
    });

    const timeout = setTimeout(() => {
      dispatch(setRenderConfetti(false));
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatedView
      style={[
        {
          position: "absolute",
          zIndex: 100,
          elevation: 100,
          bottom: pBottom,
          left: pLeft,
        },
      ]}
    >
      <Text className="text-[32px]">{emoji}</Text>
    </AnimatedView>
  );
}

const emojis = ["🌟", "💯", "💪🏻", "🎉", "✨"];

export function Confetti() {
  const renderConfetti = useSelector(
    (state: RootState) => state.confetti.renderConfetti
  );

  return (
    <>
      {renderConfetti &&
        emojis.map((emoji, index) => {
          return (
            <Emoji
              key={Crypto.randomUUID()}
              middleIndex={Math.floor((emojis.length + 1) / 2)}
              emoji={emoji}
              index={index + 1}
            />
          );
        })}
    </>
  );
}
