import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MealDetail() {
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
      className="w-full p-2 bg-gray border rounded-lg"
    >
      <Text numberOfLines={1} className=" text-lg">
        Köfte, Pilav, Kolaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      </Text>
      <Animated.View
        style={{ maxHeight }}
        className="flex flex-row justify-evenly mt-3"
      >
        <View>
          <Text className="text-center font-bold text-lg">203</Text>
          <Text className="text-center">Kcal</Text>
        </View>
        <View>
          <Text className="text-center font-bold text-lg">100</Text>
          <Text className="text-center">Protein</Text>
        </View>
        <View>
          <Text className="text-center font-bold text-lg">20</Text>
          <Text className="text-center">Yağ</Text>
        </View>
        <View>
          <Text className="text-center font-bold text-lg">120</Text>
          <Text className="text-center">Karb</Text>
        </View>
      </Animated.View>
    </AnimatedPressable>
  );
}
