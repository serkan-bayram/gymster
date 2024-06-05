import { PrimaryButton } from "@/components/primary-button";
import { signOut } from "@/utils/state/session/sessionSlice";
import { AppDispatch, RootState } from "@/utils/state/store";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.session.user);

  const photoURL = user?.photoURL
    ? user.photoURL
    : require("@/assets/hammy.png");

  const displayName = user?.displayName ? user.displayName : "";

  return (
    <View className="pt-16 flex-1 pb-20 px-4 bg-background">
      <View className=" flex-1 flex items-center ">
        <View className="flex items-center gap-y-2">
          <View className="w-24 h-24 rounded-full bg-black ">
            <Image
              className="flex-1 rounded-full border"
              source={photoURL}
              contentFit="cover"
            />
          </View>
          <Text className="text-lg font-bold">{displayName}</Text>
        </View>
        <PrimaryButton
          className="absolute bottom-8"
          text="Çıkış yap"
          onPress={() => dispatch(signOut())}
        />
      </View>
    </View>
  );
}
