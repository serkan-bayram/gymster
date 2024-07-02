import { KeyboardAvoidingView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Exercise } from "@/components/workout/exercise";
import * as Crypto from "expo-crypto";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { ReactNode, memo, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { AllWorkouts } from "@/utils/types/workout";

const MemoizedPastWorkouts = memo(
  ({
    filteredWorkouts,
    workouts,
  }: {
    filteredWorkouts: AllWorkouts[] | null;
    workouts: AllWorkouts[] | null;
  }) => {
    const isAllEmpty =
      filteredWorkouts?.filter((workout) => workout.workout.length > 0) || [];

    return filteredWorkouts && isAllEmpty.length > 0 ? (
      filteredWorkouts.map((workout, index) => {
        if (workout.workout.length <= 0) {
          return null;
        }

        const documentPath = workout.documentPath;

        return (
          <>
            <View key={Crypto.randomUUID()} className="mt-3">
              <View className="flex flex-row items-center mb-2">
                <Feather name="calendar" size={20} color="black" />
                <Text className="ml-1 font-semibold text-lg">
                  {`${workout.date.day} ${workout.date.month}`}
                </Text>
              </View>

              {workout.workout.map((work) => (
                <Exercise
                  key={Crypto.randomUUID()}
                  workout={workout.workout}
                  documentPath={documentPath}
                  exercise={work}
                  darkMode={true}
                />
              ))}
            </View>
            <View key={Crypto.randomUUID()}>
              {index + 1 === filteredWorkouts.length && (
                <View className="w-full mt-4 items-center ">
                  <Text className="text-black/50">
                    Silmek için basılı tutun.
                  </Text>
                </View>
              )}
            </View>
          </>
        );
      })
    ) : (
      <View className="w-full mt-12 items-center ">
        <Text className="text-black/50">Antrenman bulunamadı.</Text>
      </View>
    );
  }
);

export function PastWorkouts() {
  // Select all workouts from the Redux store
  const workouts = useSelector((state: RootState) => state.workout.allWorkouts);

  // State to manage whether the search bar is focused
  const [isSearchBarFocused, setIsSearchBarFocused] = useState<boolean>(false);

  // State to manage the search input
  const [search, setSearch] = useState<string | null>(null);

  // State to manage the filtered list of workouts based on the search input
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts);

  // Select default exercises from the Redux store
  const { defaultExercises } = useSelector((state: RootState) => state.workout);

  // Effect to filter workouts based on the search input
  useEffect(() => {
    // Debounce the filtering to improve performance
    const debounce = setTimeout(() => {
      // Filter workouts based on the search input
      const filtered = workouts?.filter((workout) => {
        // Filter exercises within a workout based on the search input
        const matchingExercises = workout.workout.filter((w) => {
          // Find the exercise name by matching the exercise ID
          const exerciseName =
            defaultExercises?.exercises.find((ex) => w.exerciseId === ex.id)
              ?.name || "";

          // Check if the exercise name includes the search input
          return search ? exerciseName.includes(search) : true;
        });

        // Return true if there are any matching exercises
        return matchingExercises.length > 0;
      });

      // Update the filtered workouts state
      setFilteredWorkouts(filtered || workouts);
    }, 600);

    // Cleanup function to clear the debounce timeout
    return () => {
      if (debounce) clearTimeout(debounce);
    };
    // Effect dependency array - re-run the effect when 'search' changes
  }, [search, workouts]);

  return (
    <>
      <View className="flex flex-row justify-between items-center">
        {!isSearchBarFocused && (
          <Text className="text-xl font-bold ">Geçmiş Antrenmanlar</Text>
        )}
        <View
          className={cn(
            "flex-1 flex flex-row justify-between px-1 rounded-lg py-2 border-gray border-2 mx-2",
            { "mx-0": isSearchBarFocused }
          )}
        >
          <TextInput
            blurOnSubmit={true}
            onChangeText={setSearch}
            onFocus={() => {
              setIsSearchBarFocused(true);
            }}
            onBlur={() => setIsSearchBarFocused(false)}
            placeholder="Ara"
            className="pl-1 w-[70%]"
          />
          <View className="flex justify-center">
            <FontAwesome name="search" size={24} color="gray" />
          </View>
        </View>
      </View>
      <MemoizedPastWorkouts
        workouts={workouts}
        filteredWorkouts={filteredWorkouts}
      />
    </>
  );
}
