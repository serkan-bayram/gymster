import { RunTime } from "@/app/(app)/running";
import { cn } from "@/utils/cn";
import { Text, View } from "react-native";

type CountTypeProps = {
  count: number;
  type: "s" | "dk" | "sn";
};

export function CounterType({ count, type }: CountTypeProps) {
  return (
    <View className="flex flex-row items-center mr-2">
      <Text
        className={cn("text-4xl font-bold mr-1", {
          "text-black/20": count === 0,
        })}
      >
        {count}
      </Text>
      <Text
        className={cn("text-2xl ", {
          "text-black/20": count === 0,
        })}
      >
        {type}
      </Text>
    </View>
  );
}
