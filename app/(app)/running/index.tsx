import { Heading } from "@/components/heading";
import { StartRunning } from "@/components/running/start-running";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { RunningCounter } from "@/components/running/running-counter";
import { CounterControllers } from "@/components/running/counter-controllers";
import { RunningStats } from "@/components/running/running-stats";
import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import { AppDispatch, RootState, store } from "@/utils/state/store";
import { setLocation } from "@/utils/state/location/locationSlice";
import { MemoizedRuns } from "@/components/running/runs";
import {
  LOCATION_TASK_NAME,
  saveRun,
  stopRunning,
} from "@/utils/state/running/runningSlice";
import { useDispatch, useSelector } from "react-redux";

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({
    data,
    error,
  }: {
    data: {
      locations: LocationObject[];
    };
    error: any;
  }) => {
    if (error) {
      console.log("Error on LocationTask: ", error);
      return;
    }

    if (data) {
      const { latitude, longitude } = data.locations[0].coords;

      store.dispatch(setLocation({ latitude: latitude, longitude: longitude }));
    }
  }
);

export type RunTime = {
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Running() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const dispatch = useDispatch<AppDispatch>();

  const handleStop = () => {
    dispatch(stopRunning());

    dispatch(saveRun());
  };

  return (
    <View className="pt-16 pb-20 px-4 bg-background flex-1">
      <Heading heading={"Koşu"} />

      <StartRunning bottomSheetRef={bottomSheetRef} />

      <BottomSheetModal
        handleStyle={{ display: "none" }}
        enablePanDownToClose={false}
        snapPoints={[700]}
        ref={bottomSheetRef}
      >
        <BottomSheetScrollView stickyHeaderIndices={[0]}>
          <View className="px-6 bg-white pb-4">
            <View className="mt-6 flex flex-row justify-between items-center">
              <RunningCounter />

              <CounterControllers handlePress={handleStop} />
            </View>
          </View>
          <View className="p-4 px-6 pt-0">
            <View className="h-[1px] w-full bg-gray my-6"></View>

            <RunningStats />

            <MemoizedRuns />
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
