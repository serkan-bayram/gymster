import { Alert, Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import * as Location from "expo-location";

const requestPermissions = async () => {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();

  if (foregroundStatus === "granted") {
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus === "granted") {
      return true;
    }
  }

  return false;
};

export function StartRunning({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
}) {
  const handlePress = async () => {
    const isGranted = await requestPermissions();

    if (!isGranted) {
      Alert.alert("Konum izni vermeden devam edemezsiniz.");
      return;
    }

    bottomSheetRef?.current?.present();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="w-full h-34 bg-primary 
  border-2 rounded-3xl flex mt-8 p-3  active:opacity-50 transition-all"
    >
      <View>
        <Text className="text-lg font-semibold">Hazır mısın?</Text>
        <View className="flex flex-row gap-x-2">
          <Text className="text-2xl font-bold">Şimdi koşuya başla!</Text>
        </View>
      </View>
      <View className="self-end pr-2 pt-2">
        <AntDesign name="play" size={40} color="black" />
      </View>
    </Pressable>
  );
}
