import { Pressable, Text, View } from "react-native";
import { ProgressBar } from "./ui/circular-progressbar";
import { useState } from "react";
import { UpdateWaterValue } from "./ui/update-water-value";
import { EditSvg } from "./ui/svg";

const DEFAULT_UPDATE_VALUE = 200;
const DEFAULT_GOAL = 2000;

export function Water() {
  const [progress, setProgress] = useState(0);

  return (
    <View className="flex-1 mt-2">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-lg mb-2">Hydration</Text>
        <Pressable>
          <EditSvg width={"20"} height={"20"} fill={"black"} />
        </Pressable>
      </View>
      <View className="flex-1 flex-row  gap-y-2">
        <ProgressBar progress={progress} goal={DEFAULT_GOAL} />
        <UpdateWaterValue
          DEFAULT_GOAL={DEFAULT_GOAL}
          DEFAULT_UPDATE_VALUE={DEFAULT_UPDATE_VALUE}
          progress={progress}
          setProgress={setProgress}
        />
      </View>
    </View>
  );
}
