import { Heading } from "@/components/heading";
import { StartRunning } from "@/components/running/start-running";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { RunningCounter } from "@/components/running/running-counter";
import { CounterControllers } from "@/components/running/counter-controllers";
import { RunningStats } from "@/components/running/running-stats";
import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import { store } from "@/utils/state/store";
import { setLocation } from "@/utils/state/location/locationSlice";
import { Runs } from "@/components/running/runs";
import { LOCATION_TASK_NAME } from "@/utils/state/running/runningSlice";

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
        <BottomSheetView className="flex-1 ">
          <View className="p-4 px-6 ">
            <View className="mt-6 flex flex-row justify-between items-center">
              <RunningCounter />

              <CounterControllers />
            </View>

            <View className="h-[1px] w-full bg-gray my-6"></View>

            <RunningStats />

            {[].length > 0 && (
              <>
                <View className="h-[1px] w-full bg-gray my-6"></View>

                <Runs />
              </>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
