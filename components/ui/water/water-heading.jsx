import { Pressable, Text, View } from "react-native";
import { EditSvg } from "../svg";
import { getOpenBottomSheet } from "@/utils/bottomsheet";

export function WaterHeading({ bottomSheetRef }) {
  const openBottomSheet = getOpenBottomSheet(bottomSheetRef);

  return (
    <View className="flex flex-row  justify-between items-center">
      <Text className="text-lg mb-2 font-semibold">Su değerlerin</Text>
      <Pressable onPress={openBottomSheet}>
        <EditSvg width={"25"} height={"25"} fill={"black"} />
      </Pressable>
    </View>
  );
}
