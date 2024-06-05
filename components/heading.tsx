import { RootState } from "@/utils/state/store";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

interface Heading {
  heading: string;
}

export function Heading({ heading }: Heading) {
  const user = useSelector((state: RootState) => state.session.user);

  const photoURL = user?.photoURL
    ? user.photoURL
    : require("@/assets/hammy.png");

  return (
    <View className="flex w-full flex-row justify-between items-center">
      <Text className="text-xl font-bold">{heading}</Text>
      <Link href={"/profile"}>
        <View className="w-12 h-12  bg-black rounded-full">
          <Image
            className="flex-1  rounded-full "
            source={photoURL}
            contentFit="cover"
          />
        </View>
      </Link>
    </View>
  );
}
