import { Pressable, Text } from "react-native";
import { cn } from "../utils/cn";
import { forwardRef } from "react";

export const PrimaryButton = forwardRef(function PrimaryButton(props, ref) {
  const { text, className, ...otherProps } = props;

  return (
    <Pressable
      {...otherProps}
      className={cn(className, "w-full bg-secondary p-4 rounded-xl")}
    >
      <Text className="text-center text-white">{text}</Text>
    </Pressable>
  );
});
