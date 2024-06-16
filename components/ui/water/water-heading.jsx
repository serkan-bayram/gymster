import { Pressable, Text, View } from "react-native";
import { EditSvg } from "../svg";
import { getOpenBottomSheet } from "@/utils/bottomsheet";
import { cn } from "@/utils/cn";

export function WaterHeading({ bottomSheetRef, currentlyShowing }) {
  const openBottomSheet = getOpenBottomSheet(bottomSheetRef);

  const { showing } = currentlyShowing;

  return (
    <View className="flex flex-row  justify-between items-center">
      <View className="flex flex-row items-center">
        <Text className="text-lg font-semibold">
          {showing === "progress" ? "Su değerlerin" : "Su istatistiklerin"}
        </Text>
        <View className="ml-2 mt-2 flex flex-row">
          <View
            className={cn("w-2 h-2 rounded-full bg-black", {
              "bg-black/20": showing === "chart",
            })}
          ></View>
          <View
            className={cn("w-2 h-2 rounded-full bg-black/20 ml-1", {
              "bg-black": showing === "chart",
            })}
          ></View>
        </View>
      </View>
      <Pressable onPress={openBottomSheet}>
        <EditSvg width={"25"} height={"25"} fill={"black"} />
      </Pressable>
    </View>
  );
}
