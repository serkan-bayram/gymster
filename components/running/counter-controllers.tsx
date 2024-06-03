import { AppState, Pressable, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/utils/state/store";
import {
  firstClickIsDone,
  startRunning,
  stopRunning,
} from "@/utils/state/running/runningSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function CounterControllers({
  handlePress,
}: {
  handlePress?: () => void;
}) {
  const { isRunning, isFirstClicked } = useSelector(
    (state: RootState) => state.running
  );

  const dispatch = useDispatch<AppDispatch>();

  return (
    <View className="flex flex-row items-center gap-x-3">
      <Pressable
        onPress={async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

          if (isFirstClicked) {
            // Save the running start time
            const now = new Date();
            try {
              await AsyncStorage.setItem("runningStartTime", now.toISOString());
              dispatch(firstClickIsDone());
            } catch (error) {
              console.log("Error:", error);
            }
          }

          isRunning ? dispatch(stopRunning()) : dispatch(startRunning());
        }}
      >
        {!isRunning ? (
          <AntDesign name="play" size={32} color="black" />
        ) : (
          <AntDesign name="pausecircleo" size={32} color="black" />
        )}
      </Pressable>
      <Pressable onPress={handlePress}>
        <FontAwesome6 name="circle-stop" size={32} color="red" />
      </Pressable>
    </View>
  );
}
