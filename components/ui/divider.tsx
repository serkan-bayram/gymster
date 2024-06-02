import { cn } from "@/utils/cn";
import { View } from "react-native";

interface Divider {
  type: "horizontal" | "vertical";
  dividerClassName?: string;
}

export function Divider({ type, dividerClassName }: Divider) {
  return type === "vertical" ? (
    <View
      className={cn("h-full w-[1px] bg-gray my-0", dividerClassName)}
    ></View>
  ) : (
    <View
      className={cn("h-[1px] w-full bg-gray my-0", dividerClassName)}
    ></View>
  );
}
