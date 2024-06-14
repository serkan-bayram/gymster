import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { PrimaryButton } from "@/components/primary-button";
import { RefObject } from "react";
import { View } from "react-native";
import { WorkoutBottomSheetInputs } from "./workout-bottomsheet-inputs";
import { getBackdrop, getSnapPoints } from "@/utils/bottomsheet";

export function WorkoutBottomSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  const snapPoints = getSnapPoints();
  const renderBackdrop = getBackdrop();

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
          <WorkoutBottomSheetInputs bottomSheetRef={bottomSheetRef} />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
