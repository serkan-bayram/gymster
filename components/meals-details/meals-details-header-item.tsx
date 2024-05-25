import { MealsDetailsObject } from "@/app/(app)/meals-details";
import { cn } from "@/utils/cn";
import { Image, ImageSource } from "expo-image";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// The calories inside of Details Header Component
export function MealsDetailsHeaderItem({
  measurement,
  type,
  backgroundColor,
  iconSrc,
  textColor,
  currentMeal,
}: {
  measurement: string;
  type: string;
  backgroundColor: string;
  iconSrc: ImageSource;
  textColor?: string;
  currentMeal: MealsDetailsObject | undefined;
}) {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["white", backgroundColor]
      ),
    };
  });

  useEffect(() => {
    progress.value = withTiming(0, { duration: 200 }, () => {
      progress.value = withTiming(1, { duration: 200 });
    });
  }, [currentMeal?.day]);

  return (
    <Animated.View
      style={animatedStyle}
      className={cn("bg-primary pr-6 py-2 pl-2 w-20 rounded-lg")}
    >
      <View className="w-6 h-6">
        <Image source={iconSrc} className="flex-1" contentFit="cover" />
      </View>
      <View className="flex mt-1">
        <View className="flex">
          <Text className={cn("font-bold", textColor)}>{measurement}</Text>
          <Text className={cn(textColor)}>{type}</Text>
        </View>
      </View>
    </Animated.View>
  );
}
