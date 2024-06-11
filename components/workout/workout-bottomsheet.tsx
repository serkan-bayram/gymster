import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { PrimaryButton } from "@/components/primary-button";
import { RefObject } from "react";
import { View } from "react-native";
import { WorkoutBottomSheetInputs } from "./workout-bottomsheet-inputs";
import { getBackdrop, getSnapPoints } from "@/utils/bottomsheet";
import { useSaveWorkout } from "@/utils/apis/workout";

export function WorkoutBottomSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  const snapPoints = getSnapPoints();
  const renderBackdrop = getBackdrop();

  const saveWorkout = useSaveWorkout();

  const handleSave = () => {
    saveWorkout.mutate();
  };

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      handleStyle={{ display: "none" }}
      enablePanDownToClose={false}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
    >
      <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-4 ">
          <WorkoutBottomSheetInputs />

          <View className="flex flex-row gap-x-3 mt-auto pb-6">
            <PrimaryButton
              onPress={() => bottomSheetRef?.current?.dismiss()}
              type="outlined"
              text="Vazgeç"
            />
            <PrimaryButton
              onPress={handleSave}
              text="Kaydet"
              className="flex-1"
            />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
