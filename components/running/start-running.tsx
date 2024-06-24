import { Alert, Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/utils/state/store";
import { setNotification } from "@/utils/state/notification/notificationSlice";

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
  const dispatch = useDispatch<AppDispatch>();

  const handlePress = async () => {
    const accessGranted = async () => {
      const isGranted = await requestPermissions();

      if (!isGranted) {
        dispatch(
          setNotification({
            show: true,
            text: {
              heading: "Hata!",
              content: "Gerekli izinler verilmedi.",
            },
            type: "error",
          })
        );
        return;
      }

      bottomSheetRef?.current?.present();
    };

    // Don't ask for permissions if already granted
    const { granted: isForegroundGranted } =
      await Location.getForegroundPermissionsAsync();
    const { granted: isBackgroundGranted } =
      await Location.getBackgroundPermissionsAsync();

    if (isForegroundGranted && isBackgroundGranted) {
      bottomSheetRef?.current?.present();
      return;
    }

    Alert.alert(
      "Uyarı",
      "Koşu özelliğini kullanmak için arka planda her zaman izin ver seçeneğine tıklamanız gerekmektedir.",
      [
        { text: "Tamam", onPress: async () => await accessGranted() },
        { text: "Vazgeç" },
      ]
    );
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
