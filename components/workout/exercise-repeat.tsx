import { AppDispatch } from "@/utils/state/store";
import { setAddingWorkout } from "@/utils/state/workout/workoutSlice";
import { TextInput, View } from "react-native";
import { useDispatch } from "react-redux";

export function ExerciseRepeat() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View className="mt-4">
      <TextInput
        onChangeText={(text) =>
          dispatch(
            setAddingWorkout({ type: "repeat", repeat: parseFloat(text) })
          )
        }
        keyboardType="numeric"
        className="p-2 bg-white border border-secondary rounded-lg"
        placeholder="Bu sette kaç tekrar yaptın?"
      />
    </View>
  );
}
