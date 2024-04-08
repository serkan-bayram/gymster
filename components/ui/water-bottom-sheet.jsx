import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Text, View } from "react-native";
import { PrimaryButton } from "../primary-button";
import { Picker } from "@react-native-picker/picker";

export function WaterBottomSheet({ bottomSheetRef }) {
  return (
    <BottomSheet
      index={-1}
      enablePanDownToClose={true}
      snapPoints={[100, 500]}
      ref={bottomSheetRef}
    >
      <BottomSheetView className="flex-1">
        <View className="p-5">
          <View className="flex gap-y-8">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-bold">Update Value</Text>
              <PrimaryButton
                onPress={() => updatePickerRef.current.focus()}
                text={`${updateValue} ml`}
                type="outlined"
                className="active:scale-105 ease-in-out transition-all w-1/2"
              />
            </View>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-bold">Goal</Text>
              <PrimaryButton
                onPress={() => goalPickerRef.current.focus()}
                text={`${goalValue} ml`}
                type="outlined"
                className="active:scale-105 ease-in-out transition-all w-1/2"
              />
            </View>
            <View className="hidden">
              <Picker
                ref={updatePickerRef}
                selectedValue={updateValue}
                onValueChange={(itemValue, itemIndex) =>
                  setUpdateValue(itemValue)
                }
              >
                <Picker.Item label="200 ml" value="200" />
                <Picker.Item label="300 ml" value="300" />
                <Picker.Item label="500 ml" value="500" />
                <Picker.Item label="1000 ml" value="1000" />
              </Picker>
              <Picker
                ref={goalPickerRef}
                selectedValue={goalValue}
                onValueChange={(itemValue, itemIndex) =>
                  setGoalValue(itemValue)
                }
              >
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
          </View>
          <View className="flex flex-row justify-center items-center mt-16 gap-x-6 ">
            <PrimaryButton
              onPress={() => bottomSheetRef.current.close()}
              text="Cancel"
              type="danger"
              className="w-1/3"
            />
            <PrimaryButton text="Save" className="w-1/3" />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
