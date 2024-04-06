import { Pressable, Text, View } from "react-native";
import { ExtractSvg, PlusSvg } from "./svg";

export function UpdateWaterValue({
  updateValue,
  goalValue,
  progress,
  setProgress,
}) {
  const handleClick = (type) => {
    let newProgress;

    if (type === "increase") {
      const calculation = progress + updateValue;

      newProgress = calculation >= goalValue ? goalValue : calculation;
    } else {
      const calculation = progress - updateValue;

      newProgress = calculation <= 0 ? 0 : calculation;
    }

    setProgress(newProgress);
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
