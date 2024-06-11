import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ExercisePicker } from "@/components/workout/exercise-picker";
import { PrimaryButton } from "@/components/primary-button";
import { ExerciseWeight } from "@/components/workout/exercise-weight";
import { ExerciseRepeat } from "@/components/workout/exercise-repeat";
import { RefObject, useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WorkoutBottomSheetInputs } from "./workout-bottomsheet-inputs";

export function WorkoutBottomSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  // TODO: We can move these bottom sheet properties to one file
  const snapPoints = useMemo(() => ["100%"], []);
  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        opacity={0.5}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"none"}
        style={[
          { backgroundColor: "rgba(0, 0, 0, 1)" },
          StyleSheet.absoluteFillObject,
        ]}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      handleStyle={{ display: "none" }}
      enablePanDownToClose={false}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View className="flex-1 px-4">
          <WorkoutBottomSheetInputs />

          <View className="flex flex-row gap-x-3 mt-auto pb-6">
            <PrimaryButton
              onPress={() => bottomSheetRef?.current?.dismiss()}
              type="outlined"
              text="Vazgeç"
            />
            <PrimaryButton text="Kaydet" className="flex-1" />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
