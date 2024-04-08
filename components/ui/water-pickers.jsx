import { Picker } from "@react-native-picker/picker";
import { View } from "react-native";

export function WaterPickers({
  pickedUpdateValue,
  pickedGoalValue,
  setPickedUpdateValue,
  setPickedGoalValue,
  updatePickerRef,
  goalPickerRef,
}) {
  return (
    <View className="hidden">
      <Picker
        ref={updatePickerRef}
        selectedValue={pickedUpdateValue}
        onValueChange={(itemValue) =>
          setPickedUpdateValue((prevValue) => {
            if (itemValue !== "none") {
              return itemValue;
            } else {
              return prevValue;
            }
          })
        }
      >
        <Picker.Item label="Cancel" value="none" />
        <Picker.Item label="200 ml" value="200" />
        <Picker.Item label="300 ml" value="300" />
        <Picker.Item label="500 ml" value="500" />
        <Picker.Item label="1000 ml" value="1000" />
      </Picker>

      <Picker
        ref={goalPickerRef}
        selectedValue={pickedGoalValue}
        onValueChange={(itemValue) =>
          setPickedGoalValue((prevValue) => {
            if (itemValue !== "none") {
              return itemValue;
            } else {
              return prevValue;
            }
          })
        }
      >
        <Picker.Item label="Cancel" value="none" />
        <Picker.Item label="500 ml" value="500" />
        <Picker.Item label="1000 ml" value="1000" />
        <Picker.Item label="1500 ml" value="1500" />
        <Picker.Item label="2000 ml" value="2000" />
        <Picker.Item label="2500 ml" value="2500" />
        <Picker.Item label="3000 ml" value="3000" />
        <Picker.Item label="4000 ml" value="4000" />
        <Picker.Item label="5000 ml" value="5000" />
      </Picker>
    </View>
  );
}
