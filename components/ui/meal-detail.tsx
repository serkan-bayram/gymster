import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Meal, Nutritions } from "../meals";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Nutrition({ value, type }: { value: string; type: string }) {
  return (
    <View>
      <Text className="text-center font-bold text-lg">{value}</Text>
      <Text className="text-center">{type}</Text>
    </View>
  );
}

export function MealDetail({ detail }: { detail: Meal }) {
  const { userInput, nutritions } = detail;

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
      className="w-full p-2 bg-gray border rounded-lg my-2"
    >
      <Text numberOfLines={1} className=" text-lg">
        {userInput}
      </Text>
      <Animated.View
        style={{ maxHeight }}
        className="flex flex-row justify-evenly mt-3"
      >
        {nutritions &&
          (Object.keys(nutritions) as (keyof Nutritions)[]).map((nutrition) => {
            return <Nutrition type={nutrition} value={nutritions[nutrition]} />;
          })}
      </Animated.View>
    </AnimatedPressable>
  );
}
