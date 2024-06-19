import { AppDispatch } from "@/utils/state/store";
import { setAddingWorkout } from "@/utils/state/workout/workoutSlice";
import { TextInput, View } from "react-native";
import { useDispatch } from "react-redux";

export function ExerciseComment() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View className="mt-1">
      <TextInput
        onChangeText={(text) =>
          dispatch(setAddingWorkout({ type: "comment", comment: text }))
        }
        className="p-2 bg-white border border-secondary rounded-lg"
        placeholder="Hareketin nasıl geçti?"
      />
    </View>
  );
}
