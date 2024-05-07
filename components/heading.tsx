import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View } from "react-native";

type HeadingType = {
  heading: string;
};

export function Heading({ heading }: HeadingType) {
  return (
    <View className="flex px-4 w-full flex-row justify-between items-center">
      <Text className="text-xl font-bold">{heading}</Text>
      <Link href={"/profile"}>
        <View className="w-12 h-12  bg-black rounded-full">
          <Image
            className="flex-1 border rounded-full "
            source={require("@/assets/hammy.png")}
            contentFit="cover"
          />
        </View>
      </Link>
    </View>
  );
}
