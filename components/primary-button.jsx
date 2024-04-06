import { Pressable, Text } from "react-native";
import { cn } from "../utils/cn";
import { forwardRef } from "react";

export const PrimaryButton = forwardRef(function PrimaryButton(props, ref) {
  const { text, type, className, textClassName, ...otherProps } = props;

  return (
    <Pressable
      {...otherProps}
      className={cn(
        " transition-all duration-300 bg-secondary active:bg-secondary/75 p-4 rounded-xl",
        className,
        {
          "bg-red-500 active:bg-red-300": type === "danger",
          "bg-white border": type === "outlined",
        }
      )}
    >
      <Text
        className={cn("text-center text-white", textClassName, {
          "text-black": type === "outlined",
        })}
      >
        {text}
      </Text>
    </Pressable>
  );
});
