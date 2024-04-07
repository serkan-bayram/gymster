import { Pressable, Text, View } from "react-native";
import { ProgressBar } from "./ui/circular-progressbar";
import { useRef, useState } from "react";
import { UpdateWaterValue } from "./ui/update-water-value";
import { EditSvg } from "./ui/svg";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { PrimaryButton } from "./primary-button";

const DEFAULT_UPDATE_VALUE = 200;
const DEFAULT_GOAL = 2000;

// TODO: This component does not work well when update, goal values are changed.
export function Water() {
  const [progress, setProgress] = useState(300);

  const bottomSheetRef = useRef(null);

  const [updateValue, setUpdateValue] = useState(DEFAULT_UPDATE_VALUE);
  const [goalValue, setGoalValue] = useState(DEFAULT_GOAL);

  const updatePickerRef = useRef();
  const goalPickerRef = useRef();

  return (
    <>
      <View className="flex-1 mt-2 ">
        <View className="flex flex-row px-4 justify-between items-center">
          <Text className="text-lg mb-2">Hydration</Text>
          <Pressable onPress={() => bottomSheetRef.current.expand()}>
            <EditSvg width={"25"} height={"25"} fill={"black"} />
          </Pressable>
        </View>
        <View className="flex-1 flex-row px-4  gap-y-2">
          <ProgressBar progress={progress} goal={goalValue} />
          <UpdateWaterValue
            updateValue={updateValue}
            goalValue={goalValue}
            progress={progress}
            setProgress={setProgress}
          />
        </View>
      </View>
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
              />
              <PrimaryButton text="Save" />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
