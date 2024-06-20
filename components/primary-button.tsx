import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { cn } from "../utils/cn";
import { forwardRef } from "react";
import { PressableProps } from "react-native";

interface PrimaryButtonProps extends PressableProps {
  text: string;
  type?: "danger" | "outlined";
  textClassName?: string;
  isLoading?: boolean;
}

// <View, PrimaryButtonProps>
// This component forwardsRef to a View (Pressable is a View under the hood)
// This component expects PrimaryButtonProps type
export const PrimaryButton = forwardRef<View, PrimaryButtonProps>(
  function PrimaryButton(props: PrimaryButtonProps, ref) {
    const { text, type, className, textClassName, isLoading, ...otherProps } =
      props;

    return (
      <Pressable
        disabled={isLoading}
        className={cn(
          " transition-all duration-300 bg-secondary active:bg-secondary/75 p-4 rounded-xl",
          className,
          {
            "bg-red-500 active:bg-red-300": type === "danger",
            "bg-transparent border border-secondary": type === "outlined",
          }
        )}
        {...otherProps}
      >
        {!isLoading ? (
          <Text
            className={cn("text-center text-white", textClassName, {
              "text-black": type === "outlined",
            })}
          >
            {text}
          </Text>
        ) : (
          <ActivityIndicator size="small" color="white" />
        )}
      </Pressable>
    );
  }
);
