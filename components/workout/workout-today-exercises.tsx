import { ScrollView } from "react-native-gesture-handler";
import { Exercise } from "./exercise";
import { useGetTodaysWorkouts } from "@/utils/apis/workout";
import * as Crypto from "expo-crypto";
import { Text, View } from "react-native";

export function WorkoutTodayExercises() {
  const { data: todaysWorkouts, isPending } = useGetTodaysWorkouts();

  const exercises = todaysWorkouts?.todaysWorkouts;

  if (isPending) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

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
