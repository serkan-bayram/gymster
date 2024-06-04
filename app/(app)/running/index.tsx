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
import { store } from "@/utils/state/store";
import { Runs } from "@/components/running/runs";
import {
  LOCATION_TASK_NAME,
  setStats,
} from "@/utils/state/running/runningSlice";
import { Divider } from "@/components/ui/divider";
import { RunningButtons } from "@/components/running/running-buttons";
import { PastRuns } from "@/components/running/past-runs";
import { ScrollView } from "react-native-gesture-handler";

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
      // Get location data in the background
      const { latitude, longitude } = data.locations[0].coords;
      const { timestamp } = data.locations[0];

      store.dispatch(
        setStats({
          latitude: latitude,
          longitude: longitude,
          timestamp: timestamp,
        })
      );
    }
  }
);

// TODO: Does it calculate distance and averageSpeed in the background
// TODO: Add ability to delete runs
export default function Running() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <ScrollView className="pt-16 pb-20 px-4 bg-background flex-1 ">
      <Heading heading={"Koşu"} />

      <StartRunning bottomSheetRef={bottomSheetRef} />

      <PastRuns />

      <BottomSheetModal
        handleStyle={{ display: "none" }}
        enablePanDownToClose={false}
        snapPoints={[700]}
        ref={bottomSheetRef}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          stickyHeaderIndices={[0]}
        >
          <View className="px-6 bg-white pb-3 ">
            <View className="mt-6 flex  flex-row justify-between items-center">
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
    </ScrollView>
  );
}
