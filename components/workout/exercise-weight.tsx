import { TextInput, View } from "react-native";

export function ExerciseWeight() {
  return (
    <View className="mt-4">
      <TextInput
        keyboardType="numeric"
        className="p-2 bg-white border border-secondary rounded-lg"
        placeholder="Bu setteki ağırlığın kaç?"
      />
    </View>
  );
}
