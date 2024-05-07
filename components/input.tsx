import { TextInput } from "react-native";
import { cn } from "../utils/cn";

interface TextInputProps extends TextInput {
  placeholder?: string;
  className?: string;
}

export function Input({
  placeholder,
  className,
  setState,
  ...props
}: TextInputProps) {
  return (
    <TextInput
      {...props}
      onChangeText={setState}
      placeholder={placeholder}
      className={cn(className, "bg-white  border-2 p-3 rounded-xl")}
    />
  );
}
