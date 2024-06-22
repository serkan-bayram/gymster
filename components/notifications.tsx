import { AppDispatch, RootState } from "@/utils/state/store";
import { memo, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { setNotification } from "@/utils/state/notification/notificationSlice";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

function NotificationIcon() {
  const { type } = useSelector((state: RootState) => state.notification);

  switch (type) {
    case "success":
      return <FontAwesome name="check-circle" size={34} color="green" />;
    case "error":
      return <Ionicons name="close-circle" size={34} color="red" />;
    default:
      return <View></View>;
  }
}

const Notification = memo(() => {
  const { text } = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch<AppDispatch>();

  const top = useSharedValue(-96);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    top.value = withSpring(56);

    const timeout = setTimeout(() => dismissNotification(), 4000);

    return () => clearTimeout(timeout);
  }, []);

  const dismissNotification = () => {
    top.value = withSpring(-96);

    const timeout = setTimeout(() => {
      dispatch(setNotification({ show: false }));
    }, 300);

    clearTimeout(timeout);
  };

  return (
    <Animated.View className="absolute -top-24 w-full " style={[{ top: top }]}>
      <Pressable
        onPress={dismissNotification}
        style={styles.notificationContainer}
        className="flex flex-row justify-between  items-center 
        mx-auto w-[80%] bg-white border p-2 border-gray rounded-xl min-h-[56px]"
      >
        <View className="max-w-[90%]">
          <Text className="font-bold text-lg">{text?.heading}</Text>
          <Text>{text?.content}</Text>
        </View>
        <NotificationIcon />
      </Pressable>
    </Animated.View>
  );
});

export function Notifications() {
  const { show } = useSelector((state: RootState) => state.notification);

  return typeof show === "string" ? <Notification key={show} /> : <View></View>;
}

const styles = StyleSheet.create({
  notificationContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1.41,

    elevation: 16,
  },
});
