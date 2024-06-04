import { Pressable, Text, View } from "react-native";
import { ExtractSvg, PlusSvg } from "../svg";
import { useWater } from "@/utils/water-context";
import { useUpdateWater } from "@/utils/apis/water";

const useCalculateProgress = (type, currentProgress, goal, updateValue) => {
  // If this happens somehow
  if (currentProgress > goal) {
    currentProgress = goal;
  }

  if (type === "increase") {
    const calculation = currentProgress + updateValue;

    // We check for any overflow, if new calculation is bigger than
    // goal, just return goal
    const newProgress = calculation >= goal ? goal : calculation;
    return newProgress;
  } else {
    const calculation = currentProgress - updateValue;

    const newProgress = calculation <= 0 ? 0 : calculation;
    return newProgress;
  }
};

// This component is used to increase or decrease current water progress
export function UpdateWaterValue({ currentProgress, setCurrentProgress }) {
  const { updateValue, goalValue: goal } = useWater();

  const updateWater = useUpdateWater();

  const handleClick = (type) => {
    const newProgress = useCalculateProgress(
      type,
      currentProgress,
      goal,
      updateValue
    );

    setCurrentProgress(newProgress);

    updateWater.mutate({ newProgress: newProgress });
  };

  return (
    <View
      className="flex mr-6 gap-y-2 items-center justify-center
    "
    >
      <View className="flex flex-row gap-x-2">
        <Pressable
          onPress={() => handleClick("increase")}
          className=" bg-white border active:bg-gray-100
       active:scale-110 transition-all
     rounded-xl p-2  transition-300 "
        >
          <PlusSvg width={"20"} height={"20"} fill={"#7AA2E3"} />
        </Pressable>

        <Pressable
          onPress={() => handleClick("decrease")}
          className="bg-white border active:bg-gray-100
       active:scale-110 transition-all
     rounded-xl p-2   transition-300"
        >
          <ExtractSvg width="20" height="20" fill="#7AA2E3" />
        </Pressable>
      </View>
      <Text>{updateValue} ml kadar</Text>
    </View>
  );
}
