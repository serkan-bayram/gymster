import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Meal, Nutritions } from "../meals";
import * as Crypto from "expo-crypto";
import { cn } from "@/utils/cn";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Nutrition({
  value,
  type,
  textColor,
}: {
  value: string;
  type: string;
  textColor: string;
}) {
  return (
    <View>
      <Text className={cn("text-center font-bold text-lg", textColor)}>
        {value}
      </Text>
      <Text className={cn("text-center", textColor)}>{type}</Text>
    </View>
  );
}

export function MealDetail({
  detail,
  colors,
}: {
  detail: Meal;
  colors: { bgColor: string; textColor: string };
}) {
  const { userInput, nutritions } = detail;
  const { bgColor, textColor } = colors;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const maxHeight = useSharedValue<number>(0);

  const handlePress = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  useEffect(() => {
    if (isOpen) {
      maxHeight.value = withTiming(400, {
        duration: 100,
      });
    } else {
      maxHeight.value = withTiming(0, { duration: 100 });
    }
  }, [isOpen]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      className={cn("w-full p-2  border rounded-lg my-1", bgColor)}
    >
      <Text numberOfLines={1} className={cn("text-lg", textColor)}>
        {userInput}
      </Text>
      <Animated.View
        style={{ maxHeight }}
        className="flex flex-row justify-evenly"
      >
        {nutritions &&
          (Object.keys(nutritions) as (keyof Nutritions)[]).map((nutrition) => {
            return (
              <Nutrition
                textColor={textColor}
                key={Crypto.randomUUID()}
                type={nutrition}
                value={nutritions[nutrition]}
              />
            );
          })}
      </Animated.View>
    </AnimatedPressable>
  );
}
