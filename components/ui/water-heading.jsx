import { Pressable, Text, View } from "react-native";
import { EditSvg } from "./svg";

export function WaterHeading({ bottomSheetRef }) {
  return (
    <View className="flex flex-row px-4 justify-between items-center">
      <Text className="text-lg mb-2">Hydration</Text>
      <Pressable onPress={() => bottomSheetRef.current.expand()}>
        <EditSvg width={"25"} height={"25"} fill={"black"} />
      </Pressable>
    </View>
  );
}
