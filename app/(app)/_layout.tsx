import { useSession } from "@/utils/session-context";
import { Redirect, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { useTime } from "@/utils/time-context";
import { TabBar } from "@/components/tab-bar";

export default function AppLayout() {
  const { session } = useSession();

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/" />;
  }

  const { isLoading } = useTime();

  if (isLoading) {
    return (
      <View>
        <Text className="text-blue-400">Loading...</Text>
      </View>
    );
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <View className="pt-16 mb-16 flex-1 bg-background gap-y-4">
          <Stack>
            <Stack.Screen
              name="tracking/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="profile/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="home/index" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </View>
        <TabBar />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
