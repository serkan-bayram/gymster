import { RefObject } from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function StatHeader({
  header,
  monthPicker,
  month,
}: {
  header: string;
  monthPicker: RefObject<any>;
  month: string;
}) {
  return (
    <View className="mb-4 flex flex-row justify-between">
      <Text className="font-semibold text-lg">{header}</Text>
      <Pressable
        onPress={() => monthPicker.current.focus()}
        className="bg-secondary active:bg-secondary/50 transition-all rounded-lg p-2 px-4 justify-between items-center flex flex-row"
      >
        <Text className="text-white">{month}</Text>
        <MaterialIcons name="expand-more" size={16} color="white" />
      </Pressable>
    </View>
  );
}
