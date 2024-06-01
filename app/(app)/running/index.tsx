import { Heading } from "@/components/heading";
import { StartRunning } from "@/components/running/start-running";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { RunningCounter } from "@/components/running/running-counter";
import { CounterControllers } from "@/components/running/counter-controllers";
import { RunningStats } from "@/components/running/running-stats";
import * as TaskManager from "expo-task-manager";
import { LocationObject, LocationObjectCoords } from "expo-location";

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
      // Save coords to localStorage
      const { latitude, longitude } = data.locations[0].coords;

      const coordObject = { latitude: latitude, longitude: longitude };
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

// const useLocation = (isRunning: boolean) => {
//   const [location, setLocation] = useState<LocationObjectCoords | null>(null);

//   // Get coords from localStorage if user is running
//   useEffect(() => {
//     const coordsInterval = setInterval(async () => {
//       const localIsRunning = await AsyncStorage.getItem("isRunning");

//       console.log("localIsRunning: ", localIsRunning);

//       if (localIsRunning) {
//         if (isRunning || JSON.parse(localIsRunning)) {
//           const currentCoords = await AsyncStorage.getItem("coords");

//           if (currentCoords) {
//             setLocation(JSON.parse(currentCoords));
//           }
//         }
//       }
//     }, 3000);

//     return () => clearInterval(coordsInterval);
//   }, []);

//   return { location };
// };
