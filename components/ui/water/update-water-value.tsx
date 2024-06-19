import { Pressable, Text, View } from "react-native";
import { ExtractSvg, PlusSvg } from "../svg";
import { useUpdateWater } from "@/utils/apis/water";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import { setProgress } from "@/utils/state/water/waterSlice";
import { useSound } from "@/utils/use-sound";

const useCalculateProgress = (
  type: string,
  currentProgress: number,
  goal: number,
  updateValue: number
) => {
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
export function UpdateWaterValue() {
  const {
    updateValue,
    goalValue: goal,
    progress: currentProgress,
  } = useSelector((state: RootState) => state.water);
  const dispatch = useDispatch<AppDispatch>();

  const updateWater = useUpdateWater();

  const playSound = useSound({
    source: require("@/assets/sounds/confirm.mp3"),
  });

  const handleClick = async (type: string) => {
    const newProgress = useCalculateProgress(
      type,
      currentProgress,
      goal,
      updateValue
    );

    dispatch(setProgress(newProgress));

    updateWater.mutate({ newProgress: newProgress });

    if (newProgress >= goal) {
      await playSound();
    }
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
          <PlusSvg width={20} height={20} fill={"#7AA2E3"} />
        </Pressable>

        <Pressable
          onPress={() => handleClick("decrease")}
          className="bg-white border active:bg-gray-100
       active:scale-110 transition-all
     rounded-xl p-2   transition-300"
        >
          <ExtractSvg width={20} height={20} fill="#7AA2E3" />
        </Pressable>
      </View>
      <Text>{updateValue} ml kadar</Text>
    </View>
  );
}
