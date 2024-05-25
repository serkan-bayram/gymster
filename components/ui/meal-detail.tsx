import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Meal, Nutritions } from "../meals";
import * as Crypto from "expo-crypto";
import { cn } from "@/utils/cn";
import { AntDesign } from "@expo/vector-icons";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);

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

  // Nutritions height
  const maxHeight = useSharedValue<number>(0);
  // Icon rotation
  const rotate = useSharedValue<string>("0deg");

  const handlePress = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  useEffect(() => {
    if (isOpen) {
      maxHeight.value = withTiming(400, {
        duration: 300,
      });

      rotate.value = withSpring("180deg");
    } else {
      maxHeight.value = withTiming(0, { duration: 300 });

      rotate.value = withSpring("0deg");
    }
  }, [isOpen]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      className={cn(
        "active:opacity-75 transition-all w-full p-2 border rounded-lg mb-1",
        bgColor
      )}
    >
      <View className="flex flex-row justify-between items-center">
        <Text
          numberOfLines={1}
          className={cn("text-lg w-[90%] my-1", textColor)}
        >
          {userInput}
        </Text>
        <AnimatedIcon
          name="down"
          size={24}
          color="white"
          style={{ transform: [{ rotate }] }}
        />
      </View>
      <Animated.View
        style={{ maxHeight }}
        className="flex flex-row justify-evenly "
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
