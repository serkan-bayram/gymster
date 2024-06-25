import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { AddExtraWorkoutBottomSheet } from "./add-extra-workout-bottom-sheet";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export function AddExtraWorkout() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <>
      <View>
        <TouchableOpacity
          onPress={() => bottomSheetRef?.current?.present()}
          className="bg-[#B0EBB4] items-center flex flex-row
       justify-between p-3  rounded-xl mt-5"
        >
          <Text className="font-semibold">Özel Egzersizler</Text>
          <AntDesign name="ellipsis1" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <AddExtraWorkoutBottomSheet bottomSheetRef={bottomSheetRef} />
    </>
  );
}
