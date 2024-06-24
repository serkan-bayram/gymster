import {
  getSnapPoints,
  useCloseBottomSheetOnBackPressed,
} from "@/utils/bottomsheet";
import { Divider } from "@/components/ui/divider";
import { RunningButtons } from "@/components/running/running-buttons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { RefObject, useCallback, useState } from "react";
import { Alert, View } from "react-native";
import { RunningCounter } from "./running-counter";
import { CounterControllers } from "./counter-controllers";
import { RunningStats } from "./running-stats";
import { Runs } from "./runs";
import {
  discardRun,
  resetRunningState,
  stopRunning,
} from "@/utils/state/running/runningSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/utils/state/store";

export function BottomSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  const snapPoints = getSnapPoints();

  const dispatch = useDispatch<AppDispatch>();

  // Is user decided to discard run
  const [isStop, setIsStop] = useState(false);

  // This will run when user pressed back button
  const runOnBackPress = () => {
    handleDiscard();

    // If user doesn't want to stop
    if (!isStop) {
      // Don't close bottomsheet
      return false;
    }

    // Close bottom sheet
    return true;
  };

  const setIndex = useCloseBottomSheetOnBackPressed(
    bottomSheetRef,
    runOnBackPress
  );

  const stopEverything = () => {
    // Stop tracking location
    dispatch(stopRunning());

    // Set everything to initialData
    dispatch(discardRun());

    bottomSheetRef?.current?.close();
  };

  const handleDiscard = () => {
    Alert.alert(
      "Vazgeç",
      "Vazgeçerseniz mevcut koşu verileriniz silinecektir, emin misiniz?",
      [
        {
          text: "Verileri Sil",
          onPress: () => {
            stopEverything();
            setIsStop(true);
          },
        },
        {
          text: "Koşuya Devam",
        },
      ]
    );
  };

  const handleSheetChanges = useCallback((index: number) => {
    setIsStop(false);

    dispatch(resetRunningState());
    setIndex(index);
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

        <RunningButtons
          handleDiscard={handleDiscard}
          stopEverything={stopEverything}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
