import { cn } from "@/utils/cn";
import { View } from "react-native";

interface Divider {
  type: "horizontal" | "vertical";
  dividerClassName?: string;
}

export function Divider({ type, dividerClassName }: Divider) {
  return (
    <View
      className={cn(
        "bg-gray my-0",
        {
          "h-full w-[1px]": type === "vertical",
          "h-[1px] w-full": type === "horizontal",
        },
        dividerClassName
      )}
    ></View>
  );
}
