import { ScrollView } from "react-native-gesture-handler";
import { Exercise } from "./exercise";
import * as Crypto from "expo-crypto";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";

export function WorkoutTodayExercises() {
  const todaysWorkouts = useSelector(
    (state: RootState) => state.workout.todaysWorkouts
  );

  const exercises = todaysWorkouts?.todaysWorkouts;

  return (
    <ScrollView className="mt-4">
      {exercises &&
        exercises.map((exercise) => {
          return (
            <Exercise
              workout={todaysWorkouts.todaysWorkouts}
              documentPath={todaysWorkouts.documentPath}
              key={Crypto.randomUUID()}
              exercise={exercise}
            />
          );
        })}
      <View>
        {exercises && exercises.length > 0 && (
          <Text className="text-white text-center text-xs">
            *Bir egzersizi silmek için basılı tutun.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
