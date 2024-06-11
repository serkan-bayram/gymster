import { Text, View } from "react-native";
import { ExercisePicker } from "./exercise-picker";
import { ExerciseWeight } from "./exercise-weight";
import { ExerciseRepeat } from "./exercise-repeat";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/utils/state/store";
import { useEffect } from "react";
import { resetAddingWorkout } from "@/utils/state/workout/workoutSlice";
import { useGetDefaultExercises } from "@/utils/apis/workout";

export function WorkoutBottomSheetInputs() {
  const dispatch = useDispatch<AppDispatch>();

  // Reset state when bottomsheet reopens
  useEffect(() => {
    dispatch(resetAddingWorkout());
  }, []);

  const defaultExercises = useGetDefaultExercises();

  if (defaultExercises.isPending) {
    return <Text>Yükleniyor...</Text>;
  }

  return (
    <>
      <View className="mt-16">
        <Text className="font-bold text-xl">Hareket Ekle</Text>
      </View>

      <View className="mt-4">
        <Text className="text-lg">Hareketi Seç</Text>
        <ExercisePicker
          defaultExercises={defaultExercises.data ? defaultExercises.data : []}
        />
      </View>

      <View className="mt-4">
        <Text className="text-lg">Ağırlık</Text>
        <ExerciseWeight />
      </View>

      <View className="mt-4 mb-4">
        <Text className="text-lg">Tekrar</Text>
        <ExerciseRepeat />
      </View>
    </>
  );
}
