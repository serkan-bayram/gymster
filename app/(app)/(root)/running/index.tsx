import { Heading } from "@/components/heading";
import { StartRunning } from "@/components/running/start-running";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import * as TaskManager from "expo-task-manager";
import { LocationObject } from "expo-location";
import { store } from "@/utils/state/store";
import {
  LOCATION_TASK_NAME,
  setLocations,
} from "@/utils/state/running/runningSlice";
import { PastRuns } from "@/components/running/past-runs";
import { ScrollView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { FullScreenLoading } from "@/components/loading";
import { useGetRuns } from "@/utils/apis/runs";
import { BottomSheet } from "@/components/running/bottom-sheet";

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
        setLocations({
          latitude: latitude,
          longitude: longitude,
          timestamp: timestamp,
        })
      );
    }
  }
);

export default function Running() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const getRuns = useGetRuns();

  if (getRuns.isPending) {
    return <FullScreenLoading />;
  }

  return (
    <>
      <ScrollView className="pt-16 pb-20 px-4 bg-background flex-1 ">
        <Heading heading={"Koşu"} />

        <StartRunning bottomSheetRef={bottomSheetRef} />

        <PastRuns getRunsData={getRuns.data} />

        <BottomSheet bottomSheetRef={bottomSheetRef} />
      </ScrollView>
    </>
  );
}
