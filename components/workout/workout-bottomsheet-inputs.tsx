import { Text, View } from "react-native";
import { ExercisePicker } from "./exercise-picker";
import { ExerciseWeight } from "./exercise-weight";
import { ExerciseRepeat } from "./exercise-repeat";

export function WorkoutBottomSheetInputs() {
  return (
    <>
      <View className="mt-8">
        <Text className="font-bold text-xl">Hareket Ekle</Text>
      </View>

      <View className="mt-4">
        <Text className="text-lg">Hareketi Seç</Text>
        <ExercisePicker />
      </View>

      <View className="mt-4">
        <Text className="text-lg">Ağırlık</Text>
        <ExerciseWeight />
      </View>

      <View className="mt-4">
        <Text className="text-lg">Tekrar</Text>
        <ExerciseRepeat />
      </View>
    </>
  );
}
