import { Pressable, Text, View } from "react-native";
import { ProgressBar } from "./ui/circular-progressbar";
import { useCallback, useRef, useState } from "react";
import { UpdateWaterValue } from "./ui/update-water-value";
import { EditSvg } from "./ui/svg";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const DEFAULT_UPDATE_VALUE = 200;
const DEFAULT_GOAL = 2000;

export function Water() {
  const [progress, setProgress] = useState(0);

  const bottomSheetRef = useRef(null);

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
          <ProgressBar progress={progress} goal={DEFAULT_GOAL} />
          <UpdateWaterValue
            DEFAULT_GOAL={DEFAULT_GOAL}
            DEFAULT_UPDATE_VALUE={DEFAULT_UPDATE_VALUE}
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
          <View className="p-2">
            <View>
              <Text>Default update value</Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
