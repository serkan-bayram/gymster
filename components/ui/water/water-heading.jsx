import { Pressable, Text, View } from "react-native";
import { EditSvg } from "../svg";
import { useCallback } from "react";

export function WaterHeading({ bottomSheetRef }) {
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <View className="flex flex-row px-4 justify-between items-center">
      <Text className="text-lg mb-2">Hydration</Text>
      <Pressable onPress={handlePresentModalPress}>
        <EditSvg width={"25"} height={"25"} fill={"black"} />
      </Pressable>
    </View>
  );
}
