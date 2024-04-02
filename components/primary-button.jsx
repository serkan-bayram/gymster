import { Pressable, Text } from "react-native";
import { cn } from "../utils/cn";

export function PrimaryButton({ text, className, ...props }) {
  return (
    <Pressable
      {...props}
      className={cn(className, "w-full bg-secondary p-4 rounded-xl")}
    >
      <Text className="text-center text-white">{text}</Text>
    </Pressable>
  );
}
