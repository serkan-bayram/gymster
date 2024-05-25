import { Heading } from "@/components/heading";
import { CountType } from "@/components/running/count-type";
import { StartRunning } from "@/components/running/start-running";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export type RunTime = {
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Running() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [runTime, setRunTime] = useState<RunTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (showModal) {
      bottomSheetRef?.current?.present();

      setIsRunning(true);
    }
  }, [showModal]);

  useEffect(() => {
    let runTimeInterval: NodeJS.Timeout | undefined;

    if (isRunning) {
      runTimeInterval = setInterval(() => {
        setRunTime((prevValue) => {
          const newRunTime: RunTime = { ...prevValue };

          if (newRunTime.seconds >= 59) {
            newRunTime.minutes += 1;
            newRunTime.seconds = 0;
          }

          if (newRunTime.minutes >= 59) {
            newRunTime.hours += 1;
            newRunTime.minutes = 0;
            newRunTime.seconds = 0;
          }

          newRunTime.seconds += 1;

          return newRunTime;
        });
      }, 1000);
    }

    return () => {
      if (runTimeInterval) clearInterval(runTimeInterval);
    };
  }, [isRunning]);

  return (
    <View className="pt-16 pb-20 px-4 bg-background flex-1">
      <Heading heading={"Koşu"} />

      <StartRunning setShowModal={setShowModal} />

      <BottomSheetModal
        handleStyle={{ display: "none" }}
        enablePanDownToClose={false}
        snapPoints={[700]}
        ref={bottomSheetRef}
      >
        <BottomSheetView className="flex-1 ">
          <View className="p-4 px-6 ">
            <View className="mt-6 flex flex-row justify-between items-center">
              <View>
                <View className="flex flex-row">
                  <CountType count={runTime.hours} type="s" />
                  <CountType count={runTime.minutes} type="dk" />
                  <CountType count={runTime.seconds} type="sn" />
                </View>
                <View>
                  <Text className="font-semibold text-xl">
                    Süredir koşuyorsun!
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-center gap-x-3">
                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync();
                    setIsRunning(!isRunning);
                  }}
                >
                  {!isRunning ? (
                    <AntDesign name="play" size={32} color="black" />
                  ) : (
                    <AntDesign name="pausecircleo" size={32} color="black" />
                  )}
                </Pressable>
                <FontAwesome6 name="circle-stop" size={32} color="red" />
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}
