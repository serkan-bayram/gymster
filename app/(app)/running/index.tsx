import { Heading } from "@/components/heading";
import { StartRunning } from "@/components/running/start-running";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { RunningCounter } from "@/components/running/running-counter";
import { CounterControllers } from "@/components/running/counter-controllers";
import { RunningStats } from "@/components/running/running-stats";
import * as TaskManager from "expo-task-manager";
import { LocationObject, LocationObjectCoords } from "expo-location";
import { RootState, store } from "@/utils/state/store";
import { setLocation } from "@/utils/state/location/locationSlice";
import { useSelector } from "react-redux";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "running-location-task";

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
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const location = useSelector((state: RootState) => state.location);

  console.log("location: ", location);

  useEffect(() => {
    try {
      (async () => {
        if (isRunning) {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 1,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
              notificationTitle: "Koşu İstatistikleri Hesaplanıyor",
              notificationBody: "Koşmaya devam et!",
              notificationColor: "#000",
            },
          });

          return;
        }

        if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
      })();
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [isRunning]);

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
