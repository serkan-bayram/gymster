import { PrimaryButton } from "@/components/primary-button";
import { useSession } from "@/utils/session-context";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export default function Profile() {
  const { session, signOut } = useSession();

  return (
    <View className="flex-1 flex items-center pt-16">
      <View className="flex items-center gap-y-2">
        <View className="w-24 h-24 rounded-full bg-black ">
          <Image
            className="flex-1 rounded-full border"
            source={require("@/assets/hammy.png")}
            contentFit="cover"
          />
        </View>
        <Text className="text-lg font-bold">{session.displayName}</Text>
      </View>
      <PrimaryButton
        className="absolute bottom-8"
        text="Log out"
        onPress={signOut}
      />
    </View>
  );
}
