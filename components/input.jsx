import { TextInput } from "react-native";
import { cn } from "../utils/cn";

export function Input({ placeholder, className, ...props }) {
  return (
    <TextInput
      {...props}
      placeholder={placeholder}
      className={cn(className, "bg-white  border-2 p-3 rounded-xl")}
    />
  );
}
