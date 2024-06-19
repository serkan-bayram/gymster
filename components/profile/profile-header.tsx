import { Image } from "expo-image";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import { ProfileSettings } from "./profile-settings";

export function ProfileHeader() {
  const user = useSelector((state: RootState) => state.session.user);

  const photoURL = user?.photoURL
    ? user.photoURL
    : require("@/assets/hammy.png");

  const displayName = user?.displayName ? user.displayName : "";

  return (
    <View className="flex flex-row justify-between">
      <View className="flex gap-y-2">
        <View className="w-14 h-14 rounded-full bg-black ">
          <Image
            className="flex-1 rounded-full "
            source={photoURL}
            contentFit="cover"
          />
        </View>
        <Text className="text-lg font-bold">{displayName}</Text>
      </View>
      <ProfileSettings />
    </View>
  );
}
