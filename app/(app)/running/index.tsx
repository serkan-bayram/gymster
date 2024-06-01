import { Heading } from "@/components/heading";
import { StartRunning } from "@/components/running/start-running";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { RunningCounter } from "@/components/running/running-counter";
import { CounterControllers } from "@/components/running/counter-controllers";
import { RunningStats } from "@/components/running/running-stats";

import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "running-location-task";

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  ({ data, error }: { data: any; error: any }) => {
    if (error) {
      console.log("Error: ", error);
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data;

      console.log("locations: ", locations);
      // do something with the locations captured in the background
    }
  }
);

export type RunTime = {
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Running() {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View className="pt-16 pb-20 px-4 bg-background flex-1">
      <Heading heading={"Koşu"} />

      <StartRunning
        taskName={LOCATION_TASK_NAME}
        bottomSheetRef={bottomSheetRef}
      />

      <BottomSheetModal
        handleStyle={{ display: "none" }}
        enablePanDownToClose={false}
        snapPoints={[700]}
        ref={bottomSheetRef}
      >
        <BottomSheetView className="flex-1 ">
          <View className="p-4 px-6 ">
            <View className="mt-6 flex flex-row justify-between items-center">
              <RunningCounter isRunning={isRunning} />

              <CounterControllers
                isRunning={isRunning}
                setIsRunning={setIsRunning}
              />
            </View>

            <View className="h-[1px] w-full bg-gray my-6"></View>

            <RunningStats />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
