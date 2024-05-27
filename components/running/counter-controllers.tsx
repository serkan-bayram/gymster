import { Pressable, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export function CounterControllers({
  isRunning,
  setIsRunning,
}: {
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <View className="flex flex-row items-center gap-x-3">
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setIsRunning(!isRunning);
        }}
      >
        {!isRunning ? (
          <AntDesign name="play" size={32} color="black" />
        ) : (
          <AntDesign name="pausecircleo" size={32} color="black" />
        )}
      </Pressable>
      <FontAwesome6 name="circle-stop" size={32} color="red" />
    </View>
  );
}
