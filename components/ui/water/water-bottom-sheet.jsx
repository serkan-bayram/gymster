import { Text, View } from "react-native";
import { PrimaryButton } from "../../primary-button";
import { BottomSheetView, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { WaterPickers } from "./water-pickers";
import { useWater } from "@/utils/water-context";

// Content of bottom sheet for water section
export function WaterBottomSheet({ bottomSheetRef }) {
  // Picker refs
  const updatePickerRef = useRef(null);
  const goalPickerRef = useRef(null);

  const { updateValue, setUpdateValue, goalValue, setGoalValue } = useWater();

  // Values that picked from picker
  const [pickedUpdateValue, setPickedUpdateValue] = useState(updateValue);
  const [pickedGoalValue, setPickedGoalValue] = useState(goalValue);

  const handleSave = () => {
    setUpdateValue(parseInt(pickedUpdateValue));
    setGoalValue(parseInt(pickedGoalValue));

    bottomSheetRef.current.dismiss();
  };

  return (
    <BottomSheetModal
      enablePanDownToClose={true}
      snapPoints={[500]}
      ref={bottomSheetRef}
    >
      <BottomSheetView className="flex-1">
        <View className="p-5">
          <View className="flex gap-y-8">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-bold">Update Value</Text>
              <PrimaryButton
                onPress={() => updatePickerRef.current.focus()}
                text={`${pickedUpdateValue} ml`}
                type="outlined"
                className="active:scale-105 ease-in-out transition-all w-1/2"
              />
            </View>

            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-bold">Goal</Text>
              <PrimaryButton
                onPress={() => goalPickerRef.current.focus()}
                text={`${pickedGoalValue} ml`}
                type="outlined"
                className="active:scale-105 ease-in-out transition-all w-1/2"
              />
            </View>

            <WaterPickers
              pickedGoalValue={pickedGoalValue}
              pickedUpdateValue={pickedUpdateValue}
              setPickedGoalValue={setPickedGoalValue}
              setPickedUpdateValue={setPickedUpdateValue}
              updatePickerRef={updatePickerRef}
              goalPickerRef={goalPickerRef}
            />
          </View>

          <View className="flex flex-row justify-center items-center mt-16 gap-x-6 ">
            <PrimaryButton
              onPress={() => bottomSheetRef.current.dismiss()}
              text="Cancel"
              type="danger"
              className="w-1/3"
            />
            <PrimaryButton onPress={handleSave} text="Save" className="w-1/3" />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
