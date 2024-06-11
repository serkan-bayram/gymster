import { ScrollView } from "react-native-gesture-handler";
import { Exercise } from "./exercise";
import { useGetTodaysWorkouts } from "@/utils/apis/workout";
import { View } from "react-native";

export function WorkoutTodayExercises() {
  const todaysWorkouts = useGetTodaysWorkouts();

  console.log("Todays Workouts: ", todaysWorkouts?.data);

  return (
    <ScrollView className="mt-4">
      <Exercise exercise="Chest Presssss" set={{ setCount: 3, repeat: 32 }} />
      <Exercise exercise="Chest Presssss" set={{ setCount: 3, repeat: 32 }} />
      <Exercise exercise="Chest Presssss" set={{ setCount: 3, repeat: 32 }} />
      <Exercise exercise="Chest Presssss" set={{ setCount: 3, repeat: 32 }} />
      <Exercise exercise="Chest Presssss" set={{ setCount: 3, repeat: 32 }} />
      <Exercise exercise="Chest Presssss" set={{ setCount: 3, repeat: 32 }} />
      <Exercise exercise="Chest Presssss" set={{ setCount: 3, repeat: 32 }} />
      <Exercise exercise="Chest Presssss" set={{ setCount: 3, repeat: 32 }} />
    </ScrollView>
  );
}
