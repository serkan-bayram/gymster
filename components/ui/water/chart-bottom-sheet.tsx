import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { RefObject } from "react";
import { WaterChart } from "./water-chart";
import { View } from "react-native";
import { useCloseBottomSheetOnBackPressed } from "@/utils/bottomsheet";

export function ChartBottomSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheetModal>;
}) {
  const setIndex = useCloseBottomSheetOnBackPressed(bottomSheetRef);

  return (
    <BottomSheetModal
      enablePanDownToClose={true}
      snapPoints={[400]}
      ref={bottomSheetRef}
      // https://github.com/gorhom/react-native-bottom-sheet/issues/770#issuecomment-1072113936
      // These two lines makes chart horizontal scrollable
      activeOffsetX={[-999, 999]}
      activeOffsetY={[-20, 20]}
      onChange={(index) => setIndex(index)}
    >
      <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-80">
          <WaterChart />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
