import { Text, View } from "react-native";
import { Divider } from "../ui/divider";

interface SetType {
  setIndex: number;
  weight: number;
  repeat: number;
  comment: string;
}

export function Set({ setIndex, weight, repeat, comment }: SetType) {
  return (
    <View className="flex flex-row  pl-3 mb-4">
      <View className="bg-white w-6 h-6 mr-2 flex items-center justify-center rounded-full">
        <Text className="font-semibold text-secondary">{setIndex + 1}</Text>
      </View>
      <View className="w-[80%]">
        <Text className="text-white w-full font-bold">
          {weight} kg / {repeat} tekrar
        </Text>
        {comment && comment.length > 0 && (
          <Text className="text-white mt-1 ">{comment}</Text>
        )}
      </View>
    </View>
  );
}
