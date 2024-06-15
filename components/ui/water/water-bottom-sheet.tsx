import { Text, View } from "react-native";
import { PrimaryButton } from "../../primary-button";
import { BottomSheetView, BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefObject, useRef, useState } from "react";
import { WaterPickers } from "./water-pickers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { setGoalValue, setUpdateValue } from "@/utils/state/water/waterSlice";

// Content of bottom sheet for water section
export function WaterBottomSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  // Picker refs
  const updatePickerRef = useRef<any>(null);
  const goalPickerRef = useRef<any>(null);

  const { updateValue, goalValue } = useSelector(
    (state: RootState) => state.water
  );
  const dispatch = useDispatch<AppDispatch>();

  // Values that picked from picker
  const [pickedUpdateValue, setPickedUpdateValue] = useState<string>(
    updateValue.toString()
  );
  const [pickedGoalValue, setPickedGoalValue] = useState<string>(
    goalValue.toString()
  );

  const handleSave = () => {
    dispatch(setUpdateValue(parseInt(pickedUpdateValue)));
    dispatch(setGoalValue(parseInt(pickedGoalValue)));

    bottomSheetRef?.current?.dismiss();
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
              <Text className="text-lg font-bold">Güncelleme Değeri</Text>
              <PrimaryButton
                onPress={() => updatePickerRef.current?.focus()}
                text={`${pickedUpdateValue} ml`}
                type="outlined"
                className="active:scale-105 ease-in-out transition-all w-1/3"
              />
            </View>

            <View className="flex flex-row items-center justify-between">
              <Text className="text-lg font-bold">Günlük Hedef</Text>
              <PrimaryButton
                onPress={() => goalPickerRef.current?.focus()}
                text={`${pickedGoalValue} ml`}
                type="outlined"
                className="active:scale-105 ease-in-out transition-all w-1/3"
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
              onPress={() => bottomSheetRef?.current?.dismiss()}
              text="Vazgeç"
              type="danger"
              className="w-1/3"
            />
            <PrimaryButton
              onPress={handleSave}
              text="Kaydet"
              className="w-1/3"
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
