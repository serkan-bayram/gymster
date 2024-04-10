import { Image } from "expo-image";
import { View } from "react-native";

export function LandingMascot() {
  return (
    <View className="flex-1  w-72 ">
      <Image
        className="flex-1"
        source={require("../../assets/landing-mascot.png")}
        contentFit="contain"
        transition={1000}
      />
    </View>
  );
}
