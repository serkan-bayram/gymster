import { AppDispatch } from "@/utils/state/store";
import { setWeight } from "@/utils/state/workout/workoutSlice";
import { TextInput, View } from "react-native";
import { useDispatch } from "react-redux";

export function ExerciseWeight() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View className="mt-4">
      <TextInput
        onChangeText={(text) => dispatch(setWeight(text))}
        keyboardType="numeric"
        className="p-2 bg-white border border-secondary rounded-lg"
        placeholder="Bu setteki ağırlığın kaç?"
      />
    </View>
  );
}
