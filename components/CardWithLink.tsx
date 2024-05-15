import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { Image, ImageSource } from "expo-image";
import { Pressable, Text, View } from "react-native";

export function CardWithLink({
  href,
  text,
  subText,
  imageSrc,
}: {
  href: string;
  text: string;
  subText: string;
  imageSrc: ImageSource;
}) {
  return (
    <Link asChild href={href}>
      <Pressable
        className="bg-primary active:bg-primary/50 transition-all
     relative p-4 border-2 h-48 mt-6 rounded-3xl"
      >
        <View className="flex">
          <Text className="text-lg font-semibold">{subText}</Text>
          <Text className="text-xl font-bold ">{text}</Text>
        </View>

        <View className="flex-1 absolute -bottom-12 -right-4 -z-10">
          <Image
            className="flex-1 h-48 w-48"
            contentFit="contain"
            source={imageSrc}
            transition={300}
          />
        </View>

        <View className="absolute bottom-4 left-4 -scale-x-100 ">
          <AntDesign name="enter" size={32} color="black" />
        </View>
      </Pressable>
    </Link>
  );
}
