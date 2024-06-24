import { getSnapPoints } from "@/utils/bottomsheet";
import { Divider } from "@/components/ui/divider";
import { RunningButtons } from "@/components/running/running-buttons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { RefObject, useCallback } from "react";
import { View } from "react-native";
import { RunningCounter } from "./running-counter";
import { CounterControllers } from "./counter-controllers";
import { RunningStats } from "./running-stats";
import { Runs } from "./runs";
import { resetRunningState } from "@/utils/state/running/runningSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/utils/state/store";

export function BottomSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  const snapPoints = getSnapPoints();
  const dispatch = useDispatch<AppDispatch>();

  const handleSheetChanges = useCallback(() => {
    dispatch(resetRunningState());
  }, []);

  return (
    <BottomSheetModal
      handleStyle={{ display: "none" }}
      enablePanDownToClose={false}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        <View className="px-6 bg-white pb-3 ">
          <View className="mt-16 flex  flex-row justify-between items-center">
            <RunningCounter />

            <CounterControllers />
          </View>
        </View>

        <Divider type="horizontal" dividerClassName="my-5 mt-2 mx-6 " />

        <View className="p-4 px-4 pt-0">
          <RunningStats />

          <Runs />
        </View>

        <RunningButtons bottomSheetRef={bottomSheetRef} />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
