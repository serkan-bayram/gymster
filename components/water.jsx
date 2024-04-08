import { Pressable, Text, View } from "react-native";
import { ProgressBar } from "./ui/circular-progressbar";
import { useRef, useState } from "react";
import { UpdateWaterValue } from "./ui/update-water-value";
import { EditSvg } from "./ui/svg";
import { Picker } from "@react-native-picker/picker";
import { PrimaryButton } from "./primary-button";
import { WaterContent } from "./ui/water-content";
import { WaterHeading } from "./ui/water-heading";
import { WaterBottomSheet } from "./ui/water-bottom-sheet";

// Increase or decrase the progress by 200 ml
export const DEFAULT_UPDATE_VALUE = 200;
// Default goal is 2000 ml
export const DEFAULT_GOAL = 2000;

// TODO: This component does not work well when update, goal values are changed.
export function Water() {
  // const bottomSheetRef = useRef(null);

  // const [updateValue, setUpdateValue] = useState(DEFAULT_UPDATE_VALUE);
  // const [goalValue, setGoalValue] = useState(DEFAULT_GOAL);

  // const updatePickerRef = useRef();
  // const goalPickerRef = useRef();

  return (
    <>
      <View className="flex-1 mt-2 ">
        {/* <WaterHeading bottomSheetRef={bottomSheetRef} /> */}
        <WaterContent />
      </View>
      {/* <WaterBottomSheet /> */}
    </>
  );
}
