import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Set } from "./set";
import { cn } from "@/utils/cn";
import { Exercise as ExerciseType } from "@/utils/types/workout";
import * as Crypto from "expo-crypto";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import { useDeleteWorkout } from "@/utils/apis/workout";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Exercise({
  exercise,
  darkMode,
  workout,
  documentPath,
}: {
  exercise: ExerciseType;
  darkMode?: boolean;
  workout: ExerciseType[];
  documentPath: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { exerciseId, exercises } = exercise;

  const { defaultExercises } = useSelector((state: RootState) => state.workout);
  const exerciseName = defaultExercises?.exercises.find((ex) => {
    return exerciseId === ex.id;
  });

  const totalSet = exercises.length;
  const totalRepeat = exercises.reduce((total, ex) => total + ex.repeat, 0);

  const deleteWorkout = useDeleteWorkout();

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Bu egzersizi silmek istediğinize emin misiniz?",
      exerciseName?.name,
      [
        {
          text: "Sil",
          onPress: () => {
            deleteWorkout.mutate({
              workout: workout,
              deletedWorkout: exercise.exerciseId,
              documentPath: documentPath,
            });
          },
        },
        { text: "Vazgeç" },
      ]
    );
  };

  return (
    <AnimatedPressable
      onLongPress={handleLongPress}
      entering={FadeIn.duration(300)}
      onPress={() => setIsOpen((prevValue) => !prevValue)}
      className={cn(
        "rounded-xl border border-white active:bg-black/75 transition-all mb-4",
        {
          "border-none bg-secondary mb-2": darkMode,
        }
      )}
    >
      <View
        className={cn("h-10 px-3 flex flex-row items-center justify-between", {
          "h-12": darkMode,
        })}
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
        <View className="pt-3">
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
