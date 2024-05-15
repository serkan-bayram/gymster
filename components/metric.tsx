import { cn } from "@/utils/cn";
import { Text, View } from "react-native";

export function Metric({
  heading,
  measurement,
  type,
  iconComponent,
  iconBackgroundColor,
}: {
  heading: string;
  measurement: string;
  type: string;

  iconComponent: React.ReactNode;
  iconBackgroundColor: string;
}) {
  return (
    <View className="h-32 w-32 rounded-3xl p-3 mr-4 bg-gray ">
      <View
        className={cn(
          "bg-black w-12 h-12 rounded-full flex self-start items-center p-3",
          iconBackgroundColor
        )}
      >
        {iconComponent}
      </View>
      <View className="flex mt-3">
        <Text className="font-semibold">{heading}</Text>
        <View className="flex flex-row items-center gap-x-1">
          <Text className="text-lg font-bold">{measurement}</Text>
          <Text>{type}</Text>
        </View>
      </View>
    </View>
  );
}
