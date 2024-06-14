import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Set } from "./set";
import { cn } from "@/utils/cn";
import { Exercise as ExerciseType } from "@/utils/types/workout";
import * as Crypto from "expo-crypto";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Exercise({ exercise }: { exercise: ExerciseType }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { exerciseId, exercises } = exercise;

  const defaultExercises = useSelector(
    (state: RootState) => state.workout.defaultExercises
  );

  const exerciseName = defaultExercises?.exercises.find((ex) => {
    return exerciseId === ex.id;
  });

  const totalSet = exercises.length;
  const totalRepeat = exercises.reduce((total, ex) => total + ex.repeat, 0);

  return (
    <AnimatedPressable
      entering={FadeIn.duration(300)}
      onPress={() => setIsOpen((prevValue) => !prevValue)}
      className="  rounded-xl border
                border-white active:bg-black/75 transition-all mb-4"
    >
      <View
        className="h-10 px-3 flex flex-row items-center
               justify-between"
      >
        <Text numberOfLines={1} className="text-white max-w-[50%]">
          {exerciseName?.name || "Egzersiz"}
        </Text>
        <View className="flex flex-row items-center ">
          <Text className="text-white">
            {totalSet} set {totalRepeat} tekrar
          </Text>
          <View className={cn({ "rotate-180": isOpen })}>
            <MaterialIcons name="expand-more" size={24} color="white" />
          </View>
        </View>
      </View>
      {isOpen && (
        <View className="mt-3 ">
          {exercises.map((ex, index) => {
            return (
              <Set
                key={Crypto.randomUUID()}
                setIndex={index}
                weight={ex.weight}
                repeat={ex.repeat}
              />
            );
          })}
        </View>
      )}
    </AnimatedPressable>
  );
}
