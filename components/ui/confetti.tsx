import { memo, useEffect } from "react";
import { StyleSheet } from "react-native";
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

function Emoji({ emoji, positions }: { emoji: string; positions: Positions }) {
  const dispatch = useDispatch<AppDispatch>();

  const pBottom = useSharedValue<number>(0);
  const pLeft = useSharedValue<number>(0);
  const pRight = useSharedValue<number>(0);

  useEffect(() => {
    pBottom.value = withSequence(
      withTiming(positions.bottom.y, {
        duration: positions.bottom.duration,
      }),
      withDelay(positions.bottom.delay, withTiming(-200))
    );
    pLeft.value = withTiming(positions.left.x, {
      duration: positions.left.duration,
    });

    pRight.value = withTiming(positions.right.x, {
      duration: positions.right.duration,
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
          left: positions.right.x ? "auto" : pLeft,
          right: positions.left.x ? "auto" : pRight,
        },
      ]}
    >
      <Text className="text-[32px]">{emoji}</Text>
    </AnimatedView>
  );
}

interface Positions {
  bottom: { y: number; duration: number; delay: number };
  left: { x: number; duration: number };
  right: { x: number; duration: number };
}

type RandomNumberParams = { min: number; max: number };

function getRandomNumber({ min, max }: RandomNumberParams): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPositionParams(): {
  y: number;
  duration: number;
  delay: number;
} {
  return {
    y: getRandomNumber({ min: 200, max: 600 }),
    duration: getRandomNumber({ min: 400, max: 800 }),
    delay: getRandomNumber({ min: 600, max: 1200 }),
  };
}

function generateSideParams(): { x: number; duration: number } {
  return {
    x: getRandomNumber({ min: 0, max: 400 }),
    duration: getRandomNumber({ min: 200, max: 400 }),
  };
}

const emojis = ["🌟", "💯", "💪🏻", "🎉", "✨"];

export function Confetti() {
  const renderConfetti = useSelector(
    (state: RootState) => state.confetti.renderConfetti
  );

  return (
    renderConfetti &&
    Array.from({ length: 35 }).map(() => {
      const randBottom = generateRandomPositionParams();
      const isRight = Math.random() > 0.5;
      const randLeft = isRight ? { x: 0, duration: 0 } : generateSideParams();
      const randRight = isRight ? generateSideParams() : { x: 0, duration: 0 };

      const positions: Positions = {
        bottom: randBottom,
        left: randLeft,
        right: randRight,
      };

      const randomEmoji =
        emojis[getRandomNumber({ max: emojis.length - 1, min: 0 })];

      return (
        <Emoji
          key={Crypto.randomUUID()}
          emoji={randomEmoji}
          positions={positions}
        />
      );
    })
  );
}
