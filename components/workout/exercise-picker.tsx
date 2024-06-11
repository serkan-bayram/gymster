import { Pressable, Text, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import * as Crypto from "expo-crypto";
import { memo, useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { setExercise } from "@/utils/state/workout/workoutSlice";
import { DefaultExercise } from "@/utils/types/workout";

const Exercise = ({ exercise }: { exercise: DefaultExercise }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handlePress = () => {
    dispatch(setExercise({ id: exercise.id, name: exercise.name }));
  };

  const addingWorkout = useSelector(
    (state: RootState) => state.workout.addingWorkout
  );

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        "bg-white border-2 border-gray/50 active:bg-[#d0f4de]/50 transition-all p-2 px-3 rounded-md m-1",
        {
          "bg-[#d0f4de] border-2 border-[#2a9d8f]":
            addingWorkout.exerciseId === exercise.id,
        }
      )}
    >
      <Text>{exercise.name}</Text>
    </Pressable>
  );
};

const Exercises = memo(({ exercises }: { exercises: DefaultExercise[] }) => {
  return exercises.map((exercise) => (
    <Exercise key={Crypto.randomUUID()} exercise={exercise} />
  ));
});

export function ExercisePicker({
  defaultExercises,
}: {
  defaultExercises: DefaultExercise[];
}) {
  // User input
  const [searched, setSearched] = useState<string | null>(null);

  // basically debounced searched
  const [filteredExercise, setFilteredExercise] = useState<string | null>(null);

  const exercises = useMemo(() => {
    // Filter exercises if any filter exists
    return defaultExercises.filter((exercise) => {
      if (filteredExercise) {
        return exercise.name.startsWith(filteredExercise);
      }

      return true;
    });
  }, [filteredExercise, defaultExercises]);

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
          <Exercises exercises={exercises} />
        </View>
      </ScrollView>
    </View>
  );
}
