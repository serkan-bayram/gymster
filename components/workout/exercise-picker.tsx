import { Pressable, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import * as Crypto from "expo-crypto";
import { memo, useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";

const Exercise = ({
  exercise,
  isSelected,
  onSelect,
}: {
  exercise: string;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <Pressable
      onPress={onSelect}
      className={cn(
        "bg-white border-2 border-gray/50 active:bg-[#d0f4de]/50 transition-all p-2 px-3 rounded-md m-1",
        {
          "bg-[#d0f4de] border-2 border-[#2a9d8f]": isSelected,
        }
      )}
    >
      <Text>{exercise}</Text>
    </Pressable>
  );
};

const Exercises = memo(
  ({
    exercises,
    selectedExercise,
    setSelectedExercise,
  }: {
    exercises: string[];
    selectedExercise: string | null;
    setSelectedExercise: (exercise: string | null) => void;
  }) => {
    return exercises.map((exercise) => (
      <Exercise
        key={Crypto.randomUUID()}
        isSelected={selectedExercise === exercise}
        onSelect={() => {
          setSelectedExercise(exercise === selectedExercise ? null : exercise);
        }}
        exercise={exercise}
      />
    ));
  }
);

export function ExercisePicker() {
  // User selected a exercise
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  // User input
  const [searched, setSearched] = useState<string | null>(null);

  // basically debounced searched
  const [filteredExercise, setFilteredExercise] = useState<string | null>(null);

  const exercises = useMemo(() => {
    const exercises = [
      "Chest Press",
      "Dumbell Row",
      "Lat Pulldown",
      "Squat",
      "Bulgarian Squat",
      "Lat Pulldown",
      "Squat",
      "Bulgarian Squat",
      "Lat Pulldown",
      "Squat",
      "Bulgarian Squat",
      "Lat Pulldown",
      "Squat",
      "Bulgarian Squat",
      "Bulgarian Squat",
      "Lat Pulldown",
      "Squat",
      "Bulgarian Squat",
      "Lat Pulldown",
      "Squat",
      "Bulgarian Squat",
      "Bulgarian Squat",
      "Lat Pulldown",
      "Squat",
      "Bulgarian Squat",
      "Lat Pulldown",
      "Squat",
      "Bulgarian Squat",
    ];

    // Filter exercises if any filter exists
    return exercises.filter((exercise) => {
      if (filteredExercise) {
        return exercise.startsWith(filteredExercise);
      }

      return true;
    });
  }, [filteredExercise]);

  // Debounce user input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredExercise(searched);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searched]);

  return (
    <View className="mt-4 border border-secondary overflow-hidden rounded-xl">
      <TextInput
        onChangeText={setSearched}
        className="border-b border-b-secondary p-2"
        placeholder="Egzersiz arat"
      />
      <ScrollView className="h-48   p-2 bg-gray/50">
        <View className="flex flex-row pb-6 flex-wrap">
          <Exercises
            setSelectedExercise={setSelectedExercise}
            selectedExercise={selectedExercise}
            exercises={exercises}
          />
        </View>
      </ScrollView>
    </View>
  );
}
