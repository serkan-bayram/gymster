import { Pressable, Text, View } from "react-native";
import { EditSvg } from "../svg";
import { getOpenBottomSheet } from "@/utils/bottomsheet";
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export function WaterHeading({ bottomSheetRef, chartBottomSheetRef }) {
  const openBottomSheet = getOpenBottomSheet(bottomSheetRef);
  const openChart = getOpenBottomSheet(chartBottomSheetRef);

  return (
    <View className="flex flex-row  justify-between items-center">
      <View className="flex flex-row items-center">
        <Text className="text-lg font-semibold">Su değerlerin</Text>
      </View>
      <View className="flex flex-row gap-x-4">
        <TouchableOpacity onPress={openChart}>
          <Entypo name="bar-graph" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openBottomSheet}>
          <EditSvg width={"25"} height={"25"} fill={"black"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
