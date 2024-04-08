import { Pressable, Text, View } from "react-native";
import { ExtractSvg, PlusSvg } from "./svg";
import { DEFAULT_GOAL, DEFAULT_UPDATE_VALUE } from "../water";

export function UpdateWaterValue({ currentProgress, setCurrentProgress }) {
  const updateValue = DEFAULT_UPDATE_VALUE;
  const goal = DEFAULT_GOAL;

  const handleClick = (type) => {
    let newProgress;

    if (type === "increase") {
      const calculation = currentProgress + updateValue;

      // We check for any overflow, if new calculation is bigger than
      // goal, just return goal
      newProgress = calculation >= goal ? goal : calculation;
    } else {
      const calculation = currentProgress - updateValue;

      newProgress = calculation <= 0 ? 0 : calculation;
    }

    setCurrentProgress(newProgress);
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
      <Text>by {updateValue} ml</Text>
    </View>
  );
}
