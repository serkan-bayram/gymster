import { ScrollView } from "react-native-gesture-handler";
import { Exercise } from "./exercise";

export function WorkoutTodayExercises() {
  return (
    <ScrollView className="mt-4">
      <Exercise exercise="Chest Presssss" set={{ setCount: 3, repeat: 32 }} />
    </ScrollView>
  );
}
