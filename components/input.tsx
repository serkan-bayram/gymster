import { TextInput, TextInputProps } from "react-native";
import { cn } from "../utils/cn";
import { Dispatch, SetStateAction } from "react";

interface InputProps extends TextInputProps {
  placeholder?: string;
  className?: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  value?: string;
}

export function Input({
  placeholder,
  className,
  onChangeText,
  value,
  ...props
}: InputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      className={cn("bg-white  border-2 p-3 rounded-xl", className)}
      {...props}
    />
  );
}
