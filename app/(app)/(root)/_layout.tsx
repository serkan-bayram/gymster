import { Stack, useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { TabBar } from "@/components/tab-bar";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/state/store";
import { useEffect } from "react";

export default function ProtectedLayout() {
  const router = useRouter();

  const user = useSelector((state: RootState) => state.session.user);

  useEffect(() => {
    if (!user) router.replace("/");
  }, [user]);

  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <View className="flex-1 bg-background">
          <Stack>
            <Stack.Screen name="home/index" options={{ headerShown: false }} />
            <Stack.Screen
              name="tracking/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="workout/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="profile/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="user-info/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="meals-details/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="running/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="running/stat/index"
              options={{ headerShown: false }}
            />
          </Stack>
          <TabBar />

          <StatusBar style="auto" />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
